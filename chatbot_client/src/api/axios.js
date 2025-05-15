import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';
const token = localStorage.getItem('access_token');

const urlApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
});

export default urlApi;
