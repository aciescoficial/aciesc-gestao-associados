#!/usr/bin/env python3
"""
Servidor web para upload Drive → YouTube
Rode: python server.py
Acesse: http://localhost:5555
"""

import os
import re
import json
import queue
import tempfile
import threading
from pathlib import Path

from flask import Flask, request, Response, send_from_directory

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload

app = Flask(__name__, static_folder="static")

SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/youtube.upload",
]

CREDENTIALS_DIR = Path(__file__).parent / "credentials"
CLIENT_SECRETS = CREDENTIALS_DIR / "client_secrets.json"
TOKEN_FILE = CREDENTIALS_DIR / "token.json"


def get_credentials():
    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRETS), SCOPES)
            creds = flow.run_local_server(port=0)
        TOKEN_FILE.write_text(creds.to_json())
    return creds


def extract_file_id(url: str) -> str:
    for pattern in [r"/file/d/([a-zA-Z0-9_-]+)", r"id=([a-zA-Z0-9_-]+)", r"/d/([a-zA-Z0-9_-]+)"]:
        m = re.search(pattern, url)
        if m:
            return m.group(1)
    raise ValueError(f"Não foi possível extrair o ID do link: {url}")


def run_upload(drive_url: str, title: str, q: queue.Queue):
    def emit(msg, pct=None):
        data = {"message": msg}
        if pct is not None:
            data["progress"] = pct
        q.put(data)

    try:
        emit("Autenticando com Google...", 2)
        creds = get_credentials()
        drive = build("drive", "v3", credentials=creds)
        youtube = build("youtube", "v3", credentials=creds)

        file_id = extract_file_id(drive_url)

        emit("Buscando informações do arquivo...", 5)
        meta = drive.files().get(fileId=file_id, fields="name,size,mimeType").execute()
        name = meta.get("name", "video")
        size_mb = int(meta.get("size", 0)) / (1024 * 1024)
        emit(f"Arquivo: {name} ({size_mb:.1f} MB)", 8)

        with tempfile.TemporaryDirectory() as tmpdir:
            dest = os.path.join(tmpdir, "video.mp4")
            req = drive.files().get_media(fileId=file_id)

            emit("Baixando do Google Drive...", 10)
            with open(dest, "wb") as fh:
                downloader = MediaIoBaseDownload(fh, req, chunksize=10 * 1024 * 1024)
                done = False
                while not done:
                    status, done = downloader.next_chunk()
                    if status:
                        pct = 10 + int(status.progress() * 40)
                        emit(f"Download: {int(status.progress() * 100)}%", pct)

            emit("Download completo. Iniciando upload para o YouTube...", 52)

            body = {
                "snippet": {
                    "title": title,
                    "description": "",
                    "categoryId": "22",
                },
                "status": {"privacyStatus": "unlisted"},
            }
            media = MediaFileUpload(dest, chunksize=10 * 1024 * 1024, resumable=True)
            insert_req = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

            response = None
            while response is None:
                status, response = insert_req.next_chunk()
                if status:
                    pct = 52 + int(status.progress() * 45)
                    emit(f"Upload YouTube: {int(status.progress() * 100)}%", pct)

            video_id = response.get("id")
            url = f"https://youtu.be/{video_id}"
            emit(f"DONE:{url}", 100)

    except Exception as e:
        q.put({"error": str(e)})


@app.route("/")
def index():
    return send_from_directory("static", "index.html")


@app.route("/upload", methods=["POST"])
def upload():
    data = request.get_json()
    drive_url = (data.get("url") or "").strip()
    title = (data.get("title") or "").strip()

    if not drive_url or not title:
        return {"error": "URL e título são obrigatórios"}, 400

    q = queue.Queue()

    def generate():
        threading.Thread(target=run_upload, args=(drive_url, title, q), daemon=True).start()
        while True:
            item = q.get()
            yield f"data: {json.dumps(item)}\n\n"
            if "error" in item or (item.get("message", "").startswith("DONE:")):
                break

    return Response(generate(), mimetype="text/event-stream",
                    headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


if __name__ == "__main__":
    print("Acesse: http://localhost:5555")
    app.run(port=5555, debug=False)
