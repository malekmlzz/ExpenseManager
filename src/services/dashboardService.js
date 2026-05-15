import { incomeService } from './incomeService';
import { expenseService } from './expenseService';
import { claimService } from './claimService';
import { debtService } from './debtService';

// ذخیره هزینه‌های اولیه برای محاسبه Net Worth پایه
let baseExpenses = 0;
let isBaseSet = false;

export const dashboardService = {
  getFinancialSummary: async () => {
    const [monthly, fixed, expenses, claims, debts] = await Promise.all([
      incomeService.getByType('monthly'),
      incomeService.getByType('fixed'),
      expenseService.getAll(),
      claimService.getAll(),
      debtService.getAll(),
    ]);
    
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalClaims = claims.reduce((sum, c) => sum + c.amount, 0);
    const totalDebts = debts.reduce((sum, d) => sum + d.amount, 0);
    const totalIncome = monthly + fixed;
    
    // ثبت هزینه‌های اولیه (فقط یک بار)
    if (!isBaseSet && totalExpenses > 0) {
      baseExpenses = totalExpenses;
      isBaseSet = true;
    }
    
    // Net Worth = (درآمد کل + طلب‌ها) - بدهی‌ها - هزینه‌های اولیه
    // هزینه‌های جدید تأثیری ندارن، فقط هزینه‌هایی که موقع اولین بار لود شدن بودن
    const netWorth = (totalIncome + totalClaims) - (totalDebts + baseExpenses);
    
    return {
      monthly,
      fixed,
      totalIncome,
      totalExpenses,
      totalClaims,
      totalDebts,
      netWorth,
      recentExpenses: expenses.slice(-5).reverse(),
      recentClaims: claims.slice(-5).reverse(),
      recentDebts: debts.slice(-5).reverse(),
    };
  },
  
  saveIncome: async (type, amount) => {
    return await incomeService.saveByType(type, amount);
  },
  
  // ریست کردن هزینه پایه (برای مواقعی که نیاز باشه)
  resetBaseExpenses: () => {
    baseExpenses = 0;
    isBaseSet = false;
  },
};
