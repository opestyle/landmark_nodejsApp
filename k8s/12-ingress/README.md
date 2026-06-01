# Ingress

## What is an Ingress?

An Ingress exposes HTTP and HTTPS routes from outside the cluster to Services inside the cluster. It provides URL-based routing, SSL termination, and virtual hosting — all from a single external IP.

**Ingress vs LoadBalancer Service:**
- LoadBalancer: one external IP per service (expensive)
- Ingress: one external IP routes to many services based on hostname/path (cost-effective)

**Prerequisite:** An Ingress Controller must be installed (e.g., NGINX Ingress Controller).

## Syntax

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: landmark-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
spec:
  rules:
    - host: landmark-devops.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: landmark-app
                port:
                  number: 80
```

**Key fields:**
- `rules[].host` — The domain name to match
- `rules[].http.paths[].path` — The URL path to match
- `backend.service` — The Service to route traffic to
- `tls` — Enable HTTPS with a TLS certificate

## How to Run

```bash
# Install NGINX Ingress Controller (if not already installed)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# Apply the Ingress
kubectl apply -f ingress.yaml

# Verify
kubectl get ingress -n landmark-devops
```

## How to Access

```bash
# Get the Ingress Controller's external IP
kubectl get svc -n ingress-nginx

# For local testing, add to /etc/hosts (or C:\Windows\System32\drivers\etc\hosts)
# <EXTERNAL-IP>  landmark-devops.example.com

# Then open: http://landmark-devops.example.com
```

## Troubleshooting

```bash
# Check Ingress status
kubectl describe ingress landmark-ingress -n landmark-devops

# Check Ingress Controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx

# No ADDRESS shown for Ingress
# Fix: make sure the Ingress Controller is installed and running
kubectl get pods -n ingress-nginx

# 404 errors
# Check: does the backend Service exist? Does it have endpoints?
kubectl get svc landmark-app -n landmark-devops
kubectl get endpoints landmark-app -n landmark-devops

# 503 errors
# Check: are the backend pods running and ready?
kubectl get pods -n landmark-devops
```

## Key Points

- Ingress requires an Ingress Controller (NGINX, Traefik, ALB, etc.)
- One Ingress can route to multiple services based on host/path
- Use `tls` section + cert-manager for automatic HTTPS certificates
- Ingress only handles HTTP/HTTPS (ports 80/443) — use LoadBalancer for TCP/UDP
