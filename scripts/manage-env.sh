#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_help() {
    echo "Environment Management for Humain-Vibe-coder"
    echo "============================================="
    echo ""
    echo "Usage: $0 [COMMAND] [ENVIRONMENT]"
    echo ""
    echo "Commands:"
    echo "  setup [env]     - Set up environment files"
    echo "  check [env]     - Check environment configuration"
    echo "  validate        - Validate all environments"
    echo "  copy [from] [to] - Copy environment configuration"
    echo ""
    echo "Environments:"
    echo "  development     - Local development"
    echo "  staging         - Staging environment"
    echo "  production      - Production environment"
    echo ""
    echo "Examples:"
    echo "  $0 setup development"
    echo "  $0 check staging"
    echo "  $0 validate"
}

setup_env() {
    local env=$1
    echo -e "${BLUE}Setting up $env environment...${NC}"

    case $env in
        "development")
            setup_development_env
            ;;
        "staging")
            setup_staging_env
            ;;
        "production")
            setup_production_env
            ;;
        *)
            echo -e "${RED}Unknown environment: $env${NC}"
            show_help
            exit 1
            ;;
    esac
}

setup_development_env() {
    echo -e "${GREEN}Creating development environment files...${NC}"

    # Root .env for development
    cat > "$PROJECT_ROOT/.env" << 'ENVEOF'
# Development Environment Configuration
NODE_ENV=development

# Server Configuration
PORT=5000
HOST=localhost

# Database
DATABASE_TYPE=sqlite
DATABASE_PATH=./dev-database.sqlite

# AI Services (configure when ready)
OPENAI_API_KEY=your_openai_dev_key_here
CLAUDE_API_KEY=your_claude_dev_key_here

# n8n Configuration
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_WEBHOOK_URL=http://localhost:5678/webhook

# Security
JWT_SECRET=dev_jwt_secret_change_in_production
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
LOG_TO_FILE=true

# Feature Flags
AI_ENABLED=false
DEMO_MODE=true
DEBUG=true
ENVEOF

    # Frontend .env
    cat > "$PROJECT_ROOT/ai-development-conductor/frontend/.env" << 'ENVEOF'
# Frontend Development Environment
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_VERSION=v1

# Feature Flags
REACT_APP_AI_ENABLED=false
REACT_APP_DEMO_MODE=true
REACT_APP_DEBUG=true

# Development
REACT_APP_LOG_LEVEL=debug
GENERATE_SOURCEMAP=true
ENVEOF

    # Backend .env
    cat > "$PROJECT_ROOT/ai-development-conductor/backend/.env" << 'ENVEOF'
# Backend Development Environment
PORT=5000
NODE_ENV=development

# Database
DATABASE_TYPE=sqlite
DATABASE_PATH=./dev-database.sqlite

# AI Services
OPENAI_API_KEY=your_openai_dev_key_here
CLAUDE_API_KEY=your_claude_dev_key_here

# Security
JWT_SECRET=dev_jwt_secret_change_in_production
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
ENVEOF

    echo -e "${GREEN}✅ Development environment setup complete${NC}"
}

setup_staging_env() {
    echo -e "${YELLOW}Creating staging environment templates...${NC}"
    echo -e "${YELLOW}⚠️  Remember to replace placeholder values with actual staging credentials${NC}"

    # Staging environment template
    cat > "$PROJECT_ROOT/.env.staging" << 'ENVEOF'
# Staging Environment Configuration
NODE_ENV=staging

# Server Configuration
PORT=5000
HOST=0.0.0.0

# Database
DATABASE_TYPE=postgresql
DATABASE_URL=your_staging_database_url_here

# AI Services
OPENAI_API_KEY=your_openai_staging_key_here
CLAUDE_API_KEY=your_claude_staging_key_here

# n8n Configuration
N8N_HOST=your_staging_n8n_host
N8N_PORT=443
N8N_PROTOCOL=https
N8N_WEBHOOK_URL=https://your_staging_n8n_host/webhook
N8N_API_KEY=your_n8n_staging_api_key

# Security
JWT_SECRET=your_super_secure_staging_jwt_secret
CORS_ORIGIN=https://your-staging-frontend-domain.com

# Logging
LOG_LEVEL=info
LOG_TO_FILE=true

# Feature Flags
AI_ENABLED=true
DEMO_MODE=false
DEBUG=false
ENVEOF

    echo -e "${GREEN}✅ Staging environment template created${NC}"
}

setup_production_env() {
    echo -e "${RED}Creating production environment templates...${NC}"
    echo -e "${RED}⚠️  CRITICAL: Replace ALL placeholder values with secure production credentials${NC}"

    # Production environment template
    cat > "$PROJECT_ROOT/.env.production" << 'ENVEOF'
# Production Environment Configuration
NODE_ENV=production

# Server Configuration
PORT=5000
HOST=0.0.0.0

# Database
DATABASE_TYPE=postgresql
DATABASE_URL=your_production_database_url_here

# AI Services
OPENAI_API_KEY=your_openai_production_key_here
CLAUDE_API_KEY=your_claude_production_key_here

# n8n Configuration
N8N_HOST=your_production_n8n_host
N8N_PORT=443
N8N_PROTOCOL=https
N8N_WEBHOOK_URL=https://your_production_n8n_host/webhook
N8N_API_KEY=your_n8n_production_api_key

# Security
JWT_SECRET=your_ultra_secure_production_jwt_secret
CORS_ORIGIN=https://your-production-domain.com

# Monitoring
SENTRY_DSN=your_sentry_dsn_for_error_tracking

# Logging
LOG_LEVEL=warn
LOG_TO_FILE=true

# Feature Flags
AI_ENABLED=true
DEMO_MODE=false
DEBUG=false
ENVEOF

    echo -e "${RED}✅ Production environment template created${NC}"
}

check_env() {
    local env=$1
    echo -e "${BLUE}Checking $env environment...${NC}"

    # Check if environment file exists
    if [ "$env" = "development" ]; then
        env_file="$PROJECT_ROOT/.env"
    else
        env_file="$PROJECT_ROOT/.env.$env"
    fi

    if [ ! -f "$env_file" ]; then
        echo -e "${RED}❌ Environment file not found: $env_file${NC}"
        return 1
    fi

    echo -e "${GREEN}✅ Environment file exists: $env_file${NC}"

    # Check for required variables
    required_vars=("NODE_ENV" "PORT" "JWT_SECRET")

    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" "$env_file"; then
            value=$(grep "^$var=" "$env_file" | cut -d'=' -f2)
            if [[ "$value" == *"your_"* ]] || [[ "$value" == *"_here"* ]]; then
                echo -e "${YELLOW}⚠️  $var needs to be configured (contains placeholder)${NC}"
            else
                echo -e "${GREEN}✅ $var is configured${NC}"
            fi
        else
            echo -e "${RED}❌ Missing required variable: $var${NC}"
        fi
    done
}

validate_all() {
    echo -e "${BLUE}Validating all environments...${NC}"
    echo ""

    check_env "development"
    echo ""
    check_env "staging"
    echo ""
    check_env "production"
}

# Main script logic
case "${1:-help}" in
    "setup")
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Environment not specified${NC}"
            show_help
            exit 1
        fi
        setup_env "$2"
        ;;
    "check")
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Environment not specified${NC}"
            show_help
            exit 1
        fi
        check_env "$2"
        ;;
    "validate")
        validate_all
        ;;
    "help"|*)
        show_help
        ;;
esac
