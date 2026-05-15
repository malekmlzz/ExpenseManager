import api from './api';

export const expenseService = {
  // دریافت همه هزینه‌ها
  getAll: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },
  
  // اضافه کردن هزینه جدید
  create: async (data) => {
    const response = await api.post('/expenses', data);
    return response.data;
  },
  
  // حذف هزینه
  delete: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
  
  // بروزرسانی هزینه
  update: async (id, data) => {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  },
  
  // دریافت مجموع هزینه‌ها
  getTotal: async () => {
    const expenses = await expenseService.getAll();
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  },
};
