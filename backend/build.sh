#!/bin/bash

# Build script for the C++ backend

echo "Building Olympiad Backend..."

# Create build directory if it doesn't exist
if [ ! -d "build" ]; then
    mkdir build
fi

cd build

# Run CMake
echo "Running CMake..."
cmake ..

# Build
echo "Building..."
make

echo "Build complete! Run ./olympiad_server to start the server."
