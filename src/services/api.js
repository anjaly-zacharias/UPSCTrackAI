import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

export function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
}
