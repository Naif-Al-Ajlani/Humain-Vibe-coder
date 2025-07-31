# Development Setup Guide

## Prerequisites
- Node.js 18+
- npm 8+
- Git

## Quick Start
1. Clone the repository
2. Run `npm run setup` to install dependencies
3. Copy `.env.example` to `.env` and configure
4. Run `npm run dev` to start development servers

## Project Structure
```
ai-development-conductor/
├── frontend/    # Lovable-built React interface
├── backend/     # Express.js API server
├── workflows/   # n8n workflow definitions
└── ai-agents/   # AI agent configurations
```

## Development Workflow
1. Create feature branch
2. Make changes
3. Run tests: `npm test`
4. Run linting: `npm run lint`
5. Commit with conventional commits
6. Create pull request
