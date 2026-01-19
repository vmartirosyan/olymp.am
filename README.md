# olymp.am

Online olympiad management system for Armenian schools.

## Overview

This is a full-stack web application consisting of:
- **Backend**: C++ REST API server
- **Frontend**: Vanilla JavaScript single-page application

## Quick Start

### 1. Start the Backend

```bash
cd backend
mkdir build && cd build
cmake ..
make
./olympiad_server
```

The backend will start on port 8080.

### 2. Start the Frontend

In a new terminal:
```bash
cd frontend
python3 -m http.server 3000
```

Then open http://localhost:3000 in your browser.

## Project Structure

```
olymp.am/
├── backend/              # C++ API server
│   ├── src/              # Source files
│   ├── include/          # Header files
│   ├── CMakeLists.txt    # Build configuration
│   └── README.md         # Backend documentation
├── frontend/             # Vanilla JS frontend
│   ├── index.html        # Main HTML file
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   └── README.md         # Frontend documentation
├── docs/                 # Additional documentation
└── README.md             # This file
```

## Features

- RESTful API backend written in C++
- Responsive single-page application frontend
- Problem browsing and management
- User management
- Real-time server status monitoring
- No external dependencies for core functionality

## Technology Stack

### Backend
- C++17
- CMake build system
- Native socket-based HTTP server
- JSON API responses

### Frontend
- HTML5
- CSS3 (Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Fetch API for AJAX requests

## Development

See individual README files in `backend/` and `frontend/` directories for detailed development instructions.

## API Endpoints

- `GET /api/health` - Server health check
- `GET /api/problems` - List all problems
- `GET /api/users` - List all users

## Contributing

This is an educational project for Armenian schools. Contributions are welcome!

## License

MIT License
