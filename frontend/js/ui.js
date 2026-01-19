/**
 * UI Component Manager
 */

const UI = {
    /**
     * Render the home page
     */
    renderHome() {
        return `
            <div class="page-content">
                <h2>Welcome to Olymp.am</h2>
                <p>This is an online olympiad management system for Armenian schools.</p>
                
                <div class="card-grid">
                    <div class="card">
                        <h3>📚 Problems</h3>
                        <p>Browse and solve olympiad problems</p>
                        <button onclick="App.navigateTo('problems')">View Problems</button>
                    </div>
                    
                    <div class="card">
                        <h3>👥 Users</h3>
                        <p>View registered students and teachers</p>
                        <button onclick="App.navigateTo('users')">View Users</button>
                    </div>
                    
                    <div class="card">
                        <h3>ℹ️ About</h3>
                        <p>Learn more about this system</p>
                        <button onclick="App.navigateTo('about')">Learn More</button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render the problems page
     */
    async renderProblems() {
        try {
            const data = await API.getProblems();
            const problems = data.problems || [];
            
            let html = `
                <div class="page-content">
                    <h2>Problems</h2>
                    <div class="problems-list">
            `;
            
            problems.forEach(problem => {
                html += `
                    <div class="problem-item">
                        <h3>${problem.title}</h3>
                        <span class="difficulty difficulty-${problem.difficulty}">${problem.difficulty}</span>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
            
            return html;
        } catch (error) {
            return `<div class="error">Failed to load problems: ${error.message}</div>`;
        }
    },

    /**
     * Render the users page
     */
    async renderUsers() {
        try {
            const data = await API.getUsers();
            const users = data.users || [];
            
            let html = `
                <div class="page-content">
                    <h2>Users</h2>
                    <div class="users-list">
            `;
            
            users.forEach(user => {
                html += `
                    <div class="user-item">
                        <h3>${user.name}</h3>
                        <p>School: ${user.school}</p>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
            
            return html;
        } catch (error) {
            return `<div class="error">Failed to load users: ${error.message}</div>`;
        }
    },

    /**
     * Render the about page
     */
    renderAbout() {
        return `
            <div class="page-content">
                <h2>About Olymp.am</h2>
                <p>Olymp.am is an online olympiad management system designed for Armenian schools.</p>
                
                <h3>Features</h3>
                <ul>
                    <li>Problem management and browsing</li>
                    <li>User registration and profiles</li>
                    <li>Competition tracking</li>
                    <li>Real-time leaderboards</li>
                </ul>
                
                <h3>Technology Stack</h3>
                <ul>
                    <li><strong>Backend:</strong> C++ with custom HTTP server</li>
                    <li><strong>Frontend:</strong> Vanilla JavaScript (no frameworks)</li>
                    <li><strong>API:</strong> RESTful JSON API</li>
                </ul>
            </div>
        `;
    }
};
