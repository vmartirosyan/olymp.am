#!/bin/bash

# Start script for the C++ backend

cd "$(dirname "$0")"

# Check if the server binary exists
if [ ! -f "build/olympiad_server" ]; then
    echo "Server binary not found. Building..."
    ./build.sh
fi

# Start the server
echo "Starting Olympiad Backend Server on port 8080..."
./build/olympiad_server
