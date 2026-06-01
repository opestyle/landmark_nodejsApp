# Docker - Containerization Guide

This guide covers Docker containerization for the Landmark Technology DevOps Demo application. The setup supports teaching Docker as independent topics.

## Quick Start

### Topic 1: Basic Docker (Dockerfile Only)

Learn containerization with a simple Dockerfile:

```bash
# Build the Docker image
docker build -t landmark-devops:latest .

# Run the container (requires external MySQL)
docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://landmark:landmark123@host.docker.internal:3306/landmark_devops \
  landmark-devops:latest

# Access the application
# http://localhost:3000

# View container logs
docker logs -f <container-id>

# Stop the container
docker stop <container-id>
```

**Prerequisites for Topic 1:**
- MySQL running locally or on another host
- Docker installed

**Teaching Points:**
- Dockerfile syntax and structure
- Image layers and caching
- Container ports and networking
- Environment variables
- Running and managing containers

### Topic 2: Docker Compose (Multi-Container Orchestration)

Learn container orchestration with Docker Compose:

```bash
# Start all services (app + database)
docker-compose up

# Run in background
docker-compose up -d

# View running services
docker-compose ps

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild images
docker-compose up -d --build
```

**Prerequisites for Topic 2:**
- Docker and Docker Compose installed
- No external MySQL needed (included in compose)

**Teaching Points:**
- Service orchestration
- Container networking
- Volume management
- Environment configuration
- Service dependencies
- Multi-container applications

## Dockerfile Explanation

The Dockerfile is intentionally simple (9 lines) for teaching:

```dockerfile
FROM node:22-alpine                    # 1. Base image
WORKDIR /app                           # 2. Working directory
COPY package*.json .                   # 3. Copy dependencies
RUN pnpm install --frozen-lockfile     # 4. Install dependencies
COPY . .                               # 5. Copy source code
RUN pnpm build                         # 6. Build application
EXPOSE 3000                            # 7. Expose port
ENV NODE_ENV=production                # 8. Set environment
CMD ["node", "dist/index.js"]          # 9. Start application
```

### Line-by-Line Breakdown

| Line | Command | Purpose |
|------|---------|---------|
| 1 | `FROM node:22-alpine` | Use lightweight Node.js image |
| 2 | `WORKDIR /app` | Set working directory inside container |
| 3 | `COPY package*.json .` | Copy package files (package.json, package-lock.json) |
| 4 | `RUN pnpm install --frozen-lockfile` | Install dependencies |
| 5 | `COPY . .` | Copy entire application code |
| 6 | `RUN pnpm build` | Build the application |
| 7 | `EXPOSE 3000` | Document which port the app uses |
| 8 | `ENV NODE_ENV=production` | Set production environment |
| 9 | `CMD ["node", "dist/index.js"]` | Run the application |

## Docker Compose Configuration

The `docker-compose.yml` orchestrates two services:

```yaml
version: '3.8'

services:
  app:
    build: .                    # Build from Dockerfile
    ports:
      - "3000:3000"            # Map port 3000
    environment:
      - DATABASE_URL=mysql://landmark:landmark123@db:3306/landmark_devops
      - NODE_ENV=development
    depends_on:
      - db                      # Wait for db service

  db:
    image: mysql:8.0           # Use MySQL image
    environment:
      - MYSQL_ROOT_PASSWORD=root123
      - MYSQL_DATABASE=landmark_devops
      - MYSQL_USER=landmark
      - MYSQL_PASSWORD=landmark123
    ports:
      - "3306:3306"            # Map database port
    volumes:
      - db_data:/var/lib/mysql # Persistent storage

volumes:
  db_data:                      # Named volume for database
```

### Service Configuration Explained

**App Service:**
- Builds image from Dockerfile
- Exposes port 3000 for web access
- Sets DATABASE_URL to connect to db service
- Depends on db service (waits for startup)

**Database Service:**
- Uses official MySQL 8.0 image
- Sets root password and creates database
- Creates user with limited privileges
- Uses named volume for persistent data

## Common Docker Commands

### Building Images

```bash
# Build image with tag
docker build -t landmark-devops:latest .

# Build with specific tag
docker build -t landmark-devops:v1.0.0 .

# Build without cache
docker build --no-cache -t landmark-devops:latest .

# View build history
docker history landmark-devops:latest
```

### Running Containers

```bash
# Run container in foreground
docker run -p 3000:3000 landmark-devops:latest

# Run container in background
docker run -d -p 3000:3000 landmark-devops:latest

# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://user:pass@host:3306/db \
  landmark-devops:latest

# Run with volume mount
docker run -p 3000:3000 \
  -v /local/path:/app/data \
  landmark-devops:latest

# Run with custom name
docker run --name my-app -p 3000:3000 landmark-devops:latest
```

### Managing Containers

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container logs
docker logs <container-id>

# Follow logs in real-time
docker logs -f <container-id>

# Stop container
docker stop <container-id>

# Start container
docker start <container-id>

# Remove container
docker rm <container-id>

# Execute command in running container
docker exec -it <container-id> sh

# Inspect container details
docker inspect <container-id>
```

### Managing Images

```bash
# List images
docker images

# Remove image
docker rmi landmark-devops:latest

# Tag image
docker tag landmark-devops:latest landmark-devops:v1.0.0

# Push to registry
docker push username/landmark-devops:latest

# Pull from registry
docker pull username/landmark-devops:latest
```

## Docker Compose Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View running services
docker-compose ps

# View service logs
docker-compose logs

# Follow logs for specific service
docker-compose logs -f app

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild images
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build app

# Execute command in service
docker-compose exec app sh

# View resource usage
docker-compose stats
```

## Volumes and Persistent Storage

### Understanding Volumes

Volumes provide persistent storage that survives container restarts:

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect landmark-db_data

# Remove unused volumes
docker volume prune
```

### Volume Types in docker-compose.yml

1. **Named Volumes** (Recommended for production)
   ```yaml
   volumes:
     db_data:
       driver: local
   ```

2. **Bind Mounts** (For development)
   ```yaml
   volumes:
     - ./data:/app/data
   ```

## Networking

### Service Discovery

Services in docker-compose communicate using service names:

```bash
# From app service, connect to database
DATABASE_URL=mysql://landmark:landmark123@db:3306/landmark_devops
```

### Port Mapping

```bash
# Format: <host-port>:<container-port>
ports:
  - "3000:3000"   # Access app at localhost:3000
  - "3306:3306"   # Access db at localhost:3306
```

## Environment Variables

### Setting Environment Variables

```bash
# In docker-compose.yml
environment:
  - DATABASE_URL=mysql://user:pass@db:3306/db
  - NODE_ENV=production

# In Dockerfile
ENV NODE_ENV=production

# At runtime
docker run -e DATABASE_URL=... landmark-devops:latest
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Use different port
docker run -p 8080:3000 landmark-devops:latest
```

### Database Connection Failed

```bash
# Check if database is running
docker-compose ps

# View database logs
docker-compose logs db

# Test connection
docker-compose exec db mysql -u landmark -p -e "SELECT 1"
```

### Container Exits Immediately

```bash
# View logs to see error
docker logs <container-id>

# Run with interactive terminal
docker run -it landmark-devops:latest sh
```

### Out of Disk Space

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune
```

## Teaching Progression

### Beginner: Understanding Dockerfile

1. Review Dockerfile line by line
2. Build image: `docker build -t landmark-devops:latest .`
3. Run container: `docker run -p 3000:3000 landmark-devops:latest`
4. Discuss image layers: `docker history landmark-devops:latest`
5. Modify Dockerfile and rebuild

### Intermediate: Multi-Container with Compose

1. Review docker-compose.yml
2. Start services: `docker-compose up`
3. Explore service networking
4. Modify environment variables
5. Scale services: `docker-compose up --scale app=3`

### Advanced: Production Optimization

1. Optimize Dockerfile for size
2. Implement health checks
3. Use multi-stage builds
4. Configure resource limits
5. Set up logging and monitoring

## Key Concepts

- **Image**: Template for creating containers
- **Container**: Running instance of an image
- **Layer**: Each Dockerfile command creates a layer
- **Volume**: Persistent storage outside containers
- **Network**: Communication between containers
- **Service**: Container managed by docker-compose
- **Compose**: Tool for defining multi-container applications

## Next Steps

1. **Kubernetes**: Deploy containers with orchestration (see `k8s/README.md`)
2. **CI/CD**: Automate Docker builds (see `.github/workflows/README.md`)
3. **Registry**: Push images to Docker Hub or private registry
4. **Monitoring**: Add container monitoring and logging
5. **Security**: Implement image scanning and security best practices
