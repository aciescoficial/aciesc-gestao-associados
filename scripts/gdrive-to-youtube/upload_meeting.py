#!/usr/bin/env python3
"""
Google Drive Meeting → YouTube Uploader
Uso: python upload_meeting.py <link_do_drive>
"""

import os
import re
import sys
import tempfile
import argparse
from pathlib import Path

# Google APIs
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload

SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/youtube.upload",
]

CREDENTIALS_DIR = Path(__file__).parent / "credentials"
CLIENT_SECRETS = CREDENTIALS_DIR / "client_secrets.json"
TOKEN_FILE = CREDENTIALS_DIR / "token.json"


def get_google_credentials() -> Credentials:
    creds = None

    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CLIENT_SECRETS.exists():
                print(f"[ERRO] Arquivo não encontrado: {CLIENT_SECRETS}")
                print("Siga o README.md para configurar as credenciais OAuth.")
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRETS), SCOPES)
            creds = flow.run_local_server(port=0)

        TOKEN_FILE.write_text(creds.to_json())

    return creds


def extract_file_id(drive_url: str) -> str:
    patterns = [
        r"/file/d/([a-zA-Z0-9_-]+)",
        r"id=([a-zA-Z0-9_-]+)",
        r"/d/([a-zA-Z0-9_-]+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, drive_url)
        if match:
            return match.group(1)
    print(f"[ERRO] Não foi possível extrair o ID do arquivo da URL: {drive_url}")
    sys.exit(1)


def download_from_drive(service, file_id: str, dest_path: str) -> str:
    print(f"[Drive] Buscando metadados do arquivo...")
    meta = service.files().get(fileId=file_id, fields="name,mimeType,size").execute()
    name = meta.get("name", "video")
    size_mb = int(meta.get("size", 0)) / (1024 * 1024)
    print(f"[Drive] Arquivo: {name} ({size_mb:.1f} MB)")

    request = service.files().get_media(fileId=file_id)

    print(f"[Drive] Baixando para {dest_path}...")
    with open(dest_path, "wb") as fh:
        downloader = MediaIoBaseDownload(fh, request, chunksize=10 * 1024 * 1024)
        done = False
        while not done:
            status, done = downloader.next_chunk()
            if status:
                print(f"  {int(status.progress() * 100)}%", end="\r")
    print("\n[Drive] Download completo.")
    return name


def upload_to_youtube(service, file_path: str, title: str, description: str = "") -> str:
    body = {
        "snippet": {
            "title": title,
            "description": description,
            "categoryId": "22",  # People & Blogs
        },
        "status": {
            "privacyStatus": "unlisted",
        },
    }

    media = MediaFileUpload(file_path, chunksize=10 * 1024 * 1024, resumable=True)

    print(f"[YouTube] Enviando '{title}'...")
    request = service.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"  {int(status.progress() * 100)}%", end="\r")

    video_id = response.get("id")
    print(f"\n[YouTube] Upload completo!")
    print(f"[YouTube] https://youtu.be/{video_id}")
    return video_id


def main():
    parser = argparse.ArgumentParser(description="Sobe vídeo do Google Drive para o YouTube")
    parser.add_argument("drive_url", help="Link do Google Drive")
    parser.add_argument("--title", "-t", help="Título do vídeo no YouTube (opcional, será pedido interativamente)")
    parser.add_argument("--description", "-d", default="", help="Descrição do vídeo")
    args = parser.parse_args()

    print("=== Drive → YouTube Uploader ===\n")

    creds = get_google_credentials()
    drive_service = build("drive", "v3", credentials=creds)
    youtube_service = build("youtube", "v3", credentials=creds)

    file_id = extract_file_id(args.drive_url)

    with tempfile.TemporaryDirectory() as tmpdir:
        dest_path = os.path.join(tmpdir, "video.mp4")
        original_name = download_from_drive(drive_service, file_id, dest_path)

        title = args.title
        if not title:
            suggested = os.path.splitext(original_name)[0]
            title = input(f"\nTítulo para o YouTube [{suggested}]: ").strip()
            if not title:
                title = suggested

        upload_to_youtube(youtube_service, dest_path, title, args.description)


if __name__ == "__main__":
    main()
