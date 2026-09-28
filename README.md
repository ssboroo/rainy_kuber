<div align="center">

# ☁️ RAINY KUBER

### Kubernetes Security & Compliance SaaS  
**English 🇬🇧 / Монгол 🇲🇳**

A bright, modern security platform that turns **TATAR-Kuber** scan results into an easy-to-understand SaaS dashboard for DevOps, Security, Platform and Management teams.

<br/>

![RAINY KUBER Dashboard](docs/readme/dashboard.svg)

<br/>

**Security Score · Cluster Monitoring · Findings · Scan History · Reports · Compliance Evidence · AI Security Copilot**

</div>

---

## 📌 RAINY KUBER гэж юу вэ?

**RAINY KUBER** нь Kubernetes cluster-ийн аюулгүй байдлыг тасралтгүй шалгаж, олон security scanner-ийн үр дүнг нэг dashboard дээр нэгтгэн харуулдаг **Kubernetes Security & Compliance SaaS** юм.

RAINY KUBER-ийн гол зорилго нь terminal дээр урт JSON/CLI output унших шаардлагагүй болгож:

- cluster-ийн ерөнхий security score харах
- Critical / High / Medium / Low эрсдэлийг ялгах
- ямар resource дээр асуудал байгааг олох
- нэг finding-ийг хэдэн scanner зэрэг илрүүлснийг харах
- өмнөх scan-тай харьцуулах
- засагдсан болон дахин гарч ирсэн finding-үүдийг хянах
- Монгол / English тайлан гаргах
- AI-аас remediation тайлбар авах
- олон cluster-ийг нэг workspace дотор удирдах

боломж олгоно.

> **TATAR-Kuber = Security scanning engine**  
> **RAINY KUBER = Cloud SaaS, dashboard, history, team, reports, lifecycle, AI layer**

---

# ✨ Гол боломжууд

| Module | Тайлбар | Status |
|---|---|---|
| 🔐 Authentication | Register / Login, JWT | ✅ Implemented |
| 🏢 Organization | Multi-tenant organization architecture | ✅ Implemented |
| 👥 Roles | Owner / Admin / Security / Viewer foundation | ✅ Implemented |
| ☸️ Clusters | Cluster бүртгэх, status, environment, score | ✅ Implemented |
| 🔑 Agent Token | Cluster бүрийн тусдаа rotatable token | ✅ Implemented |
| 🤖 RAINY Agent | Cluster дотор read-only scan ажиллуулах | ✅ Reference implementation |
| 🛡️ TATAR-Kuber | Security scan engine integration | ✅ Integrated path |
| 🔍 Findings | Finding жагсаалт + severity + source | ✅ Implemented |
| ♻️ Finding Lifecycle | OPEN → ACKNOWLEDGED → FIXED → VERIFIED | ✅ Implemented |
| 📊 Dashboard | Security score, severity counts, trend | ✅ Implemented |
| 🕓 Scan History | Scan бүрийн score/count хадгалах | ✅ Implemented |
| 🇲🇳🇬🇧 Language | Монгол / English UI | ✅ Implemented |
| 📄 Reports | EN/MN security report data export | ✅ Implemented |
| 🧠 RAINY AI | Security Copilot API/UI foundation | ✅ Local fallback implemented |
| 📋 Audit Log | Security-sensitive үйлдлийн бүртгэл | ✅ Implemented |
| ✅ Compliance Evidence | CIS / NSA/CISA / MITRE / ISO mapping-ready | ✅ Foundation |
| 🐳 Docker | API + Web + PostgreSQL | ✅ Implemented |
| 🌐 Production Web | Nginx static frontend | ✅ Implemented |
| 🔁 CI | API compile + frontend build | ✅ GitHub Actions |
| 💳 Billing | Subscription / Wire.mn | 🚧 Planned |
| 📧 Email | Invite / notification email | 🚧 Planned |
| 🔔 Slack / Telegram | Critical finding alert | 🚧 Planned |
| 📑 PDF Report | Branded PDF audit report | 🚧 Planned |

---

# 🖼️ Dashboard Preview

RAINY KUBER нь dark cybersecurity UI биш, **цайвар, нүдэнд эвтэйхэн enterprise SaaS design** ашиглана.

![Dashboard Preview](docs/readme/dashboard.svg)

Dashboard дээр:

- Overall Security Score
- 7-day trend
- Connected clusters
- Critical findings
- High findings
- Resolved findings
- Priority queue
- Scanner confidence
- RAINY AI Security Copilot

харагдана.

---

# 🏗️ Architecture

![RAINY KUBER Architecture](docs/readme/architecture.svg)

## Architecture-ийн үндсэн санаа

RAINY KUBER cloud сервер дээр customer-ийн kubeconfig хадгалах шаардлагагүй.

```text
Customer Kubernetes Cluster
        │
        ▼
Read-only ServiceAccount
        │
        ▼
RAINY Agent
        │
        ▼
TATAR-Kuber
        │
        ├── Trivy
        ├── Kubescape
        ├── Checkov
        └── Popeye
        │
        ▼
scan-result.json
        │
        │ HTTPS + Agent Token
        ▼
RAINY KUBER API
        │
        ├── Auth / Organization
        ├── Findings lifecycle
        ├── Risk score
        ├── Scan history
        ├── Audit log
        └── Reports / AI
        │
        ▼
PostgreSQL
        │
        ▼
React SaaS Dashboard
```

### Яагаад push architecture ашиглаж байгаа вэ?

RAINY KUBER SaaS сервер customer cluster руу шууд нэвтрэхийн оронд:

1. Agent cluster дотор ажиллана.
2. Read-only permission ашиглана.
3. TATAR-Kuber scan ажиллуулна.
4. Scan output л SaaS руу HTTPS-ээр явуулна.

Ингэснээр customer-ийн Kubernetes credential-ийг central SaaS дээр хадгалах шаардлага багасна.

---

# 🚀 Хэрэглэгчийн үндсэн flow

![Cluster Onboarding](docs/readme/onboarding.svg)

### 1. Account үүсгэнэ

```text
Create account
↓
Name
Email
Password
Organization
```

Account үүсэх үед хэрэглэгч тухайн organization-ийн **Owner** болно.

### 2. Cluster нэмнэ

Dashboard:

```text
Clusters
→ Add Cluster
```

Жишээ:

```text
Name: Production Mongolia
Environment: production
```

### 3. Agent Token авна

RAINY KUBER:

```text
rk_xxxxxxxxxxxxxxxxxxxxxxxxx
```

хэлбэрийн token үүсгэнэ.

> ⚠️ Token-ийн raw утгыг database-д хадгалахгүй.  
> Server талд token-ийн SHA-256 hash хадгалагдана.

### 4. Agent cluster дээр суулгана

Reference Kubernetes manifest:

```text
deploy/kubernetes/rainy-agent.yaml.example
```

### 5. TATAR-Kuber scan ажиллана

Agent нь:

```text
tatar-kuber scan
```

ажиллуулаад output-ийг RAINY KUBER API руу илгээнэ.

### 6. Dashboard автоматаар шинэчлэгдэнэ

- Security score
- Findings
- Severity counts
- Scan history
- Resolved findings
- Trend

шинэчлэгдэнэ.

---

# 🌍 English / Монгол

RAINY KUBER нь эхнээсээ bilingual architecture-тай.

UI дээр:

```text
English ⇄ Монгол
```

солиход scan дахин ажиллахгүй.

Backend finding model:

```text
title_en
title_mn

remediation_en
remediation_mn
```

гэж тусдаа хадгална.

### Example

**English**

```text
Privileged container detected

This workload is running with privileged access.
Review the workload and apply least privilege.
```

**Монгол**

```text
Privileged эрхтэй контейнер илэрлээ

Энэ workload хэт өндөр системийн эрхтэй ажиллаж байна.
Workload-ыг шалгаж, хамгийн бага шаардлагатай эрхийн зарчим хэрэглэнэ.
```

---

# 🗂️ Project Structure

```text
rainy_kuber/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── apps/
│   │
│   ├── api/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── app/
│   │       ├── main.py
│   │       ├── config.py
│   │       ├── db.py
│   │       ├── models.py
│   │       ├── schemas.py
│   │       ├── security.py
│   │       ├── deps.py
│   │       ├── routes.py
│   │       └── services/
│   │
│   ├── web/
│   │   ├── Dockerfile
│   │   ├── nginx.conf
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── api.ts
│   │       ├── i18n.ts
│   │       ├── styles.css
│   │       └── vite-env.d.ts
│   │
│   └── agent/
│       ├── agent.py
│       ├── Dockerfile
│       └── README.md
│
├── deploy/
│   └── kubernetes/
│       └── rainy-agent.yaml.example
│
├── docs/
│   └── readme/
│       ├── dashboard.svg
│       ├── architecture.svg
│       └── onboarding.svg
│
├── .env.example
├── docker-compose.yml
├── THIRD_PARTY_NOTICES.md
└── README.md
```

---

# 💻 Tech Stack

## Frontend

| Technology | Use |
|---|---|
| React | SaaS application UI |
| TypeScript | Type safety |
| Vite | Build/dev tooling |
| Recharts | Security trend charts |
| Lucide | UI icons |
| Nginx | Production static hosting |

## Backend

| Technology | Use |
|---|---|
| FastAPI | REST API |
| Python | Backend language |
| SQLAlchemy | ORM |
| Pydantic | Validation |
| JWT | User authentication |
| Argon2 | Password hashing |
| PostgreSQL | Persistent data |

## Security Engine

| Component | Purpose |
|---|---|
| TATAR-Kuber | Main security aggregation engine |
| Trivy | Vulnerability / config scanning |
| Kubescape | Kubernetes posture |
| Checkov | IaC misconfiguration |
| Popeye | Kubernetes resource analysis |

---

# 🗄️ Data Model

RAINY KUBER-ийн үндсэн entity-үүд:

```text
User
 │
 └── Membership
       │
       ▼
 Organization
       │
       ├── Cluster
       │     │
       │     ├── Scan
       │     │
       │     └── Finding
       │
       └── AuditLog
```

## User

Хэрэглэгчийн account.

Үндсэн field:

```text
id
email
password_hash
name
created_at
```

## Organization

Нэг company/workspace.

```text
id
name
slug
plan
created_at
```

## Membership

User ямар organization-д ямар role-тойг хадгална.

```text
owner
admin
security
viewer
```

## Cluster

Kubernetes cluster.

```text
name
environment
status
score
agent_token_hash
last_seen_at
```

## Scan

Нэг удаагийн security scan.

```text
score
critical
high
medium
low
metadata
created_at
```

## Finding

Security finding lifecycle.

```text
stable_id
control
severity
title_en
title_mn
resource
namespace
status
confidence
found_by
evidence
remediation_en
remediation_mn
```

---

# ♻️ Finding Lifecycle

Finding нь scan бүр дээр шинээр duplicate болж үүсэх биш, **stable_id** ашиглан lifecycle-аар явна.

```text
OPEN
  │
  ▼
ACKNOWLEDGED
  │
  ▼
FIXED
  │
  ▼
VERIFIED
```

Хэрэв өмнө FIXED байсан finding дараагийн scan дээр дахин гарч ирвэл:

```text
FIXED → OPEN
```

болно.

---

# 📊 Security Score

RAINY KUBER score нь:

```text
0 ─────────────────────────── 100
High Risk                  Healthy
```

байдлаар dashboard дээр харагдана.

TATAR-Kuber өөрийн risk score өгсөн бол тэр score-г ашиглах боломжтой.

Fallback calculation:

```text
100
- Critical × 15
- High × 5
- Medium × 2
```

> Production release дээр score algorithm-ийг TATAR-Kuber canonical risk model-той бүрэн нэг мөр болгох нь зөв.

---

# 🔐 Security Model

## 1. Password

Plain password database-д хадгалагдахгүй.

```text
Password
   ↓
Argon2
   ↓
password_hash
```

## 2. User Authentication

```text
Login
  ↓
JWT access token
  ↓
Authorization: Bearer ...
```

## 3. Agent Authentication

Cluster agent user JWT ашиглахгүй.

```text
X-Agent-Token: rk_...
```

header ашиглана.

Database:

```text
raw token ❌
token SHA-256 hash ✅
```

## 4. Kubernetes Permissions

Reference agent role нь:

```text
get
list
watch
```

permission ашиглана.

Write permission шаардахгүй.

## 5. kubeconfig

SaaS database дээр customer-ийн kubeconfig хадгалах шаардлагагүй.

Agent Kubernetes ServiceAccount credentials ашиглан temporary kubeconfig үүсгэнэ.

---

# ⚙️ Environment Variables

Root дээр:

```bash
cp .env.example .env
```

Үндсэн тохиргоо:

```env
ENV=development

SECRET_KEY=replace-with-a-long-random-secret

DATABASE_URL=postgresql+psycopg://rainy:rainy_dev@postgres:5432/rainy_kuber

CORS_ORIGINS=http://localhost:5173,http://localhost:8080

ACCESS_TOKEN_MINUTES=1440

PUBLIC_API_URL=http://localhost:8000

AI_PROVIDER=disabled

OPENAI_API_KEY=
OPENAI_MODEL=
```

### ⚠️ Production дээр

```env
SECRET_KEY
DATABASE_URL
CORS_ORIGINS
```

утгуудыг заавал production secret manager / hosting variables ашиглан тохируулна.

---

# 🐳 Local Development

## Requirements

- Docker
- Docker Compose
- Git

## 1. Clone

```bash
git clone https://github.com/ssboroo/rainy_kuber.git
cd rainy_kuber
```

## 2. Environment

```bash
cp .env.example .env
```

## 3. Start

```bash
docker compose up --build
```

## 4. Open

Frontend:

```text
http://localhost:8080
```

API:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

Health:

```text
http://localhost:8000/health
```

---

# 👤 First Account

Эхний startup дээр hardcoded admin account үүсэхгүй.

Browser дээр:

```text
Create account
```

сонгоод:

```text
Name
Organization
Email
Password
```

оруулна.

Backend автоматаар:

```text
User
+
Organization
+
Owner Membership
```

үүсгэнэ.

---

# ☸️ Kubernetes Cluster Холбох

## Dashboard

```text
Clusters
→ Add Cluster
```

Cluster үүсгэхэд RAINY KUBER agent token буцаана.

### Kubernetes manifest

Template:

```text
deploy/kubernetes/rainy-agent.yaml.example
```

Файлыг хуулж:

```yaml
api-url: "https://YOUR-RAINY-KUBER.example"
agent-token: "YOUR-AGENT-TOKEN"
```

гэсэн хоёр утгыг солино.

Дараа нь:

```bash
kubectl apply -f rainy-agent.yaml
```

---

# 🤖 RAINY Agent

Agent-ийн үүрэг:

```text
1. In-cluster ServiceAccount credential унших
2. Temporary kubeconfig үүсгэх
3. TATAR-Kuber scan ажиллуулах
4. scan-result.json унших
5. RAINY KUBER API руу upload хийх
```

Agent source:

```text
apps/agent/agent.py
```

---

# ⏰ Automatic Scanning

Reference manifest нь Kubernetes CronJob ашиглана.

Default:

```yaml
schedule: "0 */6 * * *"
```

өөрөөр хэлбэл:

> 6 цаг тутам security scan.

Жишээ:

### Өдөрт нэг удаа

```yaml
schedule: "0 2 * * *"
```

### Цаг тутам

```yaml
schedule: "0 * * * *"
```

---

# 🔌 API Overview

Base path:

```text
/api/v1
```

## Authentication

```http
POST /auth/register
POST /auth/login
GET  /me
```

## Dashboard

```http
GET /overview
```

## Clusters

```http
GET  /clusters
POST /clusters
POST /clusters/{cluster_id}/rotate-token
```

## Findings

```http
GET   /findings
PATCH /findings/{finding_id}/status
```

Query:

```text
?lang=en
?lang=mn
?severity=CRITICAL
?status=OPEN
```

## Scan history

```http
GET /scans
```

## Agent ingest

```http
POST /agent/scans
```

Required header:

```http
X-Agent-Token: rk_xxxxxxxxx
```

## Reports

```http
GET /reports/summary?lang=en
GET /reports/summary?lang=mn
```

## AI Assistant

```http
POST /assistant
```

## Compliance

```http
GET /compliance
```

## Organization

```http
GET /organization
```

## Team

```http
GET /team
```

## Audit

```http
GET /audit
```

---

# 📥 Agent Scan Payload

Agent SaaS API руу:

```json
{
  "result": {
    "score": 73,
    "metadata": {
      "cluster": "production"
    },
    "findings": [
      {
        "stable_id": "privileged-container:payment-api",
        "canonical_control": "TATAR-CON-001",
        "severity": "CRITICAL",
        "title": "Privileged container detected",
        "title_mn": "Privileged эрхтэй контейнер илэрлээ",
        "resource": "deployment/payment-api",
        "namespace": "production",
        "confidence": "HIGH",
        "found_by": [
          "trivy",
          "kubescape",
          "checkov"
        ],
        "remediation": "Disable privileged mode.",
        "remediation_mn": "Privileged горимыг унтраана."
      }
    ]
  }
}
```

---

# 🔎 Finding Example

```text
Severity
CRITICAL

Control
TATAR-CON-001

Title
Privileged container detected

Resource
deployment/payment-api

Namespace
production

Detected by
Trivy
Kubescape
Checkov

Confidence
HIGH

Status
OPEN
```

Монгол хэл дээр:

```text
Ноцтой эрсдэл

Privileged эрхтэй контейнер илэрлээ.

Resource:
deployment/payment-api

Namespace:
production

Илрүүлсэн:
Trivy
Kubescape
Checkov
```

---

# 📄 Reports

RAINY KUBER report endpoint нь scan-ыг дахин ажиллуулахгүйгээр:

```text
EN
MN
```

хоёр хэлээр render хийхэд зориулагдсан.

Report-ийн үндсэн хэсэг:

```text
Organization
Assessment summary
Security score
Critical findings
High findings
Medium findings
Low findings
Top findings
Resource
Namespace
Remediation
```

Одоогоор dashboard-аас JSON report татах боломжтой.

### Planned

- PDF
- Organization logo
- Auditor name
- Executive summary
- CIS evidence appendix
- Signature / generated timestamp

---

# ✅ Compliance

RAINY KUBER нь compliance хувь **зохиомлоор гаргахгүй**.

Одоогийн compliance page:

```text
CIS Kubernetes Benchmark
NSA/CISA Kubernetes Hardening
MITRE ATT&CK for Containers
ISO/IEC 27001
```

framework-үүдийн mapping readiness болон бодит security controls-ийг харуулна.

Цааш canonical control mapping нэмэгдэхэд:

```text
TATAR Control
     ↓
Framework Control
     ↓
Evidence
     ↓
Pass / Fail / Not evaluated
```

болно.

---

# 🧠 RAINY AI Security Copilot

RAINY AI module-ийн зорилго:

```text
"What are my top risks?"
"Why is this critical?"
"How do I fix this?"
"Generate a safer YAML"
"What changed since yesterday?"
```

Монгол хэлээр:

```text
"Манай хамгийн өндөр 5 эрсдэл юу вэ?"
"Энэ finding яагаад Critical вэ?"
"Үүнийг яаж засах вэ?"
"Зөв securityContext YAML гарга."
```

Одоогийн backend нь **local safe fallback** хариулттай.

Production AI provider холбоход:

```text
AI_PROVIDER
OPENAI_API_KEY
OPENAI_MODEL
```

environment тохиргоог ашиглах суурь бэлэн.

---

# 👥 Team & Roles

Role architecture:

| Role | Intended Access |
|---|---|
| Owner | Full workspace control |
| Admin | Organization administration |
| Security | Scan / finding management |
| Viewer | Read-only visibility |

Одоогийн Team page membership-үүдийг API-аас харуулна.

Planned:

- Invite member
- Remove member
- Change role
- Email invitation
- SSO/SAML for enterprise

---

# 🧾 Audit Log

Security-sensitive үйлдэл audit log-д бүртгэгдэнэ.

Жишээ:

```text
cluster.created
cluster.token_rotated
scan.ingested
finding.status_changed
```

Audit record:

```text
organization
actor
action
target
details
timestamp
```

---

# 🔄 CI/CD

GitHub Actions:

```text
.github/workflows/ci.yml
```

## API job

```text
Install Python dependencies
↓
Compile all Python modules
```

## Web job

```text
Install Node dependencies
↓
TypeScript validation
↓
Vite production build
```

---

# 🌐 Production Deployment

RAINY KUBER-ийг дараах хэлбэрээр deploy хийж болно:

```text
Cloudflare
    ↓
Frontend / Nginx
    ↓
FastAPI
    ↓
Managed PostgreSQL
```

Suitable platforms:

- Railway
- AWS
- Google Cloud
- Azure
- DigitalOcean
- Kubernetes

## Railway санал болгож буй бүтэц

```text
Service 1
RAINY API

Service 2
RAINY Web

Service 3
PostgreSQL
```

Environment variables-ийг Railway Variables-д байрлуулна.

---

# ⚠️ Production Checklist

Public launch хийхээс өмнө:

- [ ] Strong `SECRET_KEY`
- [ ] HTTPS
- [ ] Production domain
- [ ] Managed PostgreSQL
- [ ] Automated database backup
- [ ] Database migrations / Alembic
- [ ] Restricted CORS
- [ ] Edge rate limiting
- [ ] WAF
- [ ] Error monitoring
- [ ] Uptime monitoring
- [ ] Log retention
- [ ] Agent token rotation policy
- [ ] Email verification
- [ ] Password reset
- [ ] Organization invitation
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] Data Processing Agreement
- [ ] Security disclosure page
- [ ] PDF report generation
- [ ] Real AI provider
- [ ] Payment / subscription
- [ ] Production agent image registry

---

# 🧪 Troubleshooting

## API ажиллахгүй

Check:

```bash
docker compose logs api
```

Health:

```bash
curl http://localhost:8000/health
```

Expected:

```json
{
  "status": "ok",
  "service": "rainy-kuber-api",
  "version": "1.0.0"
}
```

---

## PostgreSQL connection error

```bash
docker compose ps
docker compose logs postgres
```

Check:

```env
DATABASE_URL
```

---

## Web API руу холбогдохгүй

Check build variable:

```text
VITE_API_URL
```

Local:

```text
http://localhost:8000
```

---

## Agent 401

Check:

```text
X-Agent-Token
```

Token rotate хийсэн бол хуучин token ажиллахгүй.

---

## Cluster pending хэвээр

Шалгах зүйлс:

```text
Agent CronJob ажилласан эсэх
↓
TATAR-Kuber binary ажилласан эсэх
↓
RAINY_API_URL зөв эсэх
↓
Agent token зөв эсэх
↓
Network outbound HTTPS боломжтой эсэх
```

Kubernetes:

```bash
kubectl -n rainy-kuber get cronjob
kubectl -n rainy-kuber get jobs
kubectl -n rainy-kuber get pods
```

---

# 🗺️ Roadmap

## Phase 1 — SaaS Core ✅

- Authentication
- Organization
- Cluster
- Agent token
- Scan ingest
- Findings
- History
- EN/MN
- Audit
- Reports
- AI foundation

## Phase 2 — Production Launch

- Railway deployment
- Domain + HTTPS
- Alembic migrations
- Email verification
- Password reset
- Invite members
- Notification system
- PDF reports

## Phase 3 — Commercial SaaS

- Free / Starter / Pro / Business plans
- Wire.mn billing
- Usage limits
- Subscription management
- White-label reports
- Multiple organizations

## Phase 4 — Enterprise

- SSO / SAML
- SCIM
- SIEM integration
- Slack / Teams
- Webhooks
- API keys
- Policy engine
- Custom compliance framework
- Enterprise audit export

---

# 💰 Planned SaaS Plans

| Plan | Clusters | Intended Customer |
|---|---:|---|
| Free | 1 | Developer / test |
| Starter | 3 | Small team |
| Pro | 10 | SaaS company |
| Business | 30 | Larger organization |
| Enterprise | Custom | Bank / fintech / enterprise |

> Billing logic is **not yet enabled** in the current repository.

---

# 👨‍💻 Development Principles

RAINY KUBER development should follow:

### 1. No fake security data

Compliance, risk, evidence, scanner source зэрэг security мэдээллийг зохиомлоор харуулахгүй.

### 2. Least privilege

Agent-д шаардлагагүй Kubernetes write permission өгөхгүй.

### 3. Tenant isolation

Organization бүрийн data тусгаарлагдсан байх ёстой.

### 4. Traceability

Finding өөрчлөлт болон token rotation зэрэг үйлдэл audit log-той байна.

### 5. Bilingual by design

Монгол хэл нь дараа нь нэмсэн translation биш, data model-ийн үндсэн хэсэг байна.

---

# 🔗 TATAR-Kuber

RAINY KUBER нь **TATAR-Kuber** open-source security engine-тэй integration хийдэг.

Upstream:

https://github.com/ochmunkh/Tatar-Kuber

TATAR-Kuber нь Kubernetes security posture assessment хийхэд:

- Trivy
- Kubescape
- Checkov
- Popeye

зэрэг scanner-ийн үр дүнг нэгтгэх architecture-тай.

---

# 📜 License & Attribution

TATAR-Kuber нь **Apache License 2.0** лицензтэй.

RAINY KUBER repository-д third-party attribution:

```text
THIRD_PARTY_NOTICES.md
```

файлд хадгалагдана.

Commercial distribution хийх үед upstream project-ийн license болон attribution шаардлагуудыг мөрдөнө.

---

# 🛡️ Security Notice

RAINY KUBER нь security tooling учраас production deployment хийхдээ:

- default secret ашиглахгүй
- database-аа public internet-д шууд expose хийхгүй
- TLS ашиглах
- backup хийх
- audit log хадгалах
- dependency update хийх
- agent tokens тогтмол rotate хийх

шаардлагатай.

---

<div align="center">

## RAINY KUBER

**See risk clearly. Secure Kubernetes faster.**

Монгол 🇲🇳 · English 🇬🇧

Kubernetes Security · Compliance · AI Assistance

</div>
