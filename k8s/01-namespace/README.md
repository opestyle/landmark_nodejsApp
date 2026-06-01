# Namespace

## What is a Namespace?

A Namespace is a virtual cluster inside a Kubernetes cluster. It provides isolation between teams, projects, or environments (dev, staging, prod). Resources in one namespace are hidden from other namespaces by default.

**Use cases:**
- Separate environments (dev, staging, production)
- Isolate teams or projects
- Apply resource quotas per namespace
- Scope RBAC permissions

## Syntax

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: landmark-devops
```

## How to Run

```bash
# Create the namespace
kubectl apply -f namespace.yaml

# Verify
kubectl get namespaces

# Set as default namespace for your context
kubectl config set-context --current --namespace=landmark-devops
```

## How to Access

```bash
# List all resources in the namespace
kubectl get all -n landmark-devops

# Describe the namespace
kubectl describe namespace landmark-devops
```

## Troubleshooting

```bash
# Namespace stuck in Terminating state
kubectl get namespace landmark-devops -o json | jq '.spec.finalizers = []' | kubectl replace --raw "/api/v1/namespaces/landmark-devops/finalize" -f -

# Check if namespace exists
kubectl get ns landmark-devops
```

## Key Points

- Every cluster has a `default` namespace
- System components run in `kube-system`
- Deleting a namespace deletes ALL resources inside it
- Always specify `-n <namespace>` or set a default context
