# Terraform - EKS Cluster Deployment

This Terraform configuration creates a basic AWS EKS cluster with 2 nodes and a load balancer.

## Prerequisites

```bash
# Install Terraform
terraform version  # >= 1.0

# Configure AWS credentials
aws configure
```

## Deployment

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply configuration
terraform apply

# Get cluster endpoint and configure kubectl
terraform output configure_kubectl
aws eks update-kubeconfig --name landmark-cluster --region us-east-1

# Verify connection
kubectl cluster-info
kubectl get nodes
```

## Deploy Application

```bash
# Apply Kubernetes manifests
kubectl apply -f ../k8s/

# Get load balancer endpoint
kubectl get svc -n landmark-devops

# Access application
kubectl port-forward svc/landmark-app-lb 3000:80 -n landmark-devops
```

## Cleanup

```bash
# Destroy all resources
terraform destroy
```

## Key Resources

- **EKS Cluster**: Kubernetes cluster with 1.28 version
- **Node Group**: 2 t3.medium instances (min: 1, max: 3)
- **VPC**: 10.0.0.0/16 with public subnet
- **Load Balancer**: For external access to applications

## Outputs

Run `terraform output` to see:
- `cluster_endpoint` - EKS API endpoint
- `cluster_name` - Cluster name
- `configure_kubectl` - Command to configure kubectl
