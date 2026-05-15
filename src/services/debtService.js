import api from './api';

export const debtService = {
  getAll: async () => {
    const response = await api.get('/debts');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/debts', data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/debts/${id}`);
    return response.data;
  },
};
