from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    env: str = "development"
    secret_key: str = "change-me"
    database_url: str = "sqlite:///./rainy.db"
    cors_origins: str = "http://localhost:5173,http://localhost:8080"
    access_token_minutes: int = 1440
    public_api_url: str = "http://localhost:8000"
    demo_seed: bool = True
    ai_provider: str = "disabled"
    openai_api_key: str = ""
    openai_model: str = ""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
