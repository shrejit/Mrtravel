// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Client
const API = {
    // Health check
    health: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            return { status: 'error', message: 'Backend unavailable' };
        }
    },

    // Hotel endpoints
    hotels: {
        getAll: async (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            const url = `${API_BASE_URL}/hotels${queryString ? '?' + queryString : ''}`;
            
            try {
                const response = await fetch(url);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching hotels:', error);
                throw error;
            }
        },

        getById: async (id) => {
            try {
                const response = await fetch(`${API_BASE_URL}/hotel/${id}`);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching hotel:', error);
                throw error;
            }
        }
    },

    // Tour packages
    getTourPackages: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tour-packages`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching tour packages:', error);
            throw error;
        }
    },

    // Countries
    getCountries: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/countries`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching countries:', error);
            throw error;
        }
    },

    // Cities
    getCities: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/cities`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching cities:', error);
            throw error;
        }
    },

    // User authentication
    auth: {
        register: async (userData) => {
            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                });
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Registration error:', error);
                throw error;
            }
        },

        login: async (credentials) => {
            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials)
                });
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        }
    },

    // Booking
    booking: {
        create: async (bookingData) => {
            try {
                const response = await fetch(`${API_BASE_URL}/book`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bookingData)
                });
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Booking error:', error);
                throw error;
            }
        },

        getAll: async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/bookings`);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching bookings:', error);
                throw error;
            }
        },

        getByCode: async (code) => {
            try {
                const response = await fetch(`${API_BASE_URL}/booking/${code}`);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching booking:', error);
                throw error;
            }
        },

        cancel: async (code) => {
            try {
                const response = await fetch(`${API_BASE_URL}/booking/${code}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error cancelling booking:', error);
                throw error;
            }
        }
    }
};

// Utility functions
const Utils = {
    // Format currency
    formatPrice: (price) => {
        return `₹${price.toLocaleString('en-IN')}`;
    },

    // Format date
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    },

    // Calculate nights between dates
    calculateNights: (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    },

    // Get URL parameters
    getUrlParams: () => {
        const params = new URLSearchParams(window.location.search);
        return Object.fromEntries(params.entries());
    },

    // Set URL parameters
    setUrlParams: (params) => {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            url.searchParams.set(key, params[key]);
        });
        window.history.pushState({}, '', url);
    },

    // Local storage helpers
    storage: {
        set: (key, value) => {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get: (key) => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        },
        remove: (key) => {
            localStorage.removeItem(key);
        },
        clear: () => {
            localStorage.clear();
        }
    }
};
