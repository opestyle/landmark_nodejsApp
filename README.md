# Landmark Technology DevOps Demo

A comprehensive DevOps teaching platform demonstrating modern containerization, orchestration, and CI/CD practices with a beautiful 1970s retro-futurist design.

## Features

- **Beautiful Web Interface**: 1970s retro-futurist design with burnt orange gradient
- **Contact Form / Message Board**: Interactive data entry with real database persistence
- **In-Memory Fallback**: App runs without a database using an in-memory store (data is ephemeral)
- **Complete DevOps Stack**: Docker, Kubernetes, CI/CD, Terraform

## Technology Stack

- **Frontend**: React 19, Tailwind CSS 4, TypeScript
- **Backend**: Express 4, tRPC 11, Node.js 22
- **Database**: MySQL 8.0 (optional — app falls back to in-memory storage)
- **Testing**: Vitest
- **Build Tool**: Vite, esbuild
- **Package Manager**: pnpm

## Prerequisites

- **Node.js 18+** — Download from [nodejs.org](https://nodejs.org/) (npm is included)
- **pnpm 10.33.0+** — Enabled via corepack: `corepack enable && corepack prepare pnpm@10.33.0 --activate`
- **Docker & Docker Compose** (optional, for containerization topics)
- **MySQL 8.0** (optional, for persistent database storage)

## Quick Start

### Step 1: Clone and Install Dependencies

```bash
git clone https://github.com/yourusername/landmark-devops-demo.git
cd landmark-devops-demo
corepack enable
pnpm install
```

### Step 2: Run Tests

```bash
pnpm test
```

Test files:
- `server/auth.logout.test.ts` — system health check via tRPC router
- `server/contacts.test.ts` — contact form Zod schema validation (8 test cases)

### Step 3: Build the Application

```bash
pnpm build
```

This builds the React frontend (Vite) and the Express backend (esbuild) into the `dist/` directory.

### Step 4: Start the Application

```bash
pnpm start
```

### Step 5: Access the Application

Open your browser to **http://localhost:3000**

> If port 3000 is busy, the server automatically finds the next available port and prints it to the console.

## Available Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page |
| `/message-board` | Message Board | Contact form with database persistence |
| `/topics` | Topics | DevOps topics overview |
| `/interview-prep` | Interview Prep | Interview preparation resources |
| `/resume-samples` | Resume Samples | Resume sample resources |
| `/components` | Component Showcase | UI component gallery |

## Database Setup (Optional)

The app works without a database. To enable persistent storage, choose one option:

### Option A: Docker (Recommended)

```bash
# Start MySQL in the background
docker-compose up db -d

# Push the schema to create tables (required on first run)
pnpm db:push
```

Docker Compose automatically creates the database, user, and grants permissions.
The `.env` file is pre-configured to connect to the Docker database.

> **Important:** You must run `pnpm db:push` after starting the database for the first time. This creates the `contacts` table. Without it, the app will fail to read/write contacts.

### Option B: Local MySQL

```bash
mysql -u root -e "CREATE DATABASE landmark_devops;"
mysql -u root -e "CREATE USER 'landmark'@'localhost' IDENTIFIED BY 'landmark123';"
mysql -u root -e "GRANT ALL PRIVILEGES ON landmark_devops.* TO 'landmark'@'localhost';"
mysql -u root -e "FLUSH PRIVILEGES;"
```

Then update `DATABASE_URL` in `.env`:

```
DATABASE_URL=mysql://landmark:landmark123@localhost:3306/landmark_devops
```

Then push the schema:

```bash
pnpm db:push
```

## Other Commands

```bash
pnpm check      # Type-check without building
pnpm format     # Format code with Prettier
```


## Docker

```bash
# Build the image
docker build -t landmark-devops:latest .

# Run (without database — uses in-memory store)
docker run -p 3000:3000 landmark-devops:latest

# Run (with external MySQL)
docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://landmark:landmark123@host.docker.internal:3306/landmark_devops \
  landmark-devops:latest
```

### Docker Compose (App + Database)

```bash
docker-compose up          # Start all services
docker-compose ps          # View running services
docker-compose logs -f     # View logs
docker-compose down        # Stop and remove
```

## Kubernetes Deployment

```bash
kubectl apply -f k8s/
kubectl get pods -n landmark-devops
kubectl port-forward svc/landmark-app-lb 3000:80 -n landmark-devops
```

See `k8s/README.md` for details.

## CI/CD Pipelines

- **GitHub Actions**: `.github/workflows/ci-cd.yml`
- **CircleCI**: `.circleci/config.yml`
- **Jenkins**: `Jenkinsfile`

## Infrastructure as Code

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

See `terraform/README.md` for details.

## Troubleshooting

### Port Already in Use

```bash
lsof -i :3000                        # macOS/Linux
netstat -ano | findstr :3000          # Windows

# Or set a different port
PORT=3001 pnpm start
```

### Database Connection Failed

```bash
docker-compose ps          # Check if MySQL is running
docker-compose up db       # Start database
```

### Build Failures

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm check
pnpm build
```

### Tests Failing

```bash
pnpm test -- --reporter=verbose
```

## License

MIT
