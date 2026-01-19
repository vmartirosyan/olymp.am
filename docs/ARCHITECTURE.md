# Project Architecture

## Overview
Olymp.am is a full-stack web application for managing online olympiads for Armenian schools.

## Architecture

### Backend (C++)
- **Language**: C++17
- **Build System**: CMake
- **HTTP Server**: Custom implementation using POSIX sockets
- **API Style**: RESTful JSON

#### Components
- `main.cpp` - Application entry point, signal handling
- `server.cpp` - HTTP server implementation, socket handling, request routing
- `api_handler.cpp` - Business logic for API endpoints
- `server.h` - Server class interface
- `api_handler.h` - API handler interface

#### Current API Endpoints
- `GET /api/health` - Server health check
- `GET /api/problems` - Retrieve list of problems
- `GET /api/users` - Retrieve list of users

### Frontend (Vanilla JavaScript)
- **Language**: JavaScript ES6+
- **Styling**: CSS3 (Grid, Flexbox)
- **Architecture**: Single Page Application (SPA)

#### Components
- `index.html` - Main HTML structure
- `api.js` - API client for backend communication
- `ui.js` - UI components and page rendering
- `app.js` - Application controller and navigation
- `styles.css` - Responsive styling

#### Pages
1. Home - Landing page with navigation cards
2. Problems - Browse olympiad problems with difficulty levels
3. Users - View registered users and their schools
4. About - System information and technology stack

## Development Workflow

### Building the Backend
```bash
cd backend
./build.sh
```

### Running the Backend
```bash
cd backend
./run.sh
# Or manually:
./build/olympiad_server [port]  # Default port: 8080
```

### Running the Frontend
```bash
cd frontend
./run.sh [port]  # Default port: 3000
```

## Future Enhancements

### Backend
- Add database integration (PostgreSQL/MySQL)
- Implement authentication and authorization
- Add POST/PUT/DELETE endpoints
- Implement proper request body parsing
- Add logging framework
- Unit testing with Google Test

### Frontend
- Add user authentication UI
- Implement problem submission and testing
- Add real-time updates with WebSockets
- Implement leaderboard functionality
- Add internationalization (Armenian/English)
- Unit testing with Jest or similar

### Infrastructure
- Add Docker support
- Implement CI/CD pipeline
- Add production deployment configuration
- Implement proper error handling and logging
- Add API documentation (Swagger/OpenAPI)

## Security Considerations

- Currently no authentication/authorization
- CORS is wide open (allows all origins)
- No input validation or sanitization
- No rate limiting
- No HTTPS support

**Note**: These should be addressed before production deployment.
