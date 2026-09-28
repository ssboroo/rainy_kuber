# RAINY KUBER

Kubernetes Security & Compliance SaaS powered by the TATAR-Kuber engine.

## MVP modules
- Dashboard / Security Score
- Clusters
- Findings
- Scan history
- Reports
- AI Security Assistant (integration-ready)
- Organization / Team foundation

## Stack
- Frontend: React + Vite + TypeScript
- Backend: FastAPI
- Database: PostgreSQL
- Queue/cache: Redis
- Security engine: TATAR-Kuber CLI (Apache-2.0)
- Runtime: Docker Compose

## Quick start
```bash
docker compose up --build
```

Frontend: http://localhost:5173
API docs: http://localhost:8000/docs

## TATAR-Kuber integration
The API expects the `tatar-kuber` binary to be available inside the API runtime or via a dedicated worker image.
The scan service is intentionally isolated behind `app/services/tatar.py` so it can later move to a worker/agent architecture.
