// src/api/auth.js
import axios from 'axios';

// Set the base URL for your backend API
const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const register = (formData) => API.post('/auth/register', formData);
export const login = (formData) => API.post('/auth/login', formData);