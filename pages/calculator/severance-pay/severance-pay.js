Page({
  data: {
    inputType: 'months', // 'months' or 'date'
    workMonths: '',
    startDate: null,
    endDate: null,
    monthlySalary: '',
    avgSalaryLastYear: '',
    result: null,
    compensationMonths: null,
    showDetail: false,
    showDetails: false,
    showCompensationDetails: false,
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

    // 计算经济赔偿金 - "2N"赔偿金
    // 对于违法解除劳动合同，赔偿金为经济补偿的二倍
    let compensationMonths = months;
    
    // 6个月以上不满一年的，按一年计算
    if (compensationMonths >= 6 && compensationMonths < 12) {
      compensationMonths = 12;
    }
    // 不满六个月的，按半年计算
    else if (compensationMonths < 6) {
      compensationMonths = 6;
    }
    
    // 计算公式：赔偿金额 = 月工资 × 工作年限 × 2
    const totalCompensation = compensationMonths * salary * 2;

    this.setData({
      result: totalCompensation.toFixed(2),
      compensationMonths: compensationMonths
    });

    wx.showToast({ title: '计算完成', icon: 'success' });
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

  toggleCompensationDetails: function() {
    this.setData({
      showCompensationDetails: !this.data.showCompensationDetails
    });
  },

  openLawLink: function(e) {
    wx.navigateTo({
      url: `/pages/core-laws-pack/core-laws-detail/core-laws-detail?id=47`
    });
  },
});
