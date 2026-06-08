# MERN Movies App DevOps Roadmap

## Project Objective
Build a DevOps pipeline for the MERN Movies App to automate code quality, testing, container builds, and cloud deployment.

## Week 3 Focus
- Establish CI workflow with automated linting, testing, and frontend build.
- Add containerization support for backend and frontend.
- Create documentation for the pipeline and deployment assumptions.
- Build a prototype workflow skeleton for Azure deployment and ACR integration.

## Pipeline Architecture
1. Development
   - Code changes pushed to GitHub branches.
   - Local development uses `npm run fullstack` for backend and frontend.
2. Continuous Integration
   - `ci.yml` validates code on push and PR.
   - Steps:
     - `npm install`
     - `cd frontend && npm install`
     - Lint backend and frontend
     - Run backend tests
     - Build frontend production assets
3. Containerization
   - `Dockerfile.backend` builds backend image.
   - `Dockerfile.frontend` builds frontend static assets.
   - `docker-compose.yml` orchestrates backend, frontend, and local MongoDB.
4. Continuous Deployment
   - `cd.yml` contains a staged deployment skeleton.
   - Integrates Azure App Service and Azure Container Registry as placeholder steps.
   - Supports manual approval between staging and production.
5. Documentation
   - `README.md` explains setup, local commands, and CI/CD structure.
   - `PIPELINE_PLAN.md` documents the roadmap and Week 3 scope.

## Milestones
- [x] Inspect source repo and existing app structure
- [x] Add GitHub Actions CI workflow
- [x] Add Dockerfiles and compose configuration
- [x] Add root lint and test scripts
- [x] Add backend health test using Jest and Supertest
- [x] Add deployment skeleton with Azure placeholders
- [ ] Extend workflow to actual ACR and Azure App Service when credentials are available

## Next Steps
1. Install additional dev dependencies in root:
   - `eslint`
   - `prettier`
   - `jest`
   - `supertest`
2. Run `npm run lint` and `npm run test` locally.
3. Add Azure secrets to GitHub and enable `cd.yml` deployment.
4. Incrementally add project features and monitoring once the pipeline is stable.
