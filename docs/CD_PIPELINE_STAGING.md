# Continuous Deployment (CD) Pipeline

## Overview

This project uses a Docker-based deployment architecture with Azure Container Registry (ACR) and Azure App Service for Containers.

The deployment process follows this workflow:

```text
GitHub Repository
        │
        ▼
GitHub Actions
(Build, Test, Docker Build)
        │
        ▼
Azure Container Registry (ACR)
(Store Docker Images)
        │
        ▼
Azure App Service
(Continuous Deployment Enabled)
        │
        ▼
Application Updated Automatically
```

Unlike traditional deployments that require GitHub Actions to directly deploy to Azure using Service Principals or Publish Profiles, this architecture relies on Azure App Service Continuous Deployment.

---

# Deployment Strategy

## Build and Push

GitHub Actions performs the following tasks:

1. Checkout source code
2. Install dependencies
3. Run linting
4. Run formatting checks
5. Run backend tests
6. Build Docker images
7. Push Docker images to Azure Container Registry

Images are pushed using the `latest` tag.

Example:

```text
mernmoviespso.azurecr.io/mernmoviesapp-backend:latest
mernmoviespso.azurecr.io/mernmoviesapp-frontend:latest
```

---

## Continuous Deployment

Azure App Service is configured with:

```text
Image Source:
Azure Container Registry

Image:
mernmoviesapp-backend:latest
mernmoviesapp-frontend:latest

Continuous Deployment:
Enabled
```

When a new image is pushed to ACR:

```text
GitHub Actions
    ↓
Push Image to ACR
    ↓
ACR Notifies Azure
    ↓
Azure Pulls New Image
    ↓
Container Restarts
    ↓
Application Updated
```

Therefore, GitHub Actions does not need to directly deploy to Azure.

---

# Why No Azure Credentials?

Initially, deployment was planned using:

```yaml
azure/login@v2
```

with:

```text
AZURE_CREDENTIALS_STAGING
AZURE_CREDENTIALS_PRODUCTION
```

However:

- Publish Profile download is disabled
- Microsoft Entra ID access is restricted
- Service Principal creation is not available

Because Azure App Service Continuous Deployment is enabled, direct deployment credentials are not required.

The deployment responsibility is delegated to Azure App Service.

---

# Required GitHub Secrets

The pipeline currently requires:

```text
ACR_LOGIN_SERVER
ACR_USERNAME
ACR_PASSWORD

STAGING_BACKEND_URL
PRODUCTION_BACKEND_URL
```

Example:

```text
ACR_LOGIN_SERVER=mernmoviespso.azurecr.io
```

---

# Staging Environment

Backend:

```text
mern-movies-backend-staging
```

Frontend:

```text
mern-movies-frontend-staging
```

Both services pull images from:

```text
mernmoviespso.azurecr.io
```

using the `latest` tag.

---

# Production Environment

Production should follow the same architecture as staging:

```text
GitHub Actions
    ↓
Push Image to ACR
    ↓
Azure App Service Continuous Deployment
    ↓
Production Updated
```

Before production deployment can be fully automated, the production App Service must:

1. Use the ACR image
2. Use the correct image tag
3. Enable Continuous Deployment

---

# Verification

After a successful pipeline run:

Backend health endpoint:

```text
/api/v1/health
```

Example:

```text
https://<backend-url>/api/v1/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "backend"
}
```

---

# Benefits of This Architecture

- Consistent Docker-based deployment
- No manual file deployment
- Images stored centrally in ACR
- Reproducible environments
- Staging and Production can share the same deployment model
- Reduced dependency on Azure Service Principal credentials
- Simpler deployment workflow

```

```
