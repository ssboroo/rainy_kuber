from pydantic import BaseModel, EmailStr, Field
from typing import Any

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=10)
    name: str = ""
    organization: str

class ClusterIn(BaseModel):
    name: str
    environment: str = "production"

class FindingStatusIn(BaseModel):
    status: str

class AssistantIn(BaseModel):
    question: str
    lang: str = "en"

class AgentScanIn(BaseModel):
    result: dict[str, Any]
