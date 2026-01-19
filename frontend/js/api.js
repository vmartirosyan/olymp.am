/**
 * API Client for Olympiad Backend
 */

const API = {
    baseURL: 'http://localhost:8080/api',

    /**
     * Make a GET request to the API
     */
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Make a POST request to the API
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Check server health
     */
    async checkHealth() {
        return await this.get('/health');
    },

    /**
     * Get all problems
     */
    async getProblems() {
        return await this.get('/problems');
    },

    /**
     * Get all users
     */
    async getUsers() {
        return await this.get('/users');
    }
};
