# RAINY KUBER Agent

Reference push agent for customer Kubernetes clusters.

Run it where a read-only kubeconfig and TATAR-Kuber binary are available.

Environment:
- RAINY_API_URL
- RAINY_AGENT_TOKEN
- KUBECONFIG
- TATAR_KUBER_BIN (optional)

Production deployment should use a read-only Kubernetes service account and a CronJob or hardened worker.
