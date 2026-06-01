# Service

## What is a Service?

A Service provides a stable network endpoint to access a set of pods. Since pods are ephemeral (they get new IPs when recreated), a Service gives you a permanent IP and DNS name that routes traffic to healthy pods.

**Service types:**
- `ClusterIP` (default) — Internal access only, reachable within the cluster
- `NodePort` — Exposes the service on each node's IP at a static port (30000-32767)
- `LoadBalancer` — Provisions an external load balancer (cloud providers like AWS, GCP)

## Syntax

```yaml
apiVersion: v1
kind: Service
metadata:
  name: landmark-app
spec:
  type: ClusterIP        # or NodePort, LoadBalancer
  selector:
    app: landmark-app    # Must match pod labels
  ports:
    - port: 80           # Service port (what clients connect to)
      targetPort: 3000   # Container port (where the app listens)
```

**Key fields:**
- `selector` — Finds pods with matching labels to route traffic to
- `port` — The port the Service listens on
- `targetPort` — The port on the container the traffic is forwarded to
- `nodePort` — (NodePort only) The static port on each node (30000-32767)

## How to Run

```bash
# Apply the deployment and all three service types
kubectl apply -f deployment-service.yaml

# Verify
kubectl get services -n landmark-devops
kubectl get endpoints -n landmark-devops
```

## How to Access

```bash
# ClusterIP — access via port-forward
kubectl port-forward svc/landmark-app 3000:80 -n landmark-devops
# Open http://localhost:3000

# NodePort — access via any node IP
# http://<node-ip>:30080

# LoadBalancer — access via external IP
kubectl get svc landmark-app-lb -n landmark-devops
# Use the EXTERNAL-IP shown in the output
```

## Troubleshooting

```bash
# Check if service has endpoints (pods backing it)
kubectl get endpoints landmark-app -n landmark-devops
# If endpoints are empty: selector labels don't match any running pods

# Describe service
kubectl describe svc landmark-app -n landmark-devops

# Test from inside the cluster
kubectl run test --rm -it --image=busybox -- wget -qO- http://landmark-app.landmark-devops.svc.cluster.local

# Common issues:
#   - No endpoints: selector doesn't match pod labels
#   - Connection refused: targetPort doesn't match container port
#   - Pending external IP: cloud provider LB not provisioned yet
```

## Key Points

- Services use `selector` to find pods — labels MUST match
- ClusterIP for internal, NodePort for dev/testing, LoadBalancer for production
- DNS format inside cluster: `<service-name>.<namespace>.svc.cluster.local`
- A Service without a selector can point to external endpoints

---

# AWS ALB Ingress Controller (AWS Load Balancer Controller)

The AWS Load Balancer Controller manages AWS Elastic Load Balancers (ALB/NLB) for Kubernetes clusters running on EKS.

## Cluster Details

| Resource | Value |
|----------|-------|
| Cluster Name | `landmark-eks` |
| Region | `us-east-1` |
| VPC | `vpc-0524da417918165e3` |
| IP Family | IPv4 |
| Service CIDR | `172.20.0.0/16` |
| Subnets | `subnet-092445457fcf677b9`, `subnet-0ff8d67132fabecc7`, `subnet-0d90c2fa63b8c3b92`, `subnet-0acf59edb9d502cde` |
| Cluster Security Group | `sg-00bda2eb9ac469d1c` |

## Prerequisites

- EKS cluster `landmark-eks` running in `us-east-1`
- `kubectl` configured to talk to your cluster
- `helm` v3 installed
- `eksctl` installed

## Step 1: Associate IAM OIDC Provider

```bash
eksctl utils associate-iam-oidc-provider \
  --region us-east-1 \
  --cluster landmark-eks \
  --approve
```

## Step 2: Download the IAM Policy

```bash
curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.7.1/docs/install/iam_policy.json
```

## Step 3: Create the IAM Policy

```bash
aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://iam-policy.json
```

## Step 4: Create IAM Service Account

```bash
eksctl create iamserviceaccount \
  --cluster=landmark-eks \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --attach-policy-arn=arn:aws:iam::075120018043:policy/AWSLoadBalancerControllerIAMPolicy \
  --override-existing-serviceaccounts \
  --region us-east-1 \
  --approve
```

## Step 5: Tag Subnets for ALB Auto-Discovery

The ALB controller needs subnets tagged properly to discover them.

**For public subnets (internet-facing ALB):**
```bash
aws ec2 create-tags --resources \
  subnet-092445457fcf677b9 \
  subnet-0ff8d67132fabecc7 \
  --tags Key=kubernetes.io/role/elb,Value=1 \
  --region us-east-1
```

**For private subnets (internal ALB):**
```bash
aws ec2 create-tags --resources \
  subnet-0d90c2fa63b8c3b92 \
  subnet-0acf59edb9d502cde \
  --tags Key=kubernetes.io/role/internal-elb,Value=1 \
  --region us-east-1
```

> **Note:** Adjust which subnets are public vs private based on your VPC setup.

## Step 6: Install the Controller via Helm

```bash
# Add the EKS Helm repo
helm repo add eks https://aws.github.io/eks-charts
helm repo update

# Install the controller
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=landmark-eks \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set region=us-east-1 \
  --set vpcId=vpc-0524da417918165e3
```

## Step 7: Verify the Controller is Running

```bash
kubectl get deployment -n kube-system aws-load-balancer-controller
kubectl get pods -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller
```

Expected output — 2 pods in `Running` state.

## Step 8: Deploy an Ingress Using ALB

Once the controller is running, create an Ingress resource:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: landmark-app-ingress
  namespace: landmark-devops
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/subnets: subnet-092445457fcf677b9,subnet-0ff8d67132fabecc7
    alb.ingress.kubernetes.io/security-groups: sg-00bda2eb9ac469d1c
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

```bash
kubectl apply -f ingress-alb.yaml
kubectl get ingress -n landmark-devops
# Wait for the ADDRESS field to populate with the ALB DNS name
```

## ALB Troubleshooting

```bash
# Check controller logs
kubectl logs -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller

# Verify service account annotation
kubectl get sa aws-load-balancer-controller -n kube-system -o yaml

# Check Ingress events
kubectl describe ingress landmark-app-ingress -n landmark-devops

# Common issues:
#   - No ALB created: check controller logs for IAM permission errors
#   - Subnet discovery failed: ensure subnets are tagged (Step 5)
#   - Targets unhealthy: ensure sg-00bda2eb9ac469d1c allows traffic from ALB to node ports
#   - Controller not starting: verify OIDC provider is associated (Step 1)
```
