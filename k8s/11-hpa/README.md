# HorizontalPodAutoscaler (HPA)

## What is an HPA?

A HorizontalPodAutoscaler automatically scales the number of pod replicas in a Deployment or StatefulSet based on observed CPU/memory utilization or custom metrics.

**How it works:**
1. HPA checks metrics every 15 seconds (default)
2. If average CPU > target (e.g., 70%), it adds more pods
3. If average CPU < target, it removes pods (with a cooldown period)
4. It never goes below `minReplicas` or above `maxReplicas`

**Prerequisite:** Metrics Server must be installed in the cluster (`kubectl top pods` must work).

## Syntax

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: landmark-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: landmark-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**Key fields:**
- `scaleTargetRef` — The Deployment or StatefulSet to scale
- `minReplicas` / `maxReplicas` — Scaling bounds
- `metrics` — What triggers scaling (CPU, memory, or custom metrics)

## How to Run

```bash
# Make sure the Deployment exists first
kubectl apply -f ../04-deployment/deployment.yaml
kubectl apply -f hpa.yaml

# Verify
kubectl get hpa -n landmark-devops
```

## How to Access

```bash
# Watch HPA in action
kubectl get hpa -n landmark-devops -w

# Check current metrics
kubectl top pods -n landmark-devops
```

## Troubleshooting

```bash
# HPA shows <unknown> for metrics
kubectl describe hpa landmark-app-hpa -n landmark-devops
# Fix: install Metrics Server
# kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# HPA not scaling
# Check: does the Deployment have resource requests defined?
# HPA needs resource requests to calculate utilization percentages

# Generate load to test scaling
kubectl run load-test --rm -it --image=busybox -- sh -c "while true; do wget -qO- http://landmark-app.landmark-devops; done"
```

## Key Points

- HPA requires Metrics Server to be installed
- Pods MUST have `resources.requests` defined for CPU/memory-based scaling
- Scale-up is fast, scale-down has a 5-minute stabilization window (prevents flapping)
- Use `minReplicas: 2` for high availability
