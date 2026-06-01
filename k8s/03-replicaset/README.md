# ReplicaSet

## What is a ReplicaSet?

A ReplicaSet ensures that a specified number of identical pod replicas are running at all times. If a pod crashes or is deleted, the ReplicaSet automatically creates a new one to maintain the desired count.

**Note:** In practice, you rarely create ReplicaSets directly. Deployments manage ReplicaSets for you and add rolling update capabilities. This is shown here for educational purposes.

## Syntax

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: landmark-app-rs
spec:
  replicas: 3
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
```

**Key fields:**
- `replicas` — Desired number of pod copies
- `selector.matchLabels` — How the ReplicaSet finds which pods it owns
- `template` — The pod template used to create new pods (must match selector labels)

## How to Run

```bash
kubectl apply -f replicaset.yaml
kubectl get replicaset -n landmark-devops
kubectl get pods -n landmark-devops
```

## How to Access

```bash
# The ReplicaSet creates pods — access them individually
kubectl port-forward pod/<pod-name> 3000:3000 -n landmark-devops

# Or create a Service (see 05-service/) to load-balance across all replicas
```

## Troubleshooting

```bash
# Check ReplicaSet status
kubectl describe rs landmark-app-rs -n landmark-devops

# Scale up or down
kubectl scale rs landmark-app-rs --replicas=5 -n landmark-devops

# Delete a pod and watch it get recreated
kubectl delete pod <pod-name> -n landmark-devops
kubectl get pods -n landmark-devops -w  # watch mode
```

## Key Points

- ReplicaSet = self-healing pods (maintains desired count)
- The `selector` MUST match the pod template `labels`
- Use Deployments instead of ReplicaSets directly (Deployments manage ReplicaSets)
- Deleting a ReplicaSet deletes all its pods
