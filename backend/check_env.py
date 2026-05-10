import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth
import json

load_dotenv()

def check_keys():
    print("--- Environment Check ---")
    print(f"PROJECT_NAME: {os.getenv('PROJECT_NAME')}")
    print(f"ENV: {os.getenv('ENV')}")
    
    openai_key = os.getenv('OPENAI_API_KEY')
    print(f"OPENAI_API_KEY: {'[SET]' if openai_key else '[MISSING]'}")
    
    azure_key = os.getenv('AZURE_OPENAI_API_KEY')
    print(f"AZURE_OPENAI_API_KEY: {'[SET]' if azure_key else '[MISSING]'}")

    fb_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')
    fb_inline = os.getenv('FIREBASE_SERVICE_ACCOUNT')
    
    print(f"FIREBASE_SERVICE_ACCOUNT_PATH: {fb_path if fb_path else '[MISSING]'}")
    print(f"FIREBASE_SERVICE_ACCOUNT: {'[SET]' if fb_inline else '[MISSING]'}")

    if fb_path:
        if os.path.exists(fb_path):
            print(f"SUCCESS: Service account file found at {fb_path}")
        else:
            print(f"ERROR: Service account file NOT found at {fb_path}")

    try:
        if not firebase_admin._apps:
            if fb_path:
                cred = credentials.Certificate(fb_path)
                firebase_admin.initialize_app(cred)
            elif fb_inline:
                cred = credentials.Certificate(json.loads(fb_inline))
                firebase_admin.initialize_app(cred)
            else:
                print("ERROR: No Firebase service account configured.")
                return
        print("SUCCESS: Firebase Admin SDK initialized successfully.")
        
        # Check project id
        app = firebase_admin.get_app()
        print(f"Firebase Project ID: {app.project_id}")
        
    except Exception as e:
        print(f"ERROR: Firebase initialization failed: {e}")

if __name__ == "__main__":
    check_keys()
