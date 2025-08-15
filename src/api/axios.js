import axios from 'axios';

// Yahan apna base URL daalein
// const BASE_URL = 'http://16.171.47.239/api';
   const BASE_URL = 'http://16.171.47.239/api'

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, 
});

// Request Interceptor
instance.interceptors.request.use(
    (config) => {
        // Yahan token ya headers add kar sakte hain
        // Example: config.headers.Authorization = `Bearer ${token}`;
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Error handling yahan karein
        // Example: if (error.response.status === 401) { ... }
        return Promise.reject(error);
    }
);

export default instance;