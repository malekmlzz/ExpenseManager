import api from './api';

export const claimService = {
  // دریافت همه طلب‌ها
  getAll: async () => {
    const response = await api.get('/claims');
    return response.data;
  },
  
  // اضافه کردن طلب جدید
  create: async (data) => {
    const response = await api.post('/claims', data);
    return response.data;
  },
  
  // حذف طلب
  delete: async (id) => {
    const response = await api.delete(`/claims/${id}`);
    return response.data;
  },
  
  // دریافت مجموع طلب‌ها
  getTotal: async () => {
    const claims = await claimService.getAll();
    return claims.reduce((sum, c) => sum + c.amount, 0);
  },
};
