from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .db import Base, engine
from .routes import router

app=FastAPI(title="RAINY KUBER API",version="1.0.0")
origins=[x.strip() for x in settings.cors_origins.split(",") if x.strip()]
app.add_middleware(CORSMiddleware,allow_origins=origins,allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
app.include_router(router,prefix="/api/v1")

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status":"ok","service":"rainy-kuber-api","version":"1.0.0"}
