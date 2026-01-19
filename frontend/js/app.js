/**
 * Main Application Controller
 */

const App = {
    currentPage: 'home',

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing Olymp.am application...');
        
        // Setup navigation
        this.setupNavigation();
        
        // Check server status
        await this.checkServerStatus();
        
        // Load home page
        await this.navigateTo('home');
    },

    /**
     * Setup navigation event listeners
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
    },

    /**
     * Navigate to a specific page
     */
    async navigateTo(page) {
        console.log(`Navigating to: ${page}`);
        this.currentPage = page;

        // Update active nav link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });

        // Render page content
        const contentDiv = document.getElementById('app-content');
        contentDiv.innerHTML = '<div class="loading">Loading...</div>';

        try {
            let content;
            switch (page) {
                case 'problems':
                    content = await UI.renderProblems();
                    break;
                case 'users':
                    content = await UI.renderUsers();
                    break;
                case 'about':
                    content = UI.renderAbout();
                    break;
                default:
                    content = UI.renderHome();
            }
            contentDiv.innerHTML = content;
        } catch (error) {
            contentDiv.innerHTML = `<div class="error">Error loading page: ${error.message}</div>`;
        }
    },

    /**
     * Check if the backend server is running
     */
    async checkServerStatus() {
        const statusElement = document.getElementById('server-status');
        try {
            const health = await API.checkHealth();
            if (health.status === 'ok') {
                statusElement.textContent = '✓ Online';
                statusElement.className = 'status-online';
            } else {
                statusElement.textContent = '⚠ Warning';
                statusElement.className = 'status-warning';
            }
        } catch (error) {
            statusElement.textContent = '✗ Offline';
            statusElement.className = 'status-offline';
            console.error('Server is not responding:', error);
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
