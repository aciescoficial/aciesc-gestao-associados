# Drive → YouTube Uploader

Baixa um vídeo do Google Drive e sobe para o YouTube automaticamente.

## Setup (uma vez só)

### 1. Instalar dependências Python

```bash
cd scripts/gdrive-to-youtube
pip install -r requirements.txt
```

### 2. Criar projeto no Google Cloud Console

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto novo (ex: `meeting-uploader`)
3. Ative as APIs:
   - **Google Drive API**
   - **YouTube Data API v3**
4. Vá em **APIs & Services → Credentials**
5. Clique em **Create Credentials → OAuth client ID**
   - Tipo: **Desktop app**
   - Nome: qualquer
6. Baixe o JSON e salve como:
   ```
   scripts/gdrive-to-youtube/credentials/client_secrets.json
   ```
7. Em **OAuth consent screen**, adicione seu e-mail como **Test user**

> O arquivo `credentials/token.json` é gerado automaticamente na primeira execução e reutilizado depois.

---

## Uso

```bash
python upload_meeting.py "https://drive.google.com/file/d/XXXXXXXXXXX/view"
```

Com título direto (sem prompt interativo):

```bash
python upload_meeting.py "https://drive.google.com/..." --title "Reunião ACIESC - Junho 2026"
```

Com descrição:

```bash
python upload_meeting.py "https://drive.google.com/..." -t "Reunião Diretoria" -d "Pauta: orçamento Q3"
```

---

## Comportamento

- O vídeo é baixado para uma pasta temporária (apagada automaticamente após o upload)
- O vídeo sobe como **Unlisted** (link privado, não aparece em buscas)
- Na primeira execução, abre o navegador para autorizar as contas Google
- O token é salvo em `credentials/token.json` — não commitar este arquivo

## .gitignore recomendado

```
credentials/client_secrets.json
credentials/token.json
```
