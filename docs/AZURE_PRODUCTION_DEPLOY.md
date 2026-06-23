# Azure Production Deploy

This project deploys production as two Azure App Service Linux Node.js apps:

- Backend API app from the root Node.js package
- Frontend React app from `frontend/dist`

The GitHub Actions workflow deploys code packages directly with Azure App Service publish profiles.

## 1. Create Azure Resources

```powershell
az login
az account set --subscription "<SUBSCRIPTION_ID_OR_NAME>"

$suffix = Get-Random -Minimum 10000 -Maximum 99999
$rg = "rg-mernmovies-prod-$suffix"
$plan = "plan-mernmovies-prod-$suffix"
$backend = "mernmovies-api-node-$suffix"
$frontend = "mernmovies-web-node-$suffix"
$location = "southeastasia"

az group create --name $rg --location $location
az appservice plan create --resource-group $rg --name $plan --is-linux --sku B1
az webapp create --resource-group $rg --plan $plan --name $backend --runtime "NODE:22-lts"
az webapp create --resource-group $rg --plan $plan --name $frontend --runtime "NODE:22-lts"
```

## 2. Enable Basic Auth for Publish Profile

```powershell
az resource update --resource-group $rg --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/$backend --set properties.allow=true
az resource update --resource-group $rg --name ftp --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/$backend --set properties.allow=true
az resource update --resource-group $rg --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/$frontend --set properties.allow=true
az resource update --resource-group $rg --name ftp --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/$frontend --set properties.allow=true
```

## 3. Configure Web App Settings

```powershell
az webapp config set --resource-group $rg --name $backend --startup-file "npm start"
az webapp config set --resource-group $rg --name $frontend --startup-file "pm2 serve /home/site/wwwroot --no-daemon --spa"

az webapp config appsettings set --resource-group $rg --name $backend --settings NODE_ENV=production MONGO_URI="<mongodb-atlas-production-uri>" JWT_SECRET="<long-random-secret>" FRONTEND_ORIGIN="https://$frontend.azurewebsites.net" SCM_DO_BUILD_DURING_DEPLOYMENT=true
az webapp config appsettings set --resource-group $rg --name $frontend --settings SCM_DO_BUILD_DURING_DEPLOYMENT=false
```

## 4. Configure GitHub Actions Secrets

Set these in GitHub repository settings: `Settings > Secrets and variables > Actions`.

```text
BACKEND_WEBAPP_NAME=<backend-webapp-name>
FRONTEND_WEBAPP_NAME=<frontend-webapp-name>
AZURE_BACKEND_PUBLISH_PROFILE=<backend-publish-profile-xml>
AZURE_FRONTEND_PUBLISH_PROFILE=<frontend-publish-profile-xml>
FRONTEND_ORIGIN=https://<frontend-webapp-name>.azurewebsites.net
VITE_API_URL=https://<backend-webapp-name>.azurewebsites.net
```

## 5. Deploy

1. Push the branch containing the production CD workflow to GitHub.
2. Open GitHub Actions.
3. Run `CD Pipeline` manually.

## 6. Verify

```powershell
az webapp log tail --resource-group $rg --name $backend
az webapp log tail --resource-group $rg --name $frontend
```

Open:

- `https://<backend-webapp-name>.azurewebsites.net/api/v1/health`
- `https://<frontend-webapp-name>.azurewebsites.net`

Then test search/filter and register/login.

## Current Production Deployment

- Resource group: `rg-mern-movies-production`
- App Service plan: `plan-mernmovies-prod-81448`
- Backend app: `mernmovies-api-node-81448`
- Frontend app: `mernmovies-web-node-81448`
- Backend URL: `https://mernmovies-api-node-81448.azurewebsites.net`
- Frontend URL: `https://mernmovies-web-node-81448.azurewebsites.net`
- Runtime: `NODE|22-lts`
- Deployment method: App Service ZIP/code deploy, no Docker/ACR
