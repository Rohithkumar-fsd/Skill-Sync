import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

_db = None

def init_firebase_app():
    """Initialize Firebase app (idempotent — safe to call multiple times)."""
    if firebase_admin._apps:
        return  # already initialized

    # Option 1: path to the JSON key file (recommended)
    path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    if path:
        import pathlib
        key_path = pathlib.Path(path.strip())
        if not key_path.exists():
            raise RuntimeError(f"FIREBASE_SERVICE_ACCOUNT_PATH file not found: {key_path}")
        cred = credentials.Certificate(str(key_path))
        firebase_admin.initialize_app(cred)
        return

    # Option 2: inline JSON string
    FIREBASE_SERVICE_ACCOUNT = os.getenv("FIREBASE_SERVICE_ACCOUNT")
    if not FIREBASE_SERVICE_ACCOUNT:
        raise RuntimeError("Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT env var")

    try:
        service_account_info = json.loads(FIREBASE_SERVICE_ACCOUNT)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"FIREBASE_SERVICE_ACCOUNT is not valid JSON: {e}")

    cred = credentials.Certificate(service_account_info)
    firebase_admin.initialize_app(cred)

def get_db():
    global _db
    if _db is not None:
        return _db
    init_firebase_app()
    _db = firestore.client()
    return _db

# Lazy proxy — resolves on first access so the app boots even if env var missing
class _LazyDB:
    def __getattr__(self, name):
        return getattr(get_db(), name)

db = _LazyDB()
