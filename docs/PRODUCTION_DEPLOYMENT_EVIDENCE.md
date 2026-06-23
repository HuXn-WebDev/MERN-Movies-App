# Production Deployment Evidence

## Deployment Status

Production deployment is complete and running on Azure App Service without Docker or ACR.

## Azure Resources

- Resource group: `rg-mern-movies-production`
- App Service plan: `plan-mernmovies-prod-81448`
- Backend Web App: `mernmovies-api-node-81448`
- Frontend Web App: `mernmovies-web-node-81448`
- Runtime: `NODE|22-lts`
- HTTPS-only: enabled

## Production URLs

- Frontend: `https://mernmovies-web-node-81448.azurewebsites.net`
- Backend: `https://mernmovies-api-node-81448.azurewebsites.net`
- Health check: `https://mernmovies-api-node-81448.azurewebsites.net/api/v1/health`
- Movies API: `https://mernmovies-api-node-81448.azurewebsites.net/api/v1/movies/all-movies`

## Verification Results

Verified on June 9, 2026:

- Backend health endpoint returns `200 OK`.
- Movies API endpoint returns `200 OK`.
- Frontend endpoint returns `200 OK`.
- Backend App Service state is `Running`.
- Frontend App Service state is `Running`.
- Backend App Service uses `NODE_ENV=production`.
- Backend App Service is configured for the `moviesapp-prod` MongoDB database.
- Frontend CORS origin is configured on the backend.

## Local Quality Gates

Latest local checks:

- `npm.cmd run lint` passed.
- `npm.cmd run build:frontend` passed with production backend URL.
- `npm.cmd run format:check` passed.
- `npm.cmd test` passed: 3 suites, 11 tests.

## Deployment Method

The final deployment follows the Week 11 Azure CLI/App Service module style:

- Azure App Service Linux runtime
- Node.js runtime
- ZIP/code deployment
- Publish profile compatible GitHub Actions workflow
- No Docker
- No ACR

GitHub Actions production CD is available through manual `workflow_dispatch` after publish profile secrets are configured.
