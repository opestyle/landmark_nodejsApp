# CI/CD Pipelines Guide

## GitHub Actions

Located in `.github/workflows/ci-cd.yml`

### Stages

1. **Build**: Install dependencies and build application
2. **Test**: Run test suite
3. **Docker Build**: Build Docker image (on main branch only)

### Trigger

- Push to `main` or `develop` branch
- Pull requests to `main` or `develop` branch

### Run

```bash
# View workflow runs
gh workflow list

# View latest run
gh run list
```

## CircleCI

Located in `.circleci/config.yml`

### Stages

1. **Build**: Install dependencies and build application
2. **Docker Build**: Build Docker image (on main branch only)

### Trigger

- Push to `main` or `develop` branch
- Pull requests to `main` or `develop` branch

### Setup

Create `.circleci/config.yml` in your repository root.

## Jenkins

Located in `Jenkinsfile`

### Stages

1. **Build**: Install dependencies and build application
2. **Test**: Run test suite
3. **Docker Build**: Build Docker image (on main branch only)

### Setup

1. Create Jenkins pipeline job
2. Point to `Jenkinsfile` in repository
3. Configure webhook for automatic triggers

## Teaching Points

- **Build Stage**: Compile and bundle application
- **Test Stage**: Run automated tests
- **Docker Stage**: Create container image
- **Automation**: Reduce manual deployment steps
- **Consistency**: Same process every time
