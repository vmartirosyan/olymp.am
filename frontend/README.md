# Frontend

Vanilla JavaScript frontend for the Olympiad Management System.

## Overview

This is a single-page application (SPA) built with pure vanilla JavaScript, HTML, and CSS. No frameworks or build tools required.

## Structure

```
frontend/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Application styles
├── js/
│   ├── api.js          # API client for backend communication
│   ├── ui.js           # UI components and rendering
│   └── app.js          # Main application controller
└── assets/             # Static assets (images, etc.)
```

## Running

### Option 1: Using Python's built-in server
```bash
cd frontend
python3 -m http.server 3000
```
Then open http://localhost:3000 in your browser.

### Option 2: Using Node.js http-server
```bash
cd frontend
npx http-server -p 3000
```
Then open http://localhost:3000 in your browser.

### Option 3: Open directly in browser
Simply open `index.html` in your web browser. Note that API calls may be blocked by CORS unless you're serving the files through a web server.

## Features

- **Home Page**: Overview and navigation cards
- **Problems Page**: Browse olympiad problems with difficulty levels
- **Users Page**: View registered users and their schools
- **About Page**: Information about the system
- **Server Status**: Real-time backend server status indicator

## Configuration

The API base URL is configured in `js/api.js`:
```javascript
baseURL: 'http://localhost:8080/api'
```

Change this if your backend runs on a different host or port.

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript (async/await, arrow functions, etc.)
- Fetch API
- CSS Grid and Flexbox
