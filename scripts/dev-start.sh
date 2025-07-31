#!/bin/bash
set -e

echo "🚀 Starting Humain-Vibe-coder Development Environment"
echo "===================================================="

# Check if we have required tools
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found. Please install Node.js 18+"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm not found. Please install npm"; exit 1; }

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
fi

if [ ! -d "ai-development-conductor/frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd ai-development-conductor/frontend
    npm install
    cd ../..
fi

if [ ! -d "ai-development-conductor/backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd ai-development-conductor/backend
    npm install
    cd ../..
fi

# Run code quality checks
echo "🧹 Running code quality checks..."
npm run lint || echo "⚠️  Linting issues found - will be fixed on commit"

# Start development servers
echo "🎯 Starting development servers..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend will be available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Use concurrently to run both servers
npm run dev
