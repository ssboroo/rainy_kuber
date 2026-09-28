import json, os, subprocess, tempfile, urllib.request

API=os.environ["RAINY_API_URL"].rstrip("/")
TOKEN=os.environ["RAINY_AGENT_TOKEN"]
BIN=os.environ.get("TATAR_KUBER_BIN","tatar-kuber")

def kubeconfig_path(workdir: str) -> str:
    explicit=os.environ.get("KUBECONFIG")
    if explicit:
        return explicit
    host=os.environ.get("KUBERNETES_SERVICE_HOST")
    port=os.environ.get("KUBERNETES_SERVICE_PORT_HTTPS","443")
    token_path="/var/run/secrets/kubernetes.io/serviceaccount/token"
    ca_path="/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"
    if not host or not os.path.exists(token_path):
        raise RuntimeError("KUBECONFIG is missing and in-cluster ServiceAccount credentials are unavailable")
    with open(token_path,"r",encoding="utf-8") as f:
        sa_token=f.read().strip()
    path=os.path.join(workdir,"kubeconfig")
    config=f"""apiVersion: v1
kind: Config
clusters:
- name: in-cluster
  cluster:
    server: https://{host}:{port}
    certificate-authority: {ca_path}
users:
- name: rainy-agent
  user:
    token: {sa_token}
contexts:
- name: rainy
  context:
    cluster: in-cluster
    user: rainy-agent
current-context: rainy
"""
    with open(path,"w",encoding="utf-8") as f:
        f.write(config)
    return path

def main():
    with tempfile.TemporaryDirectory() as out:
        kubeconfig=kubeconfig_path(out)
        subprocess.run([BIN,"scan","--kubeconfig",kubeconfig,"-o",out],check=True,timeout=1800)
        path=os.path.join(out,"scan-result.json")
        with open(path,"r",encoding="utf-8") as f:
            result=json.load(f)
        body=json.dumps({"result":result}).encode()
        req=urllib.request.Request(API+"/api/v1/agent/scans",data=body,headers={"Content-Type":"application/json","X-Agent-Token":TOKEN},method="POST")
        with urllib.request.urlopen(req,timeout=60) as r:
            print(r.read().decode())

if __name__=="__main__":
    main()
