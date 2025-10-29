#!/bin/bash

# Deploy dashboard to Vercel
# Usage: ./deploy_vercel.sh [--production]

set -e  # Exit on error

DASHBOARD_DIR="$(cd "$(dirname "$0")/../../../dashboard" && pwd)"
PRODUCTION=false

# Parse arguments
if [ "$1" == "--production" ]; then
  PRODUCTION=true
fi

echo ""
echo "🚀 Deploying Dashboard to Vercel..."
echo "   Location: $DASHBOARD_DIR"
echo "   Mode: $([ "$PRODUCTION" == "true" ] && echo "Production" || echo "Preview")"
echo ""

# Check if dashboard directory exists
if [ ! -d "$DASHBOARD_DIR" ]; then
  echo "❌ Error: Dashboard directory not found at $DASHBOARD_DIR"
  exit 1
fi

# Change to dashboard directory
cd "$DASHBOARD_DIR"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "❌ Error: Vercel CLI is not installed"
  echo ""
  echo "Install with: npm install -g vercel"
  echo "Or see: https://vercel.com/docs/cli"
  exit 1
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
  echo "🔐 Vercel authentication required..."
  echo ""
  vercel login
  echo ""
fi

# Deploy
echo "📦 Deploying to Vercel..."
echo ""

if [ "$PRODUCTION" == "true" ]; then
  vercel --prod
else
  vercel
fi

DEPLOY_EXIT_CODE=$?

if [ $DEPLOY_EXIT_CODE -eq 0 ]; then
  echo ""
  echo "✅ Deployment completed successfully!"
  echo ""
  echo "📋 Next steps:"
  echo "   - Visit your dashboard URL (shown above)"
  echo "   - Verify all data displays correctly"
  echo "   - Share the URL with stakeholders"
  echo ""
  exit 0
else
  echo ""
  echo "❌ Deployment failed!"
  echo "   Check the error messages above for details"
  echo ""
  echo "💡 Common issues:"
  echo "   - Vercel authentication expired (run: vercel login)"
  echo "   - Project not linked (run: vercel link)"
  echo "   - Build errors (check build logs above)"
  echo ""
  exit 1
fi
