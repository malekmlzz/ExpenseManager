import axios from 'axios';
import { API_CONFIG } from '../constants/config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
});

// Expense APIs
export const getExpenses = () => api.get('/expenses');
export const addExpense = (data) => api.post('/expenses', data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Claim APIs (طلب‌ها)
export const getClaims = () => api.get('/claims');
export const addClaim = (data) => api.post('/claims', data);
export const deleteClaim = (id) => api.delete(`/claims/${id}`);

// Debt APIs (بدهی‌ها)
export const getDebts = () => api.get('/debts');
export const addDebt = (data) => api.post('/debts', data);
export const deleteDebt = (id) => api.delete(`/debts/${id}`);

export default api;
