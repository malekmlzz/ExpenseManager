import api from './api';

export const incomeService = {
  // دریافت درآمد بر اساس نوع
  getByType: async (type) => {
    try {
      const response = await api.get(`/incomes/${type}`);
      return response.data.amount;
    } catch (error) {
      if (error.response?.status === 404) return 0;
      throw error;
    }
  },
  
  // ذخیره یا بروزرسانی درآمد
  saveByType: async (type, amount) => {
    const response = await api.post('/incomes', {
      amount,
      type,
      description: `${type} income`,
      date: new Date().toISOString().split('T')[0],
    });
    return response.data;
  },
};
