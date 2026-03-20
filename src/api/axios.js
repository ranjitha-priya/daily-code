import axios from 'axios';

const API = axios.create({
    baseURL: 'https://mern-backend-6qll.onrender.com/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('dcc_user') || 'null');
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default API;
