from fastapi import Depends, Header, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from .db import get_db
from .models import Membership, User, Cluster
from .security import decode_token, hash_agent_token

bearer = HTTPBearer(auto_error=False)

def current_context(creds: HTTPAuthorizationCredentials | None = Depends(bearer), db: Session = Depends(get_db)):
    if not creds:
        raise HTTPException(401, "Authentication required")
    try:
        p = decode_token(creds.credentials)
    except Exception:
        raise HTTPException(401, "Invalid or expired token")
    user = db.get(User, p["sub"])
    membership = db.query(Membership).filter_by(user_id=p["sub"], org_id=p["org"]).first()
    if not user or not membership:
        raise HTTPException(401, "Membership not found")
    return {"user": user, "org_id": p["org"], "role": membership.role}

def agent_cluster(x_agent_token: str | None = Header(default=None), db: Session = Depends(get_db)):
    if not x_agent_token:
        raise HTTPException(401, "Missing agent token")
    cluster = db.query(Cluster).filter_by(agent_token_hash=hash_agent_token(x_agent_token)).first()
    if not cluster:
        raise HTTPException(401, "Invalid agent token")
    return cluster
