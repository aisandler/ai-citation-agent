#!/bin/bash

# Build Next.js dashboard for production
# Usage: ./build_dashboard.sh

set -e  # Exit on error

DASHBOARD_DIR="$(cd "$(dirname "$0")/../../../dashboard" && pwd)"

echo ""
echo "🏗️  Building Next.js Dashboard..."
echo "   Location: $DASHBOARD_DIR"
echo ""

# Check if dashboard directory exists
if [ ! -d "$DASHBOARD_DIR" ]; then
  echo "❌ Error: Dashboard directory not found at $DASHBOARD_DIR"
  exit 1
fi

# Change to dashboard directory
cd "$DASHBOARD_DIR"

# Check if package.json exists
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found in dashboard directory"
  exit 1
fi

# Check if node_modules exists, install if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo ""
fi

# Clean previous build
if [ -d ".next" ]; then
  echo "🧹 Cleaning previous build..."
  rm -rf .next
  echo ""
fi

# Run production build
echo "🔨 Running production build..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build completed successfully!"
  echo "   Output: $DASHBOARD_DIR/.next"
  echo ""
  exit 0
else
  echo ""
  echo "❌ Build failed!"
  echo "   Check the error messages above for details"
  echo ""
  exit 1
fi
