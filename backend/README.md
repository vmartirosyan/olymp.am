# Backend API

C++ backend API server for the Olympiad Management System.

## Prerequisites

- C++ compiler with C++17 support (g++ or clang++)
- CMake 3.10 or higher
- POSIX-compliant system (Linux, macOS, or WSL on Windows)

## Building

```bash
mkdir build
cd build
cmake ..
make
```

## Running

Start the server (default port 8080):
```bash
./olympiad_server
```

Start the server on a custom port:
```bash
./olympiad_server 3000
```

## API Endpoints

### Health Check
- **GET** `/api/health`
- Response: `{"status":"ok","message":"Server is running"}`

### Get Problems
- **GET** `/api/problems`
- Response: List of olympiad problems with id, title, and difficulty

### Get Users
- **GET** `/api/users`
- Response: List of users with id, name, and school

## Architecture

- `main.cpp` - Entry point and server initialization
- `server.cpp` - HTTP server implementation with socket handling
- `api_handler.cpp` - Request routing and endpoint handlers
- `server.h` - Server class definition
- `api_handler.h` - API handler class definition

## CORS

The server includes CORS headers to allow cross-origin requests from the frontend.
