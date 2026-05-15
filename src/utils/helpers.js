// فرمت کردن اعداد با جداکننده هزارگان
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount);
};

// فرمت کردن تاریخ
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fa-IR');
};

// دریافت تاریخ امروز به فرمت YYYY-MM-DD
export const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

// اعتبارسنجی ایمیل
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// اعتبارسنجی مبلغ
export const isValidAmount = (amount) => {
  return amount && !isNaN(amount) && parseFloat(amount) > 0;
};
