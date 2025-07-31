# API Documentation

## Overview
This document describes the Humain-Vibe-coder API endpoints.

## Authentication
All API endpoints require authentication via JWT tokens.

## Endpoints

### AI Agents
- `POST /api/ai/architect` - Architect agent endpoint
- `POST /api/ai/frontend` - Frontend agent endpoint
- `POST /api/ai/backend` - Backend agent endpoint
- `POST /api/ai/qa` - QA agent endpoint
- `POST /api/ai/devops` - DevOps agent endpoint

### Workflows
- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create new workflow
- `GET /api/workflows/:id` - Get specific workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
