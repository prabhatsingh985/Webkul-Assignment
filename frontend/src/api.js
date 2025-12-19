import axios from 'axios';

// Create a custom Axios instance
// This acts as our 'agent' for making all HTTP requests to the backend
const api = axios.create({
    // Set the base URL from .env variable (e.g., http://localhost:8000/api/)
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// REQUEST INTERCEPTOR
// This runs BEFORE every request leaves the browser
api.interceptors.request.use(
    (config) => {
        // Look for the 'access_token' in Local Storage
        const token = localStorage.getItem('access_token');
        if (token) {
            // If found, attach it to the headers: "Authorization: Bearer <token>"
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR
// This runs AFTER every response comes back from the server
api.interceptors.response.use(
    (response) => response, // If success, just return the response
    async (error) => {
        const originalRequest = error.config;
        
        // CHECK: If Error is 401 (Unauthorized) AND we haven't retried yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark as retried to prevent infinite loops
            
            // Get the 'refresh_token' (The long-lived key)
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    // Ask Backend for a NEW access token using the refresh token
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}token/refresh/`, {
                        refresh: refreshToken,
                    });
                    
                    // SAVE new token
                    localStorage.setItem('access_token', response.data.access);
                    
                    // UPDATE header
                    api.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
                    
                    // RETRY the original failed request with the new token
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    // If refresh failed (e.g., outdated), log out user
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            } else {
                // If no refresh token, force logout
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
