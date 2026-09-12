#!/usr/bin/env python3
"""
Utility script to authenticate with Gmail API and generate GMAIL_TOKEN_B64.

Usage:
  1. Download OAuth 2.0 Client ID credentials from Google Cloud Console (Desktop application type).
  2. Save it as 'credentials.json' in this directory or pass the path as argument.
  3. Run: python3 generate_gmail_token.py [path_to_credentials.json]
  4. Complete the login in the browser window.
  5. Copy the printed GMAIL_TOKEN_B64 environment variable and add it to Vercel / Render / .env.
"""

import os
import sys
import pickle
import base64
import json
try:
    from google.auth.transport.requests import Request
    from google_auth_oauthlib.flow import InstalledAppFlow
except ImportError:
    print("❌ Missing required Python libraries.")
    print("Please install them with:")
    print("  pip install google-auth-oauthlib google-auth")
    sys.exit(1)

# Define the scope for Gmail API (Sending emails)
SCOPES = ["https://www.googleapis.com/auth/gmail.send"]


def load_env_credentials():
    env_paths = [
        os.path.join(os.path.dirname(__file__), "..", "artifacts", "srn-backend", ".env"),
        os.path.join(os.path.dirname(__file__), ".env"),
        ".env"
    ]
    for p in env_paths:
        if os.path.exists(p):
            with open(p, "r") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("GOOGLE_CLIENT_ID="):
                        val = line.split("=", 1)[1].strip().strip('"').strip("'")
                        os.environ.setdefault("GOOGLE_CLIENT_ID", val)
                    elif line.startswith("GOOGLE_CLIENT_SECRET="):
                        val = line.split("=", 1)[1].strip().strip('"').strip("'")
                        os.environ.setdefault("GOOGLE_CLIENT_SECRET", val)

def main():
    load_env_credentials()
    credentials_file = "credentials.json"
    if len(sys.argv) > 1:
        credentials_file = sys.argv[1]

    flow = None
    client_id = os.environ.get("GOOGLE_CLIENT_ID")
    client_secret = os.environ.get("GOOGLE_CLIENT_SECRET")

    token_pickle_path = "token.pickle"
    creds = None

    # Load credentials from token.pickle if available
    if os.path.exists(token_pickle_path):
        try:
            with open(token_pickle_path, "rb") as token_file:
                creds = pickle.load(token_file)
        except Exception as e:
            print(f"⚠️ Warning loading existing {token_pickle_path}: {e}")
            creds = None

    # If credentials are invalid or don't exist, get new ones
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("🔄 Refreshing expired credentials...")
            creds.refresh(Request())
        else:
            print("🌐 Initiating Google OAuth authorization flow...")
            if os.path.exists(credentials_file):
                print(f"📄 Using credentials file: {credentials_file}")
                flow = InstalledAppFlow.from_client_secrets_file(credentials_file, SCOPES)
            elif client_id and client_secret:
                print(f"🔑 Using GOOGLE_CLIENT_ID from artifacts/srn-backend/.env")
                client_config = {
                    "installed": {
                        "client_id": client_id,
                        "client_secret": client_secret,
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token",
                        "redirect_uris": ["http://localhost"]
                    }
                }
                flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
            else:
                print(f"❌ Error: '{credentials_file}' not found and GOOGLE_CLIENT_ID/SECRET not set in .env.")
                print("Please download credentials.json from Google Cloud Console or add credentials to .env.")
                sys.exit(1)
            print("👉 Opening your browser to complete Google Sign-in...")
            creds = flow.run_local_server(port=8090, access_type='offline', prompt='consent')

        # Save the credentials for future use
        with open(token_pickle_path, "wb") as token_file:
            pickle.dump(creds, token_file)
        print(f"✅ {token_pickle_path} created successfully!")

    # Extract base64 encoded pickle data
    with open(token_pickle_path, "rb") as token_file:
        raw_pickle = token_file.read()
    b64_pickle = base64.b64encode(raw_pickle).decode("utf-8")

    # Also extract structured JSON representation
    token_json = {
        "token": getattr(creds, "token", None),
        "refresh_token": getattr(creds, "refresh_token", None),
        "token_uri": getattr(creds, "token_uri", "https://oauth2.googleapis.com/token"),
        "client_id": getattr(creds, "client_id", None),
        "client_secret": getattr(creds, "client_secret", None),
        "scopes": getattr(creds, "scopes", SCOPES),
    }
    b64_json = base64.b64encode(json.dumps(token_json).encode("utf-8")).decode("utf-8")

    with open("token.json", "w") as jf:
        json.dump(token_json, jf, indent=2)

    print("\n" + "=" * 70)
    print("🎉 GMAIL OAUTH CREDENTIALS GENERATED SUCCESSFULLY!")
    print("=" * 70)
    print("\nAdd this environment variable to your Vercel / Render project:")
    print("-" * 70)
    print(f"GMAIL_TOKEN_B64={b64_pickle}")
    print("-" * 70)
    print("\n(Optional) Individual variables extracted from your token:")
    if token_json.get("client_id"):
        print(f"GMAIL_CLIENT_ID={token_json['client_id']}")
    if token_json.get("client_secret"):
        print(f"GMAIL_CLIENT_SECRET={token_json['client_secret']}")
    if token_json.get("refresh_token"):
        print(f"GMAIL_REFRESH_TOKEN={token_json['refresh_token']}")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    main()
