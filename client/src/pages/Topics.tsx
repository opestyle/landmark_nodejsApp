import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, Code2, Cloud, Cpu, GitBranch, Boxes, Gauge, ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Module {
  title: string;
  notes: string;
  examples: { code: string; description?: string }[];
}

interface Topic {
  id: string;
  title: string;
  icon: any;
  description: string;
  modules: Module[];
}

const topics: Topic[] = [
  {
    id: "linux",
    title: "Linux & Scripting",
    icon: Code2,
    description: "Master Linux fundamentals and shell scripting for DevOps automation",
    modules: [
      {
        title: "Linux Basics & File System",
        notes: `Linux is the backbone of modern DevOps. Almost all servers, containers, and cloud instances run Linux. Understanding the file system hierarchy is critical:

• / — Root directory, the top of the file system tree
• /home — User home directories
• /etc — System configuration files (e.g., /etc/hosts, /etc/nginx/)
• /var — Variable data like logs (/var/log) and mail
• /tmp — Temporary files, cleared on reboot
• /usr — User programs and utilities
• /opt — Optional/third-party software

Key concepts: Everything in Linux is a file. Permissions follow the rwx (read/write/execute) model for owner, group, and others. The permission number 755 means owner can read/write/execute, group and others can read/execute.`,
        examples: [
          { code: "ls -la /home", description: "List all files including hidden ones with details" },
          { code: "chmod 755 script.sh", description: "Set executable permissions on a script" },
          { code: "chown user:group file.txt", description: "Change file ownership" },
          { code: "find . -name '*.log' -type f -mtime +7", description: "Find log files older than 7 days" },
          { code: "df -h", description: "Show disk space usage in human-readable format" },
          { code: "top -bn1 | head -20", description: "Show top processes (non-interactive)" },
        ],
      },
      {
        title: "Shell Scripting Fundamentals",
        notes: `Shell scripts automate repetitive tasks. Every DevOps engineer must be comfortable writing bash scripts.

Key concepts:
• Shebang (#!/bin/bash) — Tells the system which interpreter to use
• Variables — No spaces around = sign: NAME="value"
• Conditionals — if [ condition ]; then ... fi
• Loops — for, while, until
• Functions — Reusable blocks of code
• Exit codes — 0 means success, non-zero means failure
• Piping (|) — Send output of one command as input to another
• Redirection — > (overwrite), >> (append), 2>&1 (redirect stderr to stdout)`,
        examples: [
          { code: `#!/bin/bash
# Deploy script with error handling
set -e  # Exit on any error

APP_NAME="myapp"
DEPLOY_DIR="/opt/$APP_NAME"

echo "Deploying $APP_NAME..."

if [ ! -d "$DEPLOY_DIR" ]; then
  mkdir -p "$DEPLOY_DIR"
  echo "Created deploy directory"
fi

cp -r ./dist/* "$DEPLOY_DIR/"
echo "Files copied successfully"

systemctl restart $APP_NAME
echo "Service restarted"`, description: "Complete deployment script with error handling" },
          { code: `#!/bin/bash
# Loop through servers and check status
SERVERS=("web01" "web02" "db01")

for server in "\${SERVERS[@]}"; do
  if ping -c 1 "$server" &>/dev/null; then
    echo "✓ $server is UP"
  else
    echo "✗ $server is DOWN"
  fi
done`, description: "Health check script for multiple servers" },
          { code: `#!/bin/bash
# Log rotation function
rotate_logs() {
  local log_dir=$1
  local max_age=$2
  find "$log_dir" -name "*.log" -mtime +$max_age -delete
  echo "Cleaned logs older than $max_age days"
}

rotate_logs /var/log/myapp 30`, description: "Function for log rotation" },
        ],
      },
      {
        title: "Package Management & System Administration",
        notes: `Package managers install, update, and remove software. Different Linux distributions use different package managers:

• Debian/Ubuntu: apt (apt-get, apt-cache)
• RHEL/CentOS: yum or dnf
• macOS: brew (Homebrew)

System administration tasks include managing services (systemctl), monitoring resources, configuring networking, and managing users. The systemctl command controls systemd services — start, stop, restart, enable (auto-start on boot), and check status.`,
        examples: [
          { code: `# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y nginx docker.io
sudo apt-get upgrade -y`, description: "Update and install packages on Ubuntu" },
          { code: `# RHEL/CentOS
sudo yum install -y docker-ce
sudo systemctl start docker
sudo systemctl enable docker`, description: "Install and enable Docker on CentOS" },
          { code: `# Service management
sudo systemctl status nginx
sudo systemctl restart nginx
sudo journalctl -u nginx -f`, description: "Manage and monitor services with systemctl" },
        ],
      },
    ],
  },
  {
    id: "git",
    title: "Git & GitHub",
    icon: GitBranch,
    description: "Version control and collaborative development workflows",
    modules: [
      {
        title: "Understanding Version Control & Git",
        notes: `In modern software development and IT operations, managing changes to code and project files is paramount. A Version Control System (VCS) tracks and manages changes to files over time, allowing multiple people to collaborate, track every modification, revert to previous versions, and manage different lines of development simultaneously.

Git is the most widely adopted distributed version control system (DVCS) globally. Created by Linus Torvalds in 2005, Git is renowned for its speed, data integrity, and support for distributed, non-linear workflows. Unlike older centralized VCSs, every developer's working copy of the code is a full-fledged repository with complete history and full version-tracking capabilities, independent of network access or a central server.

GitHub is a web-based platform that provides hosting for Git repositories. It extends Git's capabilities by offering features for collaboration, project management, code review, and social coding. While Git is the underlying technology for version control, GitHub provides the infrastructure and tools to host and manage your Git-based projects in the cloud.`,
        examples: [
          { code: `# Install Git (Amazon Linux / CentOS)
sudo yum install git -y

# Verify installation
git version`, description: "Install and verify Git" },
          { code: `# Configure your identity
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"

# Verify configuration
git config --global --list`, description: "Set up your Git identity (required before first commit)" },
        ],
      },
      {
        title: "Core Git Workflow: init, status, add, commit",
        notes: `The essential Git commands you will use daily to manage your projects:

• git init — Transforms the current directory into a Git repository. Creates a hidden .git folder that stores all metadata and the object database for version control.

• git status — Your go-to command to understand the current state of your working directory and staging area. It tells you which files are untracked, modified, or staged.

• git add — Moves changes from your working directory to the staging area (also known as the index). Think of it like calling specific guests to the stage for a group photo — you're selecting which changes to include in your next snapshot.
  - git add <file> — Stage a specific file
  - git add . — Stage all changes in the current directory

• git rm --cached <file> — Unstage a file (remove from staging area without deleting it).

• git commit -m "message" — Takes everything from the staging area and permanently stores it as a new snapshot in your repository's history. Each commit must have a descriptive message explaining the changes made. Every commit is like a point in time you can always go back to.

• git show — Displays the details of the most recent commit, including the diff of changes made.`,
        examples: [
          { code: `# Create a project and initialize Git
mkdir landmark_website
cd landmark_website
git init
ls -a  # You'll see the .git folder`, description: "Initialize a new Git repository" },
          { code: `# Create files and check status
echo "<h1>Welcome</h1>" > index.html
echo "body { font-family: sans-serif; }" > style.css
git status
# Shows: Untracked files: index.html, style.css`, description: "Check which files Git is tracking" },
          { code: `# Stage specific file vs all files
git add index.html       # Stage only index.html
git status               # index.html is staged, style.css is untracked

git add .                # Stage everything
git status               # Both files are now staged`, description: "Stage files for commit" },
          { code: `# Commit your changes
git commit -m "Initial website setup: added basic HTML and CSS"
git status               # "nothing to commit, working tree clean"`, description: "Save a snapshot of your staged changes" },
        ],
      },
      {
        title: "Remote Repositories: push, pull, remote",
        notes: `Remote repositories are versions of your project hosted on the internet (like GitHub). They enable team collaboration and serve as backups.

• git remote add <name> <url> — Adds a new remote repository connection. The convention is to name the primary remote "origin".

• git remote -v — Verify your remote connections (shows fetch and push URLs).

• git push -u <remote> <branch> — Uploads your committed changes from your local repository to the remote. The -u flag sets the upstream branch, linking your local branch to the remote one (usually done on the first push).

• git pull <remote> <branch> — Fetches (downloads) changes from a remote repository and integrates them into your current local branch. This keeps your local repository synchronized with the remote.

Authentication: Git no longer supports password authentication for GitHub. You must use either:
1. Personal Access Token (PAT) — Go to GitHub Settings → Developer Settings → Personal Access Tokens → Generate Token
2. SSH Key — More secure and convenient for frequent use`,
        examples: [
          { code: `# Add remote and push
git remote add origin https://github.com/YourUser/your-repo.git
git remote -v
git branch -M main
git push -u origin main`, description: "Connect local repo to GitHub and push" },
          { code: `# Pull latest changes from remote
git pull origin main`, description: "Download and integrate remote changes" },
          { code: `# Set up SSH authentication
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Copy the key and add it to GitHub: Settings → SSH keys → Add new key

# Switch repo to SSH
git remote set-url origin git@github.com:YourUser/your-repo.git

# Test connection
ssh -T git@github.com`, description: "Set up SSH key authentication for GitHub" },
        ],
      },
      {
        title: "Branching: Working on Features Independently",
        notes: `Branching is one of Git's most powerful features. It allows you to diverge from the main line of development and continue to work independently without affecting the main project. Think of it like creating a separate copy of your project where you can experiment, add new features, or fix bugs, and then merge those changes back when ready.

Branch naming conventions in real projects:
• main / master → Production
• release → Staging
• fix/ → Bug fixes (e.g., fix/login-error)
• feature/ → New features (e.g., feature/login/faceid)

The importance of branching:
1. Avoids everyone editing the same file simultaneously
2. Safe experimentation without affecting the main codebase
3. Parallel work across team members
4. Easy roll-back if something goes wrong
5. Keeps the original copy uncorrupted

Key commands:
• git branch — List all branches (* marks the current branch)
• git branch <name> — Create a new branch
• git checkout <name> — Switch to an existing branch
• git checkout -b <name> — Create AND switch to a new branch in one command`,
        examples: [
          { code: `# List branches and create a new one
git branch                        # Shows: * master
git branch feature/contact-form   # Create new branch
git branch                        # Shows: feature/contact-form, * master`, description: "Create a feature branch" },
          { code: `# Switch to the feature branch and work on it
git checkout feature/contact-form
git branch                        # Shows: * feature/contact-form, master

echo "<form>Contact Form Here</form>" > contact.html
git add contact.html
git commit -m "FEAT: Add basic contact form page"`, description: "Switch branches and make changes" },
          { code: `# Create and switch in one command
git checkout -b feature/new-design
git branch
# Shows: master, feature/contact-form, * feature/new-design`, description: "Shortcut: create + switch branch" },
          { code: `# Push a feature branch to GitHub
git push origin feature/contact-form`, description: "Push your branch to the remote" },
        ],
      },
      {
        title: "Merging, Rebasing & Conflict Resolution",
        notes: `git merge combines changes from one branch into another. To merge, you must switch to the destination branch first, then merge the source branch into it.

Two types of merges:
• Fast-forward merge — Occurs when there is a linear path from the current branch to the target. Git simply moves the pointer forward.
• Three-way merge — Occurs when branches have diverged. Git creates a new "merge commit" with two parent commits.

git rebase rewrites history by reapplying your feature branch commits one by one onto the tip of the target branch. This results in a cleaner, linear history.
⚠️ Caution: Never rebase commits that have already been pushed to a shared remote repository.

Merge Conflicts occur when both branches modify the same part of the same file differently. Git pauses and asks you to resolve manually. Conflict markers:
• <<<<<<< HEAD — Your current branch changes
• ======= — Separator
• >>>>>>> feature/branch — Incoming branch changes

Resolution steps:
1. Open the conflicting file
2. Edit to keep the correct changes (remove conflict markers)
3. git add <file> to mark as resolved
4. git commit to complete the merge`,
        examples: [
          { code: `# Merge a feature branch into main
git checkout main                    # Switch to destination branch
git merge feature/contact-form       # Merge source branch
# Output: Fast-forward, contact.html created`, description: "Perform a merge" },
          { code: `# Rebase a feature branch onto main
git checkout feature/new-design
git rebase main
# Reapplies your commits on top of main's latest`, description: "Rebase for a clean linear history" },
          { code: `# When a merge conflict occurs:
git merge feature/alice
# CONFLICT (content): Merge conflict in index.html

# The file will contain:
# <<<<<<< HEAD
# <p>Bob's important update.</p>
# =======
# <p>Alice's new paragraph.</p>
# >>>>>>> feature/alice

# Edit the file to resolve, then:
git add index.html
git commit -m "Merge feature/alice - resolved conflict in index.html"`, description: "Resolve a merge conflict step by step" },
        ],
      },
      {
        title: "GitHub: Collaboration, Security & Pull Requests",
        notes: `GitHub is more than just a place to store repositories — it's a powerful platform for collaborative software development.

Multi-Factor Authentication (MFA):
Adds an extra layer of security. Even if someone steals your password, they can't access your account without the second factor. Enable it via: GitHub Settings → Password and authentication → Enable two-factor authentication. Save your recovery codes securely!

Branch Protection Rules:
Prevent accidental or unauthorized changes to important branches (main/master). Configure via: Repository Settings → Branches → Add rule.
Common rules:
• Require pull request reviews before merging
• Require status checks (automated tests) to pass
• Require linear history (rebase-only workflow)
• Restrict who can push directly

Pull Requests (PRs):
The primary mechanism for code review and merging changes. When you create a PR, you're asking teammates to review your code before it's integrated.

PR Workflow:
1. Push your feature branch to GitHub
2. Click "Compare & pull request" on GitHub
3. Select base branch (main) and compare branch (your feature)
4. Add a clear title and description
5. Assign reviewers
6. Reviewers approve or request changes
7. Merge when approved (options: merge commit, squash and merge, rebase and merge)`,
        examples: [
          { code: `# Push feature branch then create PR on GitHub
git push origin feature/new-feature
# Go to GitHub → "Compare & pull request" → Fill details → Create`, description: "Create a Pull Request" },
          { code: `# Enable commit signing with SSH
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true

# Make a signed commit
git commit -S -m "verified signed commit"`, description: "Set up verified/signed commits" },
        ],
      },
      {
        title: "Logging Commands: Understanding Project History",
        notes: `Git keeps a detailed history of every change. Logging commands help you explore this history.

git log — Your primary tool for viewing commit history. Shows commits in reverse chronological order (newest first) with hash, author, date, and message.

Useful git log options:
• git log --oneline — Each commit on a single line (compact view)
• git log --graph --oneline --all — Visualizes branch and merge history with ASCII art
• git log -p — Shows the full diff introduced by each commit
• git log --author="Name" — Filter commits by author
• git log --grep="FEAT" — Filter commits by message pattern

git reflog — Records every single change to your HEAD (commits, checkouts, merges, rebases, resets). It's your safety net — you can recover lost commits or branches even if they were seemingly deleted. Each entry has a HEAD@{index} reference you can use with git reset to go back to that state.

git show — Displays the details of a specific commit including the diff of changes made.`,
        examples: [
          { code: `# Compact log view
git log --oneline
# 2b3c4d5 Merge branch 'feature/alice' into master
# 8d9e0f1 Bob: Added his update
# 1a2b3c4 Alice: Added her paragraph
# 7a1b2c3 Initial homepage heading`, description: "View concise commit history" },
          { code: `# Visual branch graph
git log --graph --oneline --all
# *   2b3c4d5 Merge branch 'feature/alice'
# |\  
# | * 1a2b3c4 Alice: Added her paragraph
# * | 8d9e0f1 Bob: Added his update
# |/
# * 7a1b2c3 Initial homepage heading`, description: "See branch and merge history visually" },
          { code: `# View the reflog (your safety net)
git reflog
# 2b3c4d5 HEAD@{0}: commit (merge): Merge branch 'feature/alice'
# 8d9e0f1 HEAD@{1}: commit: Bob: Added his update
# 7a1b2c3 HEAD@{2}: checkout: moving from feature/alice to master
# 1a2b3c4 HEAD@{3}: commit: Alice: Added her paragraph`, description: "Track all HEAD movements (recover lost work)" },
          { code: `# Other useful commands
git stash              # Temporarily save uncommitted changes
git stash list         # List all stashes
git stash pop          # Restore the most recent stash
git show               # Show details of the latest commit`, description: "Stashing and inspecting commits" },
        ],
      },
    ],
  },
  {
    id: "docker",
    title: "Docker",
    icon: Boxes,
    description: "Containerization, image management, and multi-container orchestration",
    modules: [
      {
        title: "Docker Fundamentals",
        notes: `Docker packages applications into containers — lightweight, portable, self-sufficient units that include everything needed to run: code, runtime, libraries, and settings.

Key concepts:
• Image — A read-only template (like a class in OOP)
• Container — A running instance of an image (like an object)
• Dockerfile — Instructions to build an image
• Registry — Storage for images (Docker Hub, ECR, GCR)
• Volume — Persistent storage that survives container restarts
• Network — Communication between containers

Containers vs VMs: Containers share the host OS kernel, making them much lighter (MBs vs GBs) and faster to start (seconds vs minutes).`,
        examples: [
          { code: `# Build and run
docker build -t myapp:latest .
docker run -d -p 3000:3000 --name myapp myapp:latest
docker ps
docker logs myapp -f`, description: "Build image and run container" },
          { code: `# Dockerfile example
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]`, description: "Multi-stage Dockerfile for Node.js" },
          { code: `# Container management
docker exec -it myapp sh        # Shell into container
docker stop myapp                # Stop container
docker rm myapp                  # Remove container
docker rmi myapp:latest          # Remove image
docker system prune -a           # Clean up everything`, description: "Common container operations" },
        ],
      },
      {
        title: "Docker Compose",
        notes: `Docker Compose defines and runs multi-container applications. A single YAML file describes all services, networks, and volumes.

Key features:
• Service definitions with build context or image references
• Network isolation between services
• Volume mounting for persistent data
• Environment variable configuration
• Dependency ordering with depends_on
• Health checks for service readiness

Services communicate using their service name as hostname (e.g., the app connects to the database using "db" as the host).`,
        examples: [
          { code: `# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://user:pass@db:3306/mydb
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpass
      - MYSQL_DATABASE=mydb
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping"]
      interval: 10s
      retries: 5

volumes:
  db_data:`, description: "Complete docker-compose.yml with health checks" },
          { code: `# Docker Compose commands
docker-compose up -d          # Start in background
docker-compose ps             # List services
docker-compose logs -f app    # Follow app logs
docker-compose down -v        # Stop and remove volumes`, description: "Essential Compose commands" },
        ],
      },
    ],
  },
  {
    id: "kubernetes",
    title: "Kubernetes",
    icon: Cpu,
    description: "Container orchestration, deployments, services, and state management",
    modules: [
      {
        title: "Kubernetes Architecture & Basics",
        notes: `Kubernetes (K8s) automates deployment, scaling, and management of containerized applications.

Architecture:
• Control Plane: API Server, etcd, Scheduler, Controller Manager
• Worker Nodes: kubelet, kube-proxy, Container Runtime

Core objects:
• Pod — Smallest deployable unit, one or more containers
• Deployment — Manages ReplicaSets, handles rolling updates
• Service — Stable network endpoint for pods (ClusterIP, NodePort, LoadBalancer)
• ConfigMap/Secret — Configuration and sensitive data
• PersistentVolumeClaim — Storage requests
• Namespace — Virtual cluster isolation

kubectl is the CLI tool for interacting with the cluster.`,
        examples: [
          { code: `# Deployment manifest (deployment.yaml)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: app
          image: myapp:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              memory: "128Mi"
              cpu: "250m"
            limits:
              memory: "256Mi"
              cpu: "500m"`, description: "Deployment manifest with resource limits" },
          { code: `# Essential kubectl commands
kubectl apply -f deployment.yaml
kubectl get pods -n default
kubectl describe pod <pod-name>
kubectl logs <pod-name> -f
kubectl exec -it <pod-name> -- sh
kubectl port-forward svc/myapp 3000:80`, description: "Common kubectl operations" },
        ],
      },
      {
        title: "Services, Scaling & Rolling Updates",
        notes: `Services provide stable networking for pods. Since pods are ephemeral (they can be created/destroyed), Services give a permanent IP and DNS name.

Service types:
• ClusterIP (default) — Internal cluster access only
• NodePort — Exposes on each node's IP at a static port
• LoadBalancer — Provisions external load balancer (cloud)

Scaling: Horizontal Pod Autoscaler (HPA) automatically adjusts replicas based on CPU/memory usage. Rolling updates replace pods gradually with zero downtime.`,
        examples: [
          { code: `# Service manifest
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: LoadBalancer
  selector:
    app: myapp
  ports:
    - port: 80
      targetPort: 3000`, description: "LoadBalancer Service definition" },
          { code: `# Scaling and updates
kubectl scale deployment myapp --replicas=5
kubectl autoscale deployment myapp --min=2 --max=10 --cpu-percent=70
kubectl set image deployment/myapp app=myapp:v2
kubectl rollout status deployment/myapp
kubectl rollout undo deployment/myapp`, description: "Scale, autoscale, and rollback" },
        ],
      },
    ],
  },
  {
    id: "aws",
    title: "AWS & Terraform",
    icon: Cloud,
    description: "Cloud infrastructure provisioning and Infrastructure as Code",
    modules: [
      {
        title: "AWS Core Services",
        notes: `Amazon Web Services (AWS) is the leading cloud platform. Key services for DevOps:

Compute:
• EC2 — Virtual servers (instances)
• ECS/EKS — Container orchestration (Docker/Kubernetes)
• Lambda — Serverless functions

Storage:
• S3 — Object storage (files, backups, static websites)
• EBS — Block storage for EC2 instances
• EFS — Shared file system

Database:
• RDS — Managed relational databases (MySQL, PostgreSQL)
• DynamoDB — NoSQL key-value store

Networking:
• VPC — Virtual Private Cloud (isolated network)
• Route 53 — DNS management
• ALB/NLB — Load balancers

IAM (Identity and Access Management) controls who can access what. Always follow the principle of least privilege.`,
        examples: [
          { code: `# AWS CLI examples
aws ec2 describe-instances --filters "Name=tag:Env,Values=prod"
aws s3 ls s3://my-bucket/
aws s3 cp ./backup.tar.gz s3://my-bucket/backups/
aws rds describe-db-instances
aws ecs list-clusters`, description: "Common AWS CLI commands" },
          { code: `# Create an S3 bucket with versioning
aws s3api create-bucket \\
  --bucket my-terraform-state \\
  --region us-east-1
aws s3api put-bucket-versioning \\
  --bucket my-terraform-state \\
  --versioning-configuration Status=Enabled`, description: "Create S3 bucket for Terraform state" },
        ],
      },
      {
        title: "Terraform Infrastructure as Code",
        notes: `Terraform by HashiCorp lets you define infrastructure in declarative configuration files (.tf). It supports AWS, Azure, GCP, and many other providers.

Workflow:
1. terraform init — Initialize providers and modules
2. terraform plan — Preview changes (dry run)
3. terraform apply — Create/update infrastructure
4. terraform destroy — Tear down infrastructure

Key concepts:
• Providers — Plugins for cloud platforms (aws, azurerm, google)
• Resources — Infrastructure objects (aws_instance, aws_s3_bucket)
• Variables — Parameterize configurations
• Outputs — Export values (IP addresses, URLs)
• State — Terraform tracks what it manages in a state file
• Modules — Reusable infrastructure components

Always store state remotely (S3 + DynamoDB) for team collaboration.`,
        examples: [
          { code: `# main.tf — VPC and EC2 instance
provider "aws" {
  region = var.aws_region
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "main-vpc" }
}

resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "\${var.aws_region}a"
  map_public_ip_on_launch = true
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.public.id
  tags = { Name = "web-server" }
}`, description: "Terraform config for VPC and EC2" },
          { code: `# Remote state configuration
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}`, description: "Remote state with S3 backend" },
          { code: `# Terraform commands
terraform init
terraform plan -out=tfplan
terraform apply tfplan
terraform destroy -auto-approve`, description: "Standard Terraform workflow" },
        ],
      },
    ],
  },
  {
    id: "cicd",
    title: "CI/CD Pipelines",
    icon: Gauge,
    description: "Continuous Integration and Continuous Deployment automation",
    modules: [
      {
        title: "GitHub Actions",
        notes: `GitHub Actions automates workflows directly in your GitHub repository. Workflows are defined in YAML files under .github/workflows/.

Key concepts:
• Workflow — Automated process triggered by events
• Event — What triggers the workflow (push, pull_request, schedule)
• Job — A set of steps that run on the same runner
• Step — Individual task (run a command or use an action)
• Action — Reusable unit of code (e.g., actions/checkout)
• Runner — The machine that executes the job (ubuntu-latest, windows-latest)
• Secrets — Encrypted environment variables for sensitive data

Jobs run in parallel by default. Use "needs" to create dependencies between jobs.`,
        examples: [
          { code: `# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t myapp:\${{ github.sha }} .
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin \$ECR_REGISTRY
          docker push \$ECR_REGISTRY/myapp:\${{ github.sha }}`, description: "Complete CI/CD pipeline with test and deploy" },
        ],
      },
      {
        title: "Jenkins Pipelines",
        notes: `Jenkins is an open-source automation server. Declarative Pipelines define the entire build/test/deploy process in a Jenkinsfile.

Pipeline structure:
• pipeline {} — Top-level block
• agent — Where to run (any, docker, specific node)
• stages — Collection of stage blocks
• stage — Named phase (Build, Test, Deploy)
• steps — Commands to execute
• post — Actions after pipeline (always, success, failure)
• environment — Define environment variables

Jenkins supports plugins for Docker, Kubernetes, Slack notifications, and more. Store the Jenkinsfile in your repository root for Pipeline as Code.`,
        examples: [
          { code: `// Jenkinsfile
pipeline {
  agent any

  environment {
    DOCKER_IMAGE = "myapp"
    REGISTRY = "your-registry.com"
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    stage('Build') {
      steps {
        sh "docker build -t \${REGISTRY}/\${DOCKER_IMAGE}:\${BUILD_NUMBER} ."
      }
    }
    stage('Deploy') {
      when { branch 'main' }
      steps {
        sh "docker push \${REGISTRY}/\${DOCKER_IMAGE}:\${BUILD_NUMBER}"
        sh "kubectl set image deployment/myapp app=\${REGISTRY}/\${DOCKER_IMAGE}:\${BUILD_NUMBER}"
      }
    }
  }

  post {
    success { echo 'Pipeline succeeded!' }
    failure { echo 'Pipeline failed!' }
  }
}`, description: "Full Jenkins declarative pipeline" },
        ],
      },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors" title="Copy code">
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-blue-300" />}
    </button>
  );
}

export default function Topics() {
  const [, navigate] = useLocation();
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-5 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-blue-600 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header with Back Button */}
      <div className="relative z-10 border-b border-blue-400/30 bg-gradient-to-r from-blue-900/30 to-blue-800/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
          <Button onClick={() => navigate("/")} variant="ghost" className="text-white hover:text-blue-300 gap-2 hover:bg-blue-900/30">
            <ArrowLeft className="w-5 h-5" /> Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-wider">DEVOPS TOPICS</h1>
            <p className="text-white/70 mt-1">Comprehensive lecture notes and hands-on examples</p>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="relative z-5 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isExpanded = expandedTopic === topic.id;
            return (
              <div key={topic.id} className="border border-blue-400/30 rounded-lg bg-gradient-to-br from-blue-900/40 to-blue-800/20 overflow-hidden">
                <button
                  onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-900/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="w-8 h-8 text-blue-400" />
                    <div className="text-left">
                      <h2 className="text-2xl font-bold text-white tracking-wider">{topic.title}</h2>
                      <p className="text-white/70 text-sm">{topic.description}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-blue-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {isExpanded && (
                  <div className="border-t border-blue-400/30 px-6 py-4 space-y-4">
                    {topic.modules.map((module, idx) => {
                      const moduleKey = `${topic.id}-${idx}`;
                      const isModuleExpanded = expandedModule === moduleKey;
                      return (
                        <div key={moduleKey} className="bg-blue-900/30 rounded-lg border border-blue-400/20">
                          <button
                            onClick={() => setExpandedModule(isModuleExpanded ? null : moduleKey)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-900/40 transition-colors"
                          >
                            <h3 className="text-lg font-bold text-blue-300 tracking-wide">{module.title}</h3>
                            <ChevronDown className={`w-5 h-5 text-blue-400 transition-transform ${isModuleExpanded ? "rotate-180" : ""}`} />
                          </button>

                          {isModuleExpanded && (
                            <div className="border-t border-blue-400/20 px-4 py-4 space-y-4">
                              {/* Lecture Notes */}
                              <div className="bg-blue-950/40 rounded-lg p-4 border border-blue-400/10">
                                <h4 className="text-blue-300 font-bold text-sm mb-3 uppercase tracking-wider">📖 Lecture Notes</h4>
                                <div className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap">{module.notes}</div>
                              </div>

                              {/* Code Examples */}
                              <div>
                                <h4 className="text-blue-300 font-bold text-sm mb-3 uppercase tracking-wider">💻 Code Examples</h4>
                                <div className="space-y-3">
                                  {module.examples.map((example, exIdx) => (
                                    <div key={exIdx}>
                                      {example.description && (
                                        <p className="text-white/60 text-xs mb-1 ml-1">{example.description}</p>
                                      )}
                                      <div className="relative bg-slate-950/80 border border-blue-400/20 rounded-lg px-4 py-3 group">
                                        <CopyButton text={example.code} />
                                        <pre className="text-blue-200/90 text-xs font-mono whitespace-pre-wrap break-words pr-10 overflow-x-auto">
                                          {example.code}
                                        </pre>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
