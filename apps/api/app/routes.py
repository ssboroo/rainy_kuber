from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .services.tatar import run_scan

router = APIRouter()

CLUSTERS = [
    {"id":"prod-mn-01","name":"Production Mongolia","environment":"production","status":"healthy","score":73},
    {"id":"staging-01","name":"Staging","environment":"staging","status":"healthy","score":88},
]

FINDINGS = [
    {"id":"f-001","severity":"CRITICAL","title":"Privileged container","resource":"deployment/payment-api","namespace":"production","found_by":["trivy","kubescape","checkov"],"confidence":"HIGH"},
    {"id":"f-002","severity":"HIGH","title":"Wildcard permissions in ClusterRole","resource":"clusterrole/platform-admin","namespace":"-","found_by":["kubescape"],"confidence":"HIGH"},
    {"id":"f-003","severity":"MEDIUM","title":"Container running as root","resource":"deployment/web","namespace":"production","found_by":["trivy","checkov"],"confidence":"HIGH"},
]

@router.get("/overview")
def overview():
    return {
        "security_score": 73,
        "clusters": len(CLUSTERS),
        "counts": {"critical": 2, "high": 11, "medium": 28, "low": 17},
        "trend": [68, 70, 71, 69, 72, 74, 73],
    }

@router.get("/clusters")
def clusters():
    return CLUSTERS

@router.get("/findings")
def findings():
    return FINDINGS

class ScanRequest(BaseModel):
    cluster_id: str
    kubeconfig_path: str | None = None

@router.post("/scans")
def scan(req: ScanRequest):
    cluster = next((c for c in CLUSTERS if c["id"] == req.cluster_id), None)
    if not cluster:
        raise HTTPException(404, "Cluster not found")
    return run_scan(req.cluster_id, req.kubeconfig_path)
