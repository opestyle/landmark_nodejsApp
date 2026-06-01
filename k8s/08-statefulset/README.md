# StatefulSet

## What is a StatefulSet?

A StatefulSet manages stateful applications that need stable, unique network identities and persistent storage. Unlike Deployments, each pod in a StatefulSet gets a predictable name (e.g., mysql-0, mysql-1) and its own dedicated storage.

**Use cases:** Databases (MySQL, PostgreSQL, MongoDB), message queues (Kafka, RabbitMQ), any app that needs stable identity or persistent data.

**Key differences from Deployment:**
- Pods get ordered, stable names: `<name>-0`, `<name>-1`, `<name>-2`
- Pods are created in order (0, 1, 2) and deleted in reverse order (2, 1, 0)
- Each pod gets its own PVC (via `volumeClaimTemplates`)
- Requires a Headless Service (`clusterIP: None`)

## Syntax

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql-headless    # Required: headless service name
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:8.0
          volumeMounts:
            - name: mysql-storage
              mountPath: /var/lib/mysql
  volumeClaimTemplates:          # Each pod gets its own PVC
    - metadata:
        name: mysql-storage
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
```

## How to Run

```bash
kubectl apply -f statefulset.yaml

# Verify
kubectl get statefulset -n landmark-devops
kubectl get pods -n landmark-devops
# Pod name will be: mysql-0
```

## How to Access

```bash
# Port-forward to the database
kubectl port-forward pod/mysql-0 3306:3306 -n landmark-devops

# Connect from another pod inside the cluster
# DNS: mysql-0.mysql-headless.landmark-devops.svc.cluster.local

# Get a shell
kubectl exec -it mysql-0 -n landmark-devops -- mysql -u root -p
```

## Troubleshooting

```bash
# Check StatefulSet status
kubectl describe statefulset mysql -n landmark-devops

# Check PVCs created by the StatefulSet
kubectl get pvc -n landmark-devops

# Pod stuck in Pending: likely no PV available
kubectl describe pod mysql-0 -n landmark-devops

# Delete and recreate (PVCs are NOT deleted automatically)
kubectl delete statefulset mysql -n landmark-devops
kubectl delete pvc mysql-storage-mysql-0 -n landmark-devops  # if you want to delete data too
```

## Key Points

- StatefulSet = stable identity + persistent storage per pod
- Requires a Headless Service (`clusterIP: None`)
- `volumeClaimTemplates` creates a unique PVC for each pod
- Deleting a StatefulSet does NOT delete its PVCs (data is preserved)
- Pods are created/deleted in order (important for databases with replication)
