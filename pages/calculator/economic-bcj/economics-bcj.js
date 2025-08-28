Page({
  data: {
    inputType: 'months', // 'months' or 'date'
    workMonths: null,
    startDate: null,
    endDate: null,
    monthlySalary: null,
    result: null,
    showExplanation: false,
    showDetails: false,
  },

  switchInputType: function(e) {
    const inputType = e.currentTarget.dataset.type;
    this.setData({
      inputType: inputType,
    });
    if (inputType === 'date') {
      if (this.data.startDate && this.data.endDate) {
        this.calculateMonthsFromDate();
      }
    } else {
      this.setData({
        workMonths: ''
      });
    }
  },

  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  bindDateChange: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    }, () => {
      if (this.data.startDate && this.data.endDate) {
        this.calculateMonthsFromDate();
      }
    });
  },

  calculateMonthsFromDate: function() {
    const start = new Date(this.data.startDate);
    const end = new Date(this.data.endDate);
    if (start >= end) {
      wx.showToast({ title: '结束日期需晚于起始日', icon: 'none' });
      this.setData({ workMonths: '' });
      return;
    }
    
    let yearDiff = end.getFullYear() - start.getFullYear();
    let monthDiff = end.getMonth() - start.getMonth();
    let dayDiff = end.getDate() - start.getDate();

    let totalMonths = yearDiff * 12 + monthDiff;
    if (dayDiff < 0) {
      totalMonths--;
    }
    
    this.setData({ workMonths: totalMonths.toString() });
  },

  toggleExplanation: function() {
    this.setData({
      showExplanation: !this.data.showExplanation
    });
  },

  calculate: function() {
    const { workMonths, monthlySalary } = this.data;

    if (!workMonths || !monthlySalary) {
      wx.showToast({ title: '请填写所有字段', icon: 'none' });
      return;
    }

    const months = parseFloat(workMonths);
    const salary = parseFloat(monthlySalary);

    if (isNaN(months) || isNaN(salary) || months <= 0 || salary <= 0) {
      wx.showToast({ title: '请输入有效的数值', icon: 'none' });
      return;
    }

    // Per law: over 6 months is 1 year, under 6 is 0.5 year
    let years = Math.floor(months / 12);
    let remainingMonths = months % 12;
    let compensationYears = 0;
    if (remainingMonths > 6) {
      compensationYears = years + 1;
    } else if (remainingMonths > 0) {
      compensationYears = years + 0.5;
    } else {
      compensationYears = years;
    }
    
    const totalCompensation = compensationYears * salary;

    this.setData({
      result: totalCompensation.toFixed(2)
    });
  },

  copyResult: function() {
    if (this.data.result === null) {
      wx.showToast({ title: '没有计算结果可复制', icon: 'none' });
      return;
    }
    wx.setClipboardData({
      data: this.data.result,
      success: () => {
        wx.showToast({ title: '复制成功', icon: 'success' });
      }
    });
  },

  toggleDetails: function() {
    this.setData({
      showDetails: !this.data.showDetails
    });
  },
});
