#!/bin/bash

echo "🔧 Fixing Frontend Setup..."
echo ""

cd /home/enock/Revision_Assistant_platform/frontend

# Install vite globally for this session
echo "Installing vite..."
npm install -g vite@5.4.21

# Or run with npx
echo ""
echo "Starting frontend..."
echo "Please run: npx vite --host 0.0.0.0 --port 3000"
echo ""
echo "Or install vite globally:"
echo "npm install -g vite"
echo ""
echo "Then run: vite --host 0.0.0.0 --port 3000"
