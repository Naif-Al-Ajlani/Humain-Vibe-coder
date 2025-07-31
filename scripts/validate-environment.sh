#!/bin/bash
set -e

echo "🔍 Validating Development Environment"
echo "===================================="

# Check Node.js version
node_version=$(node --version)
echo "Node.js version: $node_version"
required_major=18
current_major=$(echo $node_version | cut -d'.' -f1 | sed 's/v//')

if [ "$current_major" -lt "$required_major" ]; then
    echo "❌ Node.js version $node_version is too old. Required: v$required_major+"
    exit 1
else
    echo "✅ Node.js version is compatible"
fi

# Check npm version
npm_version=$(npm --version)
echo "npm version: v$npm_version"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Not in project root (no package.json found)"
    exit 1
fi

# Check required directories
required_dirs=(
    "ai-development-conductor/frontend"
    "ai-development-conductor/backend"
    ".github/workflows"
    "config/security"
    "config/logging"
    "docs"
)

echo ""
echo "📁 Checking project structure..."
for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir"
    else
        echo "❌ $dir missing"
        mkdir -p "$dir"
        echo "   Created: $dir"
    fi
done

# Check environment files
echo ""
echo "📋 Checking environment configuration..."
env_files=(
    ".env.example"
    "ai-development-conductor/frontend/.env.example"
    "ai-development-conductor/backend/.env.example"
)

for file in "${env_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file missing"
    fi
done

# Check if dependencies are installed
echo ""
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ Root dependencies installed"
else
    echo "⚠️  Root dependencies not installed"
    echo "   Run: npm install"
fi

if [ -d "ai-development-conductor/frontend/node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "⚠️  Frontend dependencies not installed"
    echo "   Run: cd ai-development-conductor/frontend && npm install"
fi

if [ -d "ai-development-conductor/backend/node_modules" ]; then
    echo "✅ Backend dependencies installed"
else
    echo "⚠️  Backend dependencies not installed"
    echo "   Run: cd ai-development-conductor/backend && npm install"
fi

# Test linting and formatting
echo ""
echo "🧹 Testing code quality tools..."
if command -v npx >/dev/null 2>&1; then
    echo "Testing ESLint..."
    npx eslint --version && echo "✅ ESLint working" || echo "❌ ESLint issues"

    echo "Testing Prettier..."
    npx prettier --version && echo "✅ Prettier working" || echo "❌ Prettier issues"

    echo "Testing Husky..."
    if [ -d ".husky" ]; then
        echo "✅ Husky hooks configured"
    else
        echo "⚠️  Husky not initialized"
        echo "   Run: npx husky install"
    fi
else
    echo "⚠️  npx not available"
fi

echo ""
echo "🎯 Environment validation complete!"
