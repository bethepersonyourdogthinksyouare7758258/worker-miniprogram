Page({
  data: {
    inputType: 'days', // 'days' or 'date'
    monthlySalary: null,
    totalWorkYears: null,
    currentWorkYears: null,
    sickDays: null,
    startDate: null,
    endDate: null,
    result: null,
    showNotice: false,
    showDetails: false,
  },


  switchInputType: function(e) {
    const inputType = e.currentTarget.dataset.type;
    this.setData({
      inputType: inputType,
    });
    if (inputType === 'date') {
      if (this.data.startDate && this.data.endDate) {
        this.calculateDaysFromDate();
      }
    } else {
      this.setData({
        sickDays: ''
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
        this.calculateDaysFromDate();
      }
    });
  },

  calculateDaysFromDate: function() {
    const start = new Date(this.data.startDate);
    const end = new Date(this.data.endDate);
    if (start >= end) {
      wx.showToast({ title: '结束日期需晚于起始日', icon: 'none' });
      this.setData({ sickDays: '' });
      return;
    }
    
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // 包含起始日和结束日
    
    this.setData({ sickDays: daysDiff.toString() });
  },

  // 获取医疗期（月）
  getMedicalPeriod: function(totalYears, currentYears) {
    if (totalYears < 10) {
      if (currentYears < 5) return 3;
      else return 6;
    } else {
      if (currentYears < 5) return 9;
      else if (currentYears < 10) return 12;
      else if (currentYears < 15) return 18;
      else if (currentYears < 20) return 24;
      else return 30;
    }
  },

  // 获取病假工资比例
  getSickPayRatio: function(sickDays, medicalPeriodMonths) {
    const medicalPeriodDays = medicalPeriodMonths * 30; // 简化计算，每月按30天
    
    if (sickDays <= medicalPeriodDays) {
      // 病假未超过医疗期
      return 0.8; // 80%
    } else {
      // 病假已超过医疗期
      return 0.6; // 60%
    }
  },

  calculate: function() {
    const { monthlySalary, totalWorkYears, currentWorkYears, sickDays } = this.data;

    if (!monthlySalary || !totalWorkYears || !currentWorkYears || !sickDays) {
      wx.showToast({ title: '请填写所有字段', icon: 'none' });
      return;
    }

    const salary = parseFloat(monthlySalary);
    const totalYears = parseFloat(totalWorkYears);
    const currentYears = parseFloat(currentWorkYears);
    const days = parseFloat(sickDays);

    if (isNaN(salary) || isNaN(totalYears) || isNaN(currentYears) || isNaN(days) || 
        salary <= 0 || totalYears < 0 || currentYears < 0 || days <= 0) {
      wx.showToast({ title: '请输入有效的数值', icon: 'none' });
      return;
    }

    // 第一步：确定医疗期
    const medicalPeriodMonths = this.getMedicalPeriod(totalYears, currentYears);
    
    // 第二步：确定病假工资比例
    const payRatio = this.getSickPayRatio(days, medicalPeriodMonths);
    
    // 第三步：计算病假工资总额
    const dailyWage = salary / 21.75;
    const totalSickPay = dailyWage * days * payRatio;

    this.setData({
      result: totalSickPay.toFixed(2)
    });

    wx.showToast({ title: '计算完成', icon: 'success' });
  },

  toggleNotice: function() {
    this.setData({
      showNotice: !this.data.showNotice
    });
  },

  toggleDetails: function() {
    this.setData({
      showDetails: !this.data.showDetails
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

  // 分享功能
  onShareAppMessage: function () {
    const { result } = this.data;
    const shareTitle = result ? `我用病假工资计算器算出了${result}元，快来试试吧！` : '病假工资计算器，快来计算你的病假工资！';
    
    return {
      title: shareTitle,
      path: '/pages/calculator/sick-pay/sick-pay',
      success: (res) => {
        console.log('分享成功', res);
        wx.showToast({
          title: '分享成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('分享失败', err);
        wx.showToast({
          title: '分享取消',
          icon: 'none'
        });
      }
    };
  },


 
})
