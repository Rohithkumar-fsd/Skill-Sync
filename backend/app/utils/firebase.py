import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase using the JSON string from environment variable
firebase_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

if not firebase_json:
    raise RuntimeError("FIREBASE_SERVICE_ACCOUNT_JSON environment variable is missing.")

cred = credentials.Certificate(json.loads(firebase_json))
firebase_admin.initialize_app(cred)

# Export Firestore client for the rest of the application
db = firestore.client()
