
import os
import pickle
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from typing import Optional

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/drive.file']

class DriveManager:
    def __init__(self):
        self.creds = None
        self.service = None
        self._authenticate()

    def _authenticate(self):
        """Shows basic usage of the Drive v3 API.
        Prints the names and ids of the first 10 files the user has access to.
        """
        # The file token.pickle stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                self.creds = pickle.load(token)
        
        # If there are no (valid) credentials available, let the user log in.
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                if os.path.exists('credentials.json'):
                    flow = InstalledAppFlow.from_client_secrets_file(
                        'credentials.json', SCOPES)
                    self.creds = flow.run_local_server(port=0)
                else:
                    print(" 'credentials.json' not found. Drive Upload Disabled.")
                    return

            # Save the credentials for the next run
            with open('token.pickle', 'wb') as token:
                pickle.dump(self.creds, token)

        try:
            self.service = build('drive', 'v3', credentials=self.creds)
            print("Connected to Google Drive API")
        except Exception as e:
            print(f"Drive Connection Failed: {e}")

    def create_folder(self, folder_name: str, parent_id: Optional[str] = None) -> Optional[str]:
        """Create a folder on Drive, returns ID"""
        if not self.service: return None
        
        file_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        if parent_id:
            file_metadata['parents'] = [parent_id]
            
        try:
            file = self.service.files().create(body=file_metadata, fields='id').execute()
            print(f"  Created Drive Folder: {folder_name} ({file.get('id')})")
            return file.get('id')
        except Exception as e:
            print(f"  Failed to create folder {folder_name}: {e}")
            return None

    def upload_file(self, filename: str, filepath: str, mime_type: str = 'text/markdown', parent_id: Optional[str] = None) -> Optional[str]:
        """Upload a file to Drive"""
        if not self.service: return None
        
        file_metadata = {'name': filename}
        if parent_id:
            file_metadata['parents'] = [parent_id]
            
        media = MediaFileUpload(filepath, mimetype=mime_type, resumable=True)
        
        try:
            file = self.service.files().create(body=file_metadata, media_body=media, fields='id').execute()
            print(f"  Uploaded to Drive: {filename}")
            return file.get('id')
        except Exception as e:
            print(f"  Failed to upload {filename}: {e}")
            return None
