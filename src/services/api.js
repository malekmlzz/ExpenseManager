import axios from 'axios';

// آدرس بک‌اند - با IP کامپیوترت عوض کن
const API_BASE_URL = 'http://192.168.1.134:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getExpenses = () => api.get('/expenses');
export const addExpense = (data) => api.post('/expenses', data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export default api;
