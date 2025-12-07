#!/bin/bash

# Deploy Firebase Cloud Functions - Secure API Setup
# This script helps you deploy Cloud Functions to hide API keys

set -e  # Exit on error

echo "🚀 Firebase Cloud Functions Deployment"
echo "======================================"
echo ""

# Source nvm to ensure we're using Node 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 >/dev/null 2>&1 || echo "⚠️  Warning: Node 20 not active"

# Check Node version
NODE_VERSION=$(node --version)
echo "Node version: $NODE_VERSION"
echo ""

# Step 1: Set secrets
echo "Step 1: Setting API Keys as Firebase Secrets"
echo "───────────────────────────────────────────────"
echo ""
echo "You'll be prompted to enter your API keys."
echo "These will be stored SECURELY in Google Cloud Secret Manager."
echo "They will NEVER be exposed in your code or to users."
echo ""

# Read API keys from .env file
OPENAI_KEY=$(grep "REACT_APP_OPENAI_KEY" .env | cut -d '=' -f2)
GEMINI_KEY=$(grep "REACT_APP_GEMINI_KEY" .env | cut -d '=' -f2)

if [ -z "$OPENAI_KEY" ] || [ "$OPENAI_KEY" = "your_new_openai_key_here" ]; then
  echo "❌ Please set your actual OpenAI API key in .env first"
  echo "   Edit .env and replace 'your_new_openai_key_here' with your real key"
  exit 1
fi

if [ -z "$GEMINI_KEY" ] || [ "$GEMINI_KEY" = "your_gemini_key_here_consider_rotating" ]; then
  echo "⚠️  Gemini key not set. Skipping..."
  SET_GEMINI=false
else
  SET_GEMINI=true
fi

# Set OpenAI key
echo "Setting OPENAI_KEY..."
echo "$OPENAI_KEY" | firebase functions:secrets:set OPENAI_KEY

# Set Gemini key if available
if [ "$SET_GEMINI" = true ]; then
  echo "Setting GEMINI_KEY..."
  echo "$GEMINI_KEY" | firebase functions:secrets:set GEMINI_KEY
fi

echo ""
echo "✅ Secrets configured successfully!"
echo ""

# Step 2: Deploy functions
echo "Step 2: Deploying Cloud Functions"
echo "───────────────────────────────────────────────"
echo ""
firebase deploy --only functions

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "Your Cloud Functions are now deployed at:"
echo "  • generateCurriculum: https://us-central1-teach-league.cloudfunctions.net/generateCurriculum"
echo "  • healthCheck: https://us-central1-teach-league.cloudfunctions.net/healthCheck"
echo ""
echo "Next steps:"
echo "  1. Test the health check:"
echo "     curl https://us-central1-teach-league.cloudfunctions.net/healthCheck"
echo ""
echo "  2. Let me know when ready, and I'll update your frontend code to use"
echo "     these secure Cloud Functions instead of exposing API keys!"
echo ""
echo "  3. After frontend update, you can remove API keys from .env"
echo ""
