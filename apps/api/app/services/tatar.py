import os
import subprocess
import tempfile


def run_scan(cluster_id: str, kubeconfig_path: str | None = None):
    binary = os.getenv("TATAR_KUBER_BIN", "tatar-kuber")
    if not kubeconfig_path:
        return {
            "status": "queued",
            "cluster_id": cluster_id,
            "mode": "demo",
            "message": "TATAR-Kuber integration is ready; provide an agent/worker kubeconfig mount for live scans."
        }

    with tempfile.TemporaryDirectory() as out_dir:
        cmd = [binary, "scan", "--kubeconfig", kubeconfig_path, "-o", out_dir]
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=900)
        return {
            "status": "completed" if proc.returncode == 0 else "failed",
            "cluster_id": cluster_id,
            "exit_code": proc.returncode,
            "stdout": proc.stdout[-4000:],
            "stderr": proc.stderr[-4000:],
        }
