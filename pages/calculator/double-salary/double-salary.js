Page({
  data: {
    startDate: null,
    endDate: null,
    monthlySalary: null,
    result: null,
    showDetail: false,
    showLawDetails: false,
  },

  bindDateChange: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  calculate: function() {
    const { startDate, endDate, monthlySalary } = this.data;

    if (!startDate || !endDate || !monthlySalary) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const salary = parseFloat(monthlySalary);

    if (isNaN(salary) || salary <= 0) {
      wx.showToast({
        title: '请输入有效的工资金额',
        icon: 'none'
      });
      return;
    }

    if (start >= end) {
      wx.showToast({
        title: '结束日期必须晚于起始日',
        icon: 'none'
      });
      return;
    }

    // 计算双倍工资的起始日期（用工满一个月的次日）
    let doublePayStart = new Date(start);
    doublePayStart.setMonth(doublePayStart.getMonth() + 1);

    if (end <= doublePayStart) {
      this.setData({ result: '0.00' });
      return;
    }
    
    // 计算双倍工资的法定最晚结束日期（用工满一年的当日）
    let maxEnd = new Date(start);
    maxEnd.setFullYear(maxEnd.getFullYear() + 1);

    // 实际的计算结束日期，不能超过法定最晚日期
    const actualEnd = end > maxEnd ? maxEnd : end;

    let months = (actualEnd.getFullYear() - doublePayStart.getFullYear()) * 12;
    months -= doublePayStart.getMonth();
    months += actualEnd.getMonth();
    
    let days = actualEnd.getDate() - doublePayStart.getDate();
    if (days < 0) {
        months--;
        const tempDate = new Date(actualEnd);
        tempDate.setDate(0); // Go to the last day of the previous month
        days += tempDate.getDate();
    }
    
    months = Math.max(0, months);
    
    // 法律规定最长不超过11个月
    if (months >= 11) {
        months = 11;
        days = 0;
    }

    const dailySalary = salary / 21.75;
    const compensation = (months * salary) + (days * dailySalary);

    this.setData({
      result: compensation.toFixed(2),
      showDetail: false
    });
  },

  copyResult: function() {
    if (this.data.result === null) {
      wx.showToast({
        title: '没有计算结果可复制',
        icon: 'none'
      });
      return;
    }
    wx.setClipboardData({
      data: this.data.result,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        });
      }
    });
  },

  toggleDetail: function() {
    this.setData({
      showDetail: !this.data.showDetail
    });
  },

  toggleLawDetails: function() {
    this.setData({
      showLawDetails: !this.data.showLawDetails
    });
  }
});
