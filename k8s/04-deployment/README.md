# Deployment

## What is a Deployment?

A Deployment is the standard way to run stateless applications in Kubernetes. It manages a ReplicaSet and provides declarative updates — you describe the desired state and Kubernetes makes it happen.

**What it adds over a ReplicaSet:**
- Rolling updates (zero-downtime deployments)
- Rollback to previous versions
- Pause and resume deployments
- Deployment history

## Syntax

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: landmark-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max extra pods during update
      maxUnavailable: 0   # Zero downtime
  selector:
    matchLabels:
      app: landmark-app
  template:
    metadata:
      labels:
        app: landmark-app
    spec:
      containers:
        - name: app
          image: landmark-devops:latest
          ports:
            - containerPort: 3000
```

**Key fields:**
- `strategy.type` — RollingUpdate (default) or Recreate (kill all, then create all)
- `maxSurge` — How many extra pods can exist during an update
- `maxUnavailable` — How many pods can be unavailable during an update
- `envFrom` — Load environment variables from ConfigMaps and Secrets

## How to Run

```bash
# Create the deployment
kubectl apply -f deployment.yaml

# Verify
kubectl get deployments -n landmark-devops
kubectl get pods -n landmark-devops
```

## How to Access

```bash
# Port-forward to one of the pods
kubectl port-forward deployment/landmark-app 3000:3000 -n landmark-devops
# Then open http://localhost:3000

# Or create a Service (see 05-service/) for proper load balancing
```

## Rolling Updates & Rollbacks

```bash
# Update the image (triggers rolling update)
kubectl set image deployment/landmark-app app=landmark-devops:v2 -n landmark-devops

# Watch the rollout
kubectl rollout status deployment/landmark-app -n landmark-devops

# View rollout history
kubectl rollout history deployment/landmark-app -n landmark-devops

# Rollback to previous version
kubectl rollout undo deployment/landmark-app -n landmark-devops

# Rollback to a specific revision
kubectl rollout undo deployment/landmark-app --to-revision=2 -n landmark-devops
```

## Troubleshooting

```bash
# Describe deployment (shows events, conditions)
kubectl describe deployment landmark-app -n landmark-devops

# Check ReplicaSets managed by this deployment
kubectl get rs -n landmark-devops

# Scale manually
kubectl scale deployment landmark-app --replicas=5 -n landmark-devops

# Common issues:
#   - Pods stuck in Pending: not enough cluster resources
#   - ImagePullBackOff: wrong image name or no registry access
#   - CrashLoopBackOff: app is crashing (check logs)
```

## Key Points

- Deployment > ReplicaSet > Pods (hierarchy)
- Always use Deployments for stateless apps (not bare pods or ReplicaSets)
- Rolling updates give you zero-downtime deployments
- Rollbacks are instant — Kubernetes keeps previous ReplicaSets
