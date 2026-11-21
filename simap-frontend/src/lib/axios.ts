import axios from 'axios';

export const api = axios.create({
  baseURL: '/api', // Panggil proxy internal Next.js
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});