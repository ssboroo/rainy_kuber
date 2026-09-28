# RAINY KUBER

**Kubernetes Security & Compliance SaaS — English / Монгол.**

RAINY KUBER turns TATAR-Kuber scan results into a multi-tenant cloud product with cluster onboarding, persistent findings, scan history, reports, team-ready roles, audit logs and an AI assistant integration layer.

## Architecture

```
Customer Kubernetes
  → read-only RAINY Agent
  → TATAR-Kuber scan
  → HTTPS scan-result.json
  → FastAPI
  → PostgreSQL
  → React SaaS dashboard
```

The SaaS does **not** need to store customer kubeconfig files. Each cluster receives a rotatable agent token; the agent runs near the cluster and sends only scan output.

## Local start

```bash
cp .env.example .env
docker compose up --build
```

- Web: http://localhost:8080
- API: http://localhost:8000
- API docs: http://localhost:8000/docs

Create the first account from the Register screen.

## Included

- JWT authentication
- Organization + role foundation
- Cluster onboarding and rotatable agent token
- Agent-side TATAR-Kuber scanning
- Persistent scan history
- Findings lifecycle: OPEN → ACKNOWLEDGED → FIXED → VERIFIED
- Security score and trends
- English / Mongolian UI
- English / Mongolian report rendering
- Audit log API
- AI assistant integration layer with local safe fallback
- Production Nginx web image
- PostgreSQL Docker stack

## Before public launch

Use HTTPS, managed PostgreSQL with backups, strong SECRET_KEY, restrictive CORS, secret management, edge rate limiting/WAF, monitoring, alerting, database migrations, email provider configuration and regular token rotation.

See THIRD_PARTY_NOTICES.md for TATAR-Kuber attribution.
