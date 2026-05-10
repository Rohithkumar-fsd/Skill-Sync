from firebase_admin import auth
from fastapi import Header, HTTPException
from app.utils.firebase import init_firebase_app


def verify_firebase_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.split(" ")[1]

    try:
        init_firebase_app()  # ensure Firebase is initialized before verifying
        decoded_token = auth.verify_id_token(token)
        return decoded_token["uid"]
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def get_optional_firebase_token(authorization: str | None = Header(default=None)):
    """Return the Firebase uid when a valid token is present, otherwise None.

    This is useful for endpoints where authentication enables persistence,
    but the core operation should still work without a valid token.
    """
    if not authorization:
        return None

    if not authorization.startswith("Bearer "):
        return None

    token = authorization.split(" ", 1)[1].strip()
    if not token:
        return None

    try:
        init_firebase_app()
        decoded_token = auth.verify_id_token(token)
        return decoded_token.get("uid")
    except Exception:
        return None
