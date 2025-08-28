Page({
  data: {
    selectedDisabilityIndex: null,
    monthlySalary: null,
    socialAverageSalary: null,
    result: null,
    showNotice: false,
    showDetails: false,
    disabilityLevels: ['一级', '二级', '三级', '四级', '五级', '六级', '七级', '八级', '九级', '十级'],
    // 伤残等级对应的赔偿系数
    disabilityCoefficients: {
      0: { // 一级
        disabilityAllowance: 27, // 一次性伤残补助金（月平均工资）
        medicalAllowance: 0,     // 一次性工伤医疗补助金（社会平均工资）
        employmentAllowance: 0   // 一次性伤残就业补助金（社会平均工资）
      },
      1: { // 二级
        disabilityAllowance: 25,
        medicalAllowance: 0,
        employmentAllowance: 0
      },
      2: { // 三级
        disabilityAllowance: 23,
        medicalAllowance: 0,
        employmentAllowance: 0
      },
      3: { // 四级
        disabilityAllowance: 21,
        medicalAllowance: 0,
        employmentAllowance: 0
      },
      4: { // 五级
        disabilityAllowance: 18,
        medicalAllowance: 0,
        employmentAllowance: 0
      },
      5: { // 六级
        disabilityAllowance: 16,
        medicalAllowance: 0,
        employmentAllowance: 0
      },
      6: { // 七级
        disabilityAllowance: 13,
        medicalAllowance: 13,
        employmentAllowance: 13
      },
      7: { // 八级
        disabilityAllowance: 11,
        medicalAllowance: 11,
        employmentAllowance: 11
      },
      8: { // 九级
        disabilityAllowance: 9,
        medicalAllowance: 9,
        employmentAllowance: 9
      },
      9: { // 十级
        disabilityAllowance: 7,
        medicalAllowance: 7,
        employmentAllowance: 7
      }
    }
  },

  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  bindDisabilityChange: function(e) {
    this.setData({
      selectedDisabilityIndex: parseInt(e.detail.value)
    });
  },

  copySalaryText: function() {
    const salaryText = '[所在城市] xxxx年城镇非私营单位、城镇私营单位就业人员年平均工资';
    wx.setClipboardData({
      data: salaryText,
      success: () => {
        wx.showToast({ title: '复制成功', icon: 'success' });
      }
    });
  },

  calculate: function() {
    const { selectedDisabilityIndex, monthlySalary, socialAverageSalary } = this.data;

    if (selectedDisabilityIndex === null || !monthlySalary || !socialAverageSalary) {
      wx.showToast({ title: '请填写所有字段', icon: 'none' });
      return;
    }

    const salary = parseFloat(monthlySalary);
    const socialSalary = parseFloat(socialAverageSalary);

    if (isNaN(salary) || isNaN(socialSalary) || salary <= 0 || socialSalary <= 0) {
      wx.showToast({ title: '请输入有效的数值', icon: 'none' });
      return;
    }

    // 获取伤残等级对应的系数
    const coefficients = this.data.disabilityCoefficients[selectedDisabilityIndex];
    
    // 计算各项赔偿金
    const disabilityAllowance = salary * coefficients.disabilityAllowance; // 一次性伤残补助金
    const medicalAllowance = socialSalary * coefficients.medicalAllowance; // 一次性工伤医疗补助金
    const employmentAllowance = socialSalary * coefficients.employmentAllowance; // 一次性伤残就业补助金
    
    // 计算总赔偿金额
    const totalCompensation = disabilityAllowance + medicalAllowance + employmentAllowance;

    this.setData({
      result: totalCompensation.toFixed(2)
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
    const shareTitle = result ? `我用工伤赔偿计算器算出了${result}元，快来试试吧！` : '工伤赔偿计算器，快来计算你的赔偿金！';
    
    return {
      title: shareTitle,
      path: '/pages/calculator/injury-compensation/injury-compensation',
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
  }
})
