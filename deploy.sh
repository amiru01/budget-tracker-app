#!/bin/bash

# Smart Finance Deployment Script
# This script builds and deploys your app to Firebase Hosting

echo "🚀 Starting Smart Finance Deployment..."
echo ""

# Step 1: Clean previous build
echo "📦 Cleaning previous build..."
rm -rf dist
echo "✅ Clean complete"
echo ""

# Step 2: Install dependencies (if needed)
if [ ! -d "node_modules" ]; then
  echo "📥 Installing dependencies..."
  npm install
  echo "✅ Dependencies installed"
  echo ""
fi

# Step 3: Build the app
echo "🔨 Building app..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed! Please fix errors and try again."
  exit 1
fi

echo "✅ Build complete"
echo ""

# Step 4: Deploy to Firebase
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -ne 0 ]; then
  echo "❌ Deployment failed! Please check Firebase CLI is installed and you're logged in."
  echo ""
  echo "Run these commands:"
  echo "  npm install -g firebase-tools"
  echo "  firebase login"
  exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app is live at:"
echo "   https://budget-tracker-2cd8c.web.app"
echo ""
echo "🎉 Done!"
