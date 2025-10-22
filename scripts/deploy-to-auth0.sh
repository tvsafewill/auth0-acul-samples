#!/bin/bash

#######################################################################
# Deploy Auth0 ACUL Screen via Management API
#
# This script automates:
# 1. Building the application
# 2. Generating settings.json with correct file hashes
# 3. Deploying to Auth0 via Management API
#
# Usage:
#   ./scripts/deploy-to-auth0.sh <cdn-url> <screen-name>
#
# Example:
#   ./scripts/deploy-to-auth0.sh https://my-acul.vercel.app login-passwordless-email-code
#
# Environment Variables Required:
#   AUTH0_DOMAIN       - Your Auth0 tenant domain (e.g., your-tenant.auth0.com)
#   AUTH0_CLIENT_ID    - Management API client ID
#   AUTH0_CLIENT_SECRET - Management API client secret
#######################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
CDN_URL=$1
SCREEN_NAME=${2:-"login-passwordless-email-code"}

# Check arguments
if [ -z "$CDN_URL" ]; then
  echo -e "${RED}❌ Error: CDN URL is required${NC}"
  echo ""
  echo "Usage:"
  echo "  $0 <cdn-url> [screen-name]"
  echo ""
  echo "Example:"
  echo "  $0 https://my-acul.vercel.app login-passwordless-email-code"
  exit 1
fi

# Check environment variables
if [ -z "$AUTH0_DOMAIN" ] || [ -z "$AUTH0_CLIENT_ID" ] || [ -z "$AUTH0_CLIENT_SECRET" ]; then
  echo -e "${RED}❌ Error: Missing required environment variables${NC}"
  echo ""
  echo "Please set the following environment variables:"
  echo "  AUTH0_DOMAIN        - Your Auth0 tenant domain"
  echo "  AUTH0_CLIENT_ID     - Management API client ID"
  echo "  AUTH0_CLIENT_SECRET - Management API client secret"
  echo ""
  echo "Example:"
  echo "  export AUTH0_DOMAIN=your-tenant.auth0.com"
  echo "  export AUTH0_CLIENT_ID=abc123"
  echo "  export AUTH0_CLIENT_SECRET=xyz789"
  exit 1
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Auth0 ACUL Deployment Script${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Configuration:"
echo "  CDN URL:     $CDN_URL"
echo "  Screen:      $SCREEN_NAME"
echo "  Auth0:       $AUTH0_DOMAIN"
echo ""

# Step 1: Build
echo -e "${YELLOW}📦 Step 1/4: Building application...${NC}"
npm run build
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

# Step 2: Generate settings
echo -e "${YELLOW}⚙️  Step 2/4: Generating settings file...${NC}"
node scripts/generate-settings.js "$CDN_URL" "$SCREEN_NAME"
echo ""

SETTINGS_FILE="settings-${SCREEN_NAME}.json"

if [ ! -f "$SETTINGS_FILE" ]; then
  echo -e "${RED}❌ Error: Settings file not generated${NC}"
  exit 1
fi

# Step 3: Get Auth0 access token
echo -e "${YELLOW}🔑 Step 3/4: Getting Auth0 access token...${NC}"

TOKEN_RESPONSE=$(curl -s --request POST \
  --url "https://${AUTH0_DOMAIN}/oauth/token" \
  --header 'content-type: application/json' \
  --data "{\"client_id\":\"${AUTH0_CLIENT_ID}\",\"client_secret\":\"${AUTH0_CLIENT_SECRET}\",\"audience\":\"https://${AUTH0_DOMAIN}/api/v2/\",\"grant_type\":\"client_credentials\"}")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')

if [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}❌ Error: Failed to get access token${NC}"
  echo "Response: $TOKEN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Access token obtained${NC}"
echo ""

# Step 4: Deploy to Auth0
echo -e "${YELLOW}🚀 Step 4/4: Deploying to Auth0...${NC}"

DEPLOY_RESPONSE=$(curl -s --request PUT \
  --url "https://${AUTH0_DOMAIN}/api/v2/prompts/login/screen-partials/${SCREEN_NAME}" \
  --header "authorization: Bearer ${ACCESS_TOKEN}" \
  --header 'content-type: application/json' \
  --data @"${SETTINGS_FILE}")

# Check if deployment was successful
if echo "$DEPLOY_RESPONSE" | grep -q "error"; then
  echo -e "${RED}❌ Deployment failed${NC}"
  echo "Response: $DEPLOY_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Deployment Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📋 Summary:"
echo "  Screen:      $SCREEN_NAME"
echo "  CDN URL:     $CDN_URL"
echo "  Auth0:       $AUTH0_DOMAIN"
echo "  Settings:    $SETTINGS_FILE"
echo ""
echo "🧪 Test your screen:"
echo "  https://${AUTH0_DOMAIN}/authorize?connection=email&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_CALLBACK&response_type=code&scope=openid"
echo ""
