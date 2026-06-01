# Pod

## What is a Pod?

A Pod is the smallest deployable unit in Kubernetes. It represents a single instance of a running process and can contain one or more containers that share networking and storage.

**Key characteristics:**
- Containers in a pod share the same IP address and port space
- Containers in a pod can communicate via `localhost`
- Pods are ephemeral — they can be created and destroyed at any time
- In production, you rarely create pods directly — use Deployments instead

## Syntax

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: landmark-app-pod
  namespace: landmark-devops
  labels:
    app: landmark-app
spec:
  containers:
    - name: app
      image: landmark-devops:latest
      ports:
        - containerPort: 3000
      resources:
        requests:
          memory: "128Mi"
          cpu: "100m"
        limits:
          memory: "256Mi"
          cpu: "500m"
  restartPolicy: Always
```

**Key fields:**
- `metadata.labels` — Key-value pairs used by Services and Deployments to find this pod
- `spec.containers` — List of containers to run (usually one)
- `resources.requests` — Minimum resources guaranteed to the container
- `resources.limits` — Maximum resources the container can use
- `restartPolicy` — Always, OnFailure, or Never

## How to Run

```bash
# Create the namespace first
kubectl apply -f ../01-namespace/namespace.yaml

# Create the pod
kubectl apply -f pod.yaml

# Verify the pod is running
kubectl get pods -n landmark-devops
```

## How to Access

```bash
# Port-forward to access locally
kubectl port-forward pod/landmark-app-pod 3000:3000 -n landmark-devops
# Then open http://localhost:3000

# Get a shell inside the pod
kubectl exec -it landmark-app-pod -n landmark-devops -- sh

# View pod logs
kubectl logs landmark-app-pod -n landmark-devops
kubectl logs landmark-app-pod -n landmark-devops -f  # follow/stream logs
```

## Troubleshooting

```bash
# Describe pod (shows events, errors, restart reasons)
kubectl describe pod landmark-app-pod -n landmark-devops

# Check pod status
kubectl get pod landmark-app-pod -n landmark-devops -o wide

# Common statuses:
#   Pending     — Waiting to be scheduled (check resources, node capacity)
#   Running     — Pod is running
#   CrashLoopBackOff — Container keeps crashing (check logs)
#   ImagePullBackOff — Cannot pull the container image (check image name/registry)
#   ErrImagePull     — Image pull failed

# View previous container logs (after a crash)
kubectl logs landmark-app-pod -n landmark-devops --previous

# Delete and recreate
kubectl delete pod landmark-app-pod -n landmark-devops
kubectl apply -f pod.yaml
```

## Key Points

- Pods do NOT self-heal — if a pod dies, it stays dead (use Deployments for self-healing)
- Each pod gets its own IP address inside the cluster
- Use labels to organize and select pods
- Probes (liveness, readiness) tell Kubernetes if the app is healthy
