import re, secrets
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from .db import get_db
from .deps import current_context, agent_cluster
from .models import User, Organization, Membership, Cluster, Scan, Finding, AuditLog
from .schemas import LoginIn, RegisterIn, ClusterIn, FindingStatusIn, AgentScanIn, AssistantIn
from .security import hash_password, verify_password, create_token, new_agent_token, hash_agent_token

router=APIRouter()

def audit(db,org,action,target="",actor=None,details=None):
    db.add(AuditLog(org_id=org,actor_user_id=actor,action=action,target=target,details=details or {}))

@router.post("/auth/register")
def register(x:RegisterIn, db:Session=Depends(get_db)):
    if db.query(User).filter_by(email=x.email.lower()).first():
        raise HTTPException(409,"Email already exists")
    slug=re.sub(r"[^a-z0-9]+","-",x.organization.lower()).strip("-")+"-"+secrets.token_hex(2)
    u=User(email=x.email.lower(),name=x.name,password_hash=hash_password(x.password))
    o=Organization(name=x.organization,slug=slug)
    db.add_all([u,o]); db.flush()
    db.add(Membership(user_id=u.id,org_id=o.id,role="owner"))
    db.commit()
    return {"access_token":create_token(u.id,o.id),"token_type":"bearer"}

@router.post("/auth/login")
def login(x:LoginIn, db:Session=Depends(get_db)):
    u=db.query(User).filter_by(email=x.email.lower()).first()
    if not u or not verify_password(x.password,u.password_hash):
        raise HTTPException(401,"Invalid credentials")
    m=db.query(Membership).filter_by(user_id=u.id).first()
    if not m:
        raise HTTPException(403,"No organization membership")
    return {"access_token":create_token(u.id,m.org_id),"token_type":"bearer"}

@router.get("/me")
def me(ctx=Depends(current_context)):
    u=ctx["user"]
    return {"id":u.id,"email":u.email,"name":u.name,"org_id":ctx["org_id"],"role":ctx["role"]}

@router.get("/overview")
def overview(ctx=Depends(current_context), db:Session=Depends(get_db)):
    org=ctx["org_id"]
    clusters=db.query(Cluster).filter_by(org_id=org).all()
    fs=db.query(Finding).filter(Finding.org_id==org,Finding.status.in_(["OPEN","ACKNOWLEDGED"])).all()
    counts={k:sum(1 for f in fs if f.severity==k.upper()) for k in ["critical","high","medium","low"]}
    score=round(sum(c.score for c in clusters)/len(clusters)) if clusters else 100
    scans=db.query(Scan).filter_by(org_id=org).order_by(Scan.created_at.desc()).limit(7).all()[::-1]
    return {"security_score":score,"clusters":len(clusters),"counts":counts,"resolved":db.query(Finding).filter_by(org_id=org,status="FIXED").count(),"trend":[{"date":s.created_at.isoformat(),"score":s.score} for s in scans]}

@router.get("/clusters")
def clusters(ctx=Depends(current_context),db:Session=Depends(get_db)):
    rows=db.query(Cluster).filter_by(org_id=ctx["org_id"]).order_by(Cluster.created_at.desc()).all()
    return [{"id":c.id,"name":c.name,"environment":c.environment,"status":c.status,"score":c.score,"last_seen_at":c.last_seen_at} for c in rows]

@router.post("/clusters")
def create_cluster(x:ClusterIn,ctx=Depends(current_context),db:Session=Depends(get_db)):
    if ctx["role"] not in ["owner","admin","security"]:
        raise HTTPException(403,"Insufficient role")
    token=new_agent_token()
    c=Cluster(org_id=ctx["org_id"],name=x.name,environment=x.environment,agent_token_hash=hash_agent_token(token))
    db.add(c); db.flush()
    audit(db,ctx["org_id"],"cluster.created",c.id,ctx["user"].id,{"name":c.name})
    db.commit()
    return {"cluster":{"id":c.id,"name":c.name,"status":c.status},"agent_token":token,"install":{"api_url":"/api/v1/agent/scans","header":"X-Agent-Token"}}

@router.post("/clusters/{cluster_id}/rotate-token")
def rotate(cluster_id:str,ctx=Depends(current_context),db:Session=Depends(get_db)):
    c=db.query(Cluster).filter_by(id=cluster_id,org_id=ctx["org_id"]).first()
    if not c:
        raise HTTPException(404,"Cluster not found")
    token=new_agent_token(); c.agent_token_hash=hash_agent_token(token)
    audit(db,ctx["org_id"],"cluster.token_rotated",c.id,ctx["user"].id)
    db.commit()
    return {"agent_token":token}

@router.get("/findings")
def findings(severity:str|None=None,status:str|None=None,lang:str=Query("en",pattern="^(en|mn)$"),ctx=Depends(current_context),db:Session=Depends(get_db)):
    q=db.query(Finding).filter_by(org_id=ctx["org_id"])
    if severity: q=q.filter(Finding.severity==severity.upper())
    if status: q=q.filter(Finding.status==status.upper())
    rows=q.order_by(Finding.last_seen_at.desc()).limit(500).all()
    return [{"id":f.id,"severity":f.severity,"title":(f.title_mn if lang=="mn" and f.title_mn else f.title_en),"resource":f.resource,"namespace":f.namespace,"status":f.status,"control":f.control,"confidence":f.confidence,"found_by":f.found_by,"remediation":(f.remediation_mn if lang=="mn" and f.remediation_mn else f.remediation_en),"last_seen_at":f.last_seen_at} for f in rows]

@router.patch("/findings/{finding_id}/status")
def finding_status(finding_id:str,x:FindingStatusIn,ctx=Depends(current_context),db:Session=Depends(get_db)):
    allowed={"OPEN","ACKNOWLEDGED","FIXED","VERIFIED"}
    if x.status.upper() not in allowed:
        raise HTTPException(400,"Invalid status")
    f=db.query(Finding).filter_by(id=finding_id,org_id=ctx["org_id"]).first()
    if not f: raise HTTPException(404,"Finding not found")
    f.status=x.status.upper()
    audit(db,ctx["org_id"],"finding.status_changed",f.id,ctx["user"].id,{"status":f.status})
    db.commit()
    return {"id":f.id,"status":f.status}

@router.get("/scans")
def scans(ctx=Depends(current_context),db:Session=Depends(get_db)):
    rows=db.query(Scan).filter_by(org_id=ctx["org_id"]).order_by(Scan.created_at.desc()).limit(100).all()
    return [{"id":s.id,"cluster_id":s.cluster_id,"status":s.status,"score":s.score,"counts":s.counts,"created_at":s.created_at} for s in rows]

@router.post("/agent/scans")
def ingest(x:AgentScanIn,cluster=Depends(agent_cluster),db:Session=Depends(get_db)):
    result=x.result or {}
    raw_findings=result.get("findings",[])
    counts={"critical":0,"high":0,"medium":0,"low":0}
    for f in raw_findings:
        sev=str(f.get("severity","LOW")).upper()
        if sev.lower() in counts: counts[sev.lower()]+=1
    score=int(result.get("risk_score",result.get("score",max(0,100-counts["critical"]*15-counts["high"]*5-counts["medium"]*2))))
    s=Scan(org_id=cluster.org_id,cluster_id=cluster.id,score=max(0,min(100,score)),counts=counts,metadata_json=result.get("metadata",{}))
    db.add(s); db.flush()
    seen=set()
    for item in raw_findings:
        stable=str(item.get("stable_id") or item.get("id") or f'{item.get("canonical_control","unknown")}:{item.get("resource","")}:{item.get("namespace","")}')
        seen.add(stable)
        f=db.query(Finding).filter_by(cluster_id=cluster.id,stable_id=stable).first()
        vals=dict(org_id=cluster.org_id,scan_id=s.id,control=str(item.get("canonical_control","")),severity=str(item.get("severity","LOW")).upper(),title_en=str(item.get("title") or item.get("control_title") or "Security finding"),title_mn=str(item.get("title_mn","")),resource=str(item.get("resource","")),namespace=str(item.get("namespace","")),confidence=str(item.get("confidence","")),found_by=item.get("found_by",[]),evidence=item.get("evidence",{}),remediation_en=str(item.get("remediation","")),remediation_mn=str(item.get("remediation_mn","")),last_seen_at=datetime.now(timezone.utc))
        if f:
            for k,v in vals.items(): setattr(f,k,v)
            if f.status in ["FIXED","VERIFIED"]: f.status="OPEN"
        else:
            db.add(Finding(cluster_id=cluster.id,stable_id=stable,**vals))
    for f in db.query(Finding).filter_by(cluster_id=cluster.id).all():
        if f.stable_id not in seen and f.status in ["OPEN","ACKNOWLEDGED"]:
            f.status="FIXED"
    cluster.score=s.score; cluster.status="healthy"; cluster.last_seen_at=datetime.now(timezone.utc)
    audit(db,cluster.org_id,"scan.ingested",s.id,None,{"findings":len(raw_findings),"score":s.score})
    db.commit()
    return {"scan_id":s.id,"score":s.score,"counts":counts}

@router.get("/reports/summary")
def report(lang:str=Query("en",pattern="^(en|mn)$"),ctx=Depends(current_context),db:Session=Depends(get_db)):
    ov=overview(ctx,db)
    fs=findings(None,None,lang,ctx,db)
    return {"language":lang,"title":"RAINY KUBER Security Report" if lang=="en" else "RAINY KUBER Аюулгүй байдлын тайлан","overview":ov,"findings":fs[:50]}

@router.post("/assistant")
def assistant(x:AssistantIn,ctx=Depends(current_context),db:Session=Depends(get_db)):
    top=db.query(Finding).filter(Finding.org_id==ctx["org_id"],Finding.status=="OPEN").limit(5).all()
    if x.lang=="mn":
        answer="Нээлттэй CRITICAL болон HIGH эрсдлүүдийг эхэлж засахыг зөвлөж байна. " + ("Эхлэх зүйлс: "+", ".join((f.title_mn or f.title_en) for f in top[:3]) if top else "Нээлттэй finding алга.")
    else:
        answer="Prioritize open CRITICAL and HIGH findings first. " + ("Start with: "+", ".join(f.title_en for f in top[:3]) if top else "There are no open findings.")
    return {"answer":answer,"provider":"local-safe-fallback","lang":x.lang}

@router.get("/audit")
def audit_log(ctx=Depends(current_context),db:Session=Depends(get_db)):
    rows=db.query(AuditLog).filter_by(org_id=ctx["org_id"]).order_by(AuditLog.created_at.desc()).limit(100).all()
    return [{"id":r.id,"action":r.action,"target":r.target,"details":r.details,"created_at":r.created_at} for r in rows]
