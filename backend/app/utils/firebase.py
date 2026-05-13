import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

firebase_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
firebase_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")

if not firebase_admin._apps:
    if firebase_json:
        try:
            print("Initializing Firebase from environment JSON...")
            cred = credentials.Certificate(json.loads(firebase_json))
            firebase_admin.initialize_app(cred)
        except Exception as e:
            print(f"Warning: Failed to initialize Firebase from JSON env var: {e}")
            raise
    elif firebase_path and os.path.exists(firebase_path.strip()):
        print(f"Initializing Firebase from local file: {firebase_path.strip()}")
        cred = credentials.Certificate(firebase_path.strip())
        firebase_admin.initialize_app(cred)
    else:
        try:
            print("Attempting default Firebase initialization...")
            firebase_admin.initialize_app()
        except Exception as e:
            raise RuntimeError(
                "Firebase initialization failed. Set FIREBASE_SERVICE_ACCOUNT_JSON "
                "or FIREBASE_SERVICE_ACCOUNT_PATH."
            ) from e

db = firestore.client()

def init_firebase_app():
    return firebase_admin.get_app()
