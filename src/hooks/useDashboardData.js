import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { dashboardService } from '../services/dashboardService';

export const useDashboardData = () => {
  const [data, setData] = useState({
    loading: true,
    refreshing: false,
    monthly: 0,
    fixed: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalClaims: 0,
    totalDebts: 0,
    netWorth: 0,
    recentExpenses: [],
    recentClaims: [],
    recentDebts: [],
  });
  
  const [formState, setFormState] = useState({
    showMonthly: false,
    showFixed: false,
    tempAmount: '',
  });

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setData(prev => ({ ...prev, loading: true }));
    }
    
    try {
      const summary = await dashboardService.getFinancialSummary();
      setData({
        ...summary,
        loading: false,
        refreshing: false,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setData(prev => ({ ...prev, loading: false, refreshing: false }));
    }
  }, []);

  // هر بار که صفحه فوکوس میشه، دیتا رو از سرور بگیر
  useFocusEffect(
    useCallback(() => {
      loadData(true);
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setData(prev => ({ ...prev, refreshing: true }));
    loadData(false);
  }, [loadData]);

  const handleSaveIncome = useCallback(async (type) => {
    const amount = parseFloat(formState.tempAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter valid amount');
      return false;
    }
    
    try {
      await dashboardService.saveIncome(type, amount);
      setFormState(prev => ({
        ...prev,
        tempAmount: '',
        showMonthly: false,
        showFixed: false,
      }));
      // بعد از ذخیره، دیتا رو دوباره بگیر
      await loadData(false);
      return true;
    } catch (error) {
      alert('Failed to save income');
      return false;
    }
  }, [formState.tempAmount, loadData]);

  const toggleForm = useCallback((formName) => {
    setFormState(prev => ({
      ...prev,
      [formName]: !prev[formName],
      tempAmount: '',
    }));
  }, []);

  const setTempAmount = useCallback((value) => {
    setFormState(prev => ({ ...prev, tempAmount: value }));
  }, []);

  return {
    data,
    formState,
    handlers: {
      onRefresh,
      handleSaveIncome,
      toggleForm,
      setTempAmount,
    },
  };
};
