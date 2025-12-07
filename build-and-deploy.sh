#!/bin/bash

# Build and Deploy Script with Environment Variables

set -e  # Exit on error

echo "🔧 Building with environment variables from .env..."
echo ""

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

# Clean build directory
rm -rf build/

# Build with environment variables
npm run build

# Check that API key is in build (last 10 chars for verification)
echo ""
echo "🔍 Verifying API key in build..."
BUILD_KEY=$(grep -o "REACT_APP_OPENAI_KEY=[^[:space:]]*" .env | cut -d'=' -f2 | tail -c 10)
ACTUAL_KEY=$(grep -o "sk-proj-[^\"']*" build/static/js/main.*.js | tail -c 10)

if [ "$BUILD_KEY" = "$ACTUAL_KEY" ]; then
  echo "✅ API key verified in build (ends with: $ACTUAL_KEY)"
else
  echo "❌ WARNING: API key mismatch!"
  echo "   Expected (from .env): $BUILD_KEY"
  echo "   Found in build: $ACTUAL_KEY"
  exit 1
fi

echo ""
echo "🚀 Deploying to Firebase..."
echo ""

# Use Node 20 for Firebase CLI
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 >/dev/null 2>&1

# Deploy
firebase deploy --only hosting

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "Your site: https://teach-league.web.app"
echo ""
