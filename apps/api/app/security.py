import hashlib, secrets
from datetime import datetime, timedelta, timezone
import jwt
from pwdlib import PasswordHash
from .config import settings

ph = PasswordHash.recommended()

def hash_password(v: str) -> str:
    return ph.hash(v)

def verify_password(v: str, h: str) -> bool:
    return ph.verify(v, h)

def create_token(user_id: str, org_id: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_minutes)
    return jwt.encode({"sub": user_id, "org": org_id, "exp": exp}, settings.secret_key, algorithm="HS256")

def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.secret_key, algorithms=["HS256"])

def new_agent_token() -> str:
    return "rk_" + secrets.token_urlsafe(32)

def hash_agent_token(v: str) -> str:
    return hashlib.sha256(v.encode()).hexdigest()
