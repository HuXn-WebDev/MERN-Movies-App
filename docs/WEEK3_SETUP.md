# Week 3 Setup Summary

## Purpose

This document records the Week 3 progress for the MERN Movies App DevOps project. The focus is on a working CI prototype, backend search/filter support, Docker scaffolding, and a CD deployment skeleton.

## Completed Week 3 Deliverables

- Added GitHub Actions CI workflow: `.github/workflows/ci.yml`
- Added GitHub Actions CD skeleton: `.github/workflows/cd.yml`
- Added backend search and filter support for movies:
  - query parameters: `search`, `genre`, `year`, `rating`
- Added frontend search and filter UI enhancements:
  - search box
  - genre filter
  - year filter
  - rating filter
  - sort options (new, top, random)
- Added Docker support:
  - `Dockerfile.backend`
  - `Dockerfile.frontend`
  - `docker-compose.yml`
- Added pipeline plan documentation: `PIPELINE_PLAN.md`
- Added Week 3 setup documentation: `docs/WEEK3_SETUP.md`
- Added backend health Jest test: `backend/tests/app.test.js`
- Added ESM test support with Babel for Jest: `.babelrc`

## How to run Week 3 prototype

1. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```
2. Create a local `.env` file from `.env.example` and provide your MongoDB URI plus a secure JWT secret.
   ```bash
   copy .env.example .env
   # Edit .env and replace placeholder values
   ```
3. Start fullstack locally:
   ```bash
   npm run fullstack
   ```
4. Run lint and tests:
   ```bash
   npm run lint
   npm test
   ```
5. Build Docker images:
   ```bash
   npm run docker:build
   ```
6. Start Docker Compose stack:
   ```bash
   npm run compose:up
   ```

## Environment and secrets

- The provided `.env` content contains critical MongoDB connection information and a JWT secret.
- These values are important for local development but must not be committed to Git.
- Use `.env.example` as a template and keep actual credentials in `.env` only.
- For staging and production, store database URIs in GitHub Secrets rather than in the repository.

## Notes for Week 3

- Azure deployment is still a skeleton; production deployment commands go in `cd.yml` once secrets are available.
- Rating filter is supported via backend query parameter `rating` and frontend dropdown.
- This version keeps the App simple, focusing on Week 3 requirements rather than full monitoring or production hardening.
