import json, os, subprocess, tempfile, urllib.request

API=os.environ["RAINY_API_URL"].rstrip("/")
TOKEN=os.environ["RAINY_AGENT_TOKEN"]
KUBECONFIG=os.environ.get("KUBECONFIG","/kube/config")
BIN=os.environ.get("TATAR_KUBER_BIN","tatar-kuber")

def main():
    with tempfile.TemporaryDirectory() as out:
        subprocess.run([BIN,"scan","--kubeconfig",KUBECONFIG,"-o",out],check=True,timeout=1800)
        path=os.path.join(out,"scan-result.json")
        with open(path,"r",encoding="utf-8") as f:
            result=json.load(f)
        body=json.dumps({"result":result}).encode()
        req=urllib.request.Request(
            API+"/api/v1/agent/scans",
            data=body,
            headers={"Content-Type":"application/json","X-Agent-Token":TOKEN},
            method="POST",
        )
        with urllib.request.urlopen(req,timeout=60) as r:
            print(r.read().decode())

if __name__=="__main__":
    main()
