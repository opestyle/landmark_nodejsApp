# Kubernetes Manifests

Each subfolder contains a specific Kubernetes object with its own YAML manifest(s) and a README explaining what it is, how to use it, and how to troubleshoot it.

## Folder Structure

```
k8s/
├── 01-namespace/          # Namespace — virtual cluster isolation
├── 02-pod/                # Pod — smallest deployable unit
├── 03-replicaset/         # ReplicaSet — maintains desired pod count
├── 04-deployment/         # Deployment — rolling updates & rollbacks
├── 05-service/            # Service — stable networking for pods
├── 06-configmap-secret/   # ConfigMap & Secret — configuration & sensitive data
├── 07-volumes/            # PV, PVC, StorageClass — persistent storage
├── 08-statefulset/        # StatefulSet — stateful apps (databases)
├── 09-serviceaccount/     # ServiceAccount & RBAC — pod identity & permissions
├── 10-daemonset/          # DaemonSet — one pod per node
├── 11-hpa/                # HorizontalPodAutoscaler — auto-scaling
└── 12-ingress/            # Ingress — HTTP/HTTPS routing
```

## Teaching Order

Start with the namespace, then teach each object in order:

```bash
# 1. Create the namespace
kubectl apply -f 01-namespace/

# 2. Run a single pod
kubectl apply -f 02-pod/

# 3. Scale with a ReplicaSet
kubectl apply -f 03-replicaset/

# 4. Deploy with rolling updates
kubectl apply -f 04-deployment/

# 5. Expose with a Service
kubectl apply -f 05-service/

# 6. Configure with ConfigMaps and Secrets
kubectl apply -f 06-configmap-secret/

# 7. Persist data with Volumes
kubectl apply -f 07-volumes/

# 8. Run stateful apps
kubectl apply -f 08-statefulset/

# 9. Control permissions with ServiceAccounts
kubectl apply -f 09-serviceaccount/

# 10. Run on every node with DaemonSet
kubectl apply -f 10-daemonset/

# 11. Auto-scale with HPA
kubectl apply -f 11-hpa/

# 12. Route external traffic with Ingress
kubectl apply -f 12-ingress/
```

## Clean Up

```bash
kubectl delete namespace landmark-devops
```
