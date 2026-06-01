# DaemonSet

## What is a DaemonSet?

A DaemonSet ensures that a copy of a pod runs on every node in the cluster (or a subset of nodes). When a new node is added, the DaemonSet automatically schedules a pod on it.

**Use cases:** Log collectors (Fluentd), monitoring agents (Prometheus Node Exporter), network plugins, security agents — anything that needs to run on every node.

## Syntax

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: landmark-monitor
spec:
  selector:
    matchLabels:
      app: landmark-monitor
  template:
    metadata:
      labels:
        app: landmark-monitor
    spec:
      tolerations:
        - key: node-role.kubernetes.io/control-plane
          effect: NoSchedule
      containers:
        - name: monitor
          image: busybox:latest
```

**Key fields:**
- No `replicas` field — DaemonSet runs one pod per node automatically
- `tolerations` — Allow scheduling on control-plane/master nodes (normally excluded)
- `nodeSelector` — Restrict to specific nodes by label

## How to Run

```bash
kubectl apply -f daemonset.yaml

# Verify — one pod per node
kubectl get daemonset -n landmark-devops
kubectl get pods -n landmark-devops -o wide
```

## How to Access

```bash
# View logs from a specific node's pod
kubectl logs <pod-name> -n landmark-devops

# View logs from all DaemonSet pods
kubectl logs -l app=landmark-monitor -n landmark-devops
```

## Troubleshooting

```bash
# Check DaemonSet status
kubectl describe daemonset landmark-monitor -n landmark-devops
# Look at: Desired / Current / Ready counts

# Pod not scheduled on a node
# Check: does the node have a taint that the DaemonSet doesn't tolerate?
kubectl describe node <node-name> | grep Taints

# Rolling update a DaemonSet
kubectl set image daemonset/landmark-monitor monitor=busybox:1.36 -n landmark-devops
```

## Key Points

- DaemonSet = one pod per node (automatic)
- No `replicas` field — the number of pods equals the number of nodes
- Use `tolerations` to run on control-plane nodes
- Use `nodeSelector` to target specific nodes
- DaemonSets support rolling updates
