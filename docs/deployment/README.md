# Deployment Guide

## Environments
- **Development**: Local development environment
- **Staging**: Testing environment for pre-production
- **Production**: Live production environment

## Deployment Targets
- **Frontend**: Lovable platform
- **Backend**: Replit hosting
- **Workflows**: n8n Cloud or self-hosted

## CI/CD Pipeline
Automated deployment via GitHub Actions:
1. Code push triggers build
2. Tests and security scans run
3. Successful builds deploy to staging
4. Manual approval for production deployment
