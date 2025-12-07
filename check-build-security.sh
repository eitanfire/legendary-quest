#!/bin/bash

# Script to verify API keys are not exposed in build output

echo "🔍 Checking for exposed API keys in build directory..."
echo ""

if [ ! -d "build" ]; then
  echo "❌ No build directory found. Run 'npm run build' first."
  exit 1
fi

# Check for OpenAI keys (pattern: sk-proj-...)
echo "Checking for OpenAI keys (sk-proj-*)..."
OPENAI_FOUND=$(grep -r "sk-proj-" build/ 2>/dev/null)

if [ -n "$OPENAI_FOUND" ]; then
  echo "⚠️  WARNING: OpenAI API key found in build files!"
  echo "$OPENAI_FOUND" | head -3
  echo ""
  echo "🚨 YOUR API KEY IS EXPOSED! Anyone can extract it from your website."
  EXPOSED=true
else
  echo "✅ No OpenAI keys found in build"
fi

echo ""

# Check for Gemini keys (pattern: AIza...)
echo "Checking for Gemini keys (AIza*)..."
GEMINI_FOUND=$(grep -r "AIza" build/ 2>/dev/null)

if [ -n "$GEMINI_FOUND" ]; then
  echo "⚠️  WARNING: Gemini API key found in build files!"
  echo "$GEMINI_FOUND" | head -3
  echo ""
  echo "🚨 YOUR API KEY IS EXPOSED! Anyone can extract it from your website."
  EXPOSED=true
else
  echo "✅ No Gemini keys found in build"
fi

echo ""
echo "───────────────────────────────────────────────"
echo ""

if [ "$EXPOSED" = true ]; then
  echo "❌ SECURITY CHECK FAILED"
  echo ""
  echo "Your API keys are embedded in the JavaScript bundle."
  echo ""
  echo "This means:"
  echo "  • Anyone visiting your site can steal your API keys"
  echo "  • Attackers can use your keys to make requests"
  echo "  • You will be charged for their usage"
  echo ""
  echo "To fix this properly:"
  echo "  1. Read SECURITY_FIX_URGENT.md"
  echo "  2. Implement Firebase Cloud Functions (backend proxy)"
  echo "  3. Move API calls server-side"
  echo "  4. Remove REACT_APP_*_KEY from frontend code"
  echo ""
  exit 1
else
  echo "✅ SECURITY CHECK PASSED"
  echo ""
  echo "No API keys found in build output."
  echo ""
  echo "⚠️  However, if you're using REACT_APP_* environment variables,"
  echo "   the keys are still being bundled into your JavaScript."
  echo ""
  echo "For production, you should:"
  echo "  1. Implement Firebase Cloud Functions"
  echo "  2. Move API calls to the backend"
  echo "  3. Never expose API keys in frontend code"
  echo ""
  echo "See SECURITY_FIX_URGENT.md for the proper solution."
  echo ""
  exit 0
fi
