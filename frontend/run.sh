#!/bin/bash

# Start script for the frontend

cd "$(dirname "$0")"

PORT=${1:-3000}

echo "Starting Olympiad Frontend on port $PORT..."
echo "Open http://localhost:$PORT in your browser"
echo ""

# Try to use Python 3 if available
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m http.server $PORT
else
    echo "Error: Python not found. Please install Python or use another web server."
    exit 1
fi
