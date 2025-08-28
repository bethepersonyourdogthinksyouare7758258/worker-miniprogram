Page({
  data: {
    basicSalary: null,
    unusedLeaveDays: null,
    result: null,
    showDetail: false,
    showLegalBasis: false,
    detailProcess: '',
    calculationBasis: '根据《中华人民共和国劳动法》及《职工带薪年休假条例》，未休年假应按照日工资收入的300%支付补偿，其中包含正常工资，额外支付200%。',
    accrualBasis: '"根据《职工带薪年休假条例》，职工的年假可以累积至下一个年度。如果公司因自身原因未能安排员工在第二年休完累积的年假，则必须支付补偿。"'
  },

  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  calculate: function() {
    const { basicSalary, unusedLeaveDays } = this.data;
    
    if (basicSalary === null || unusedLeaveDays === null) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
      return;
    }
    
    const basicSalaryVal = parseFloat(basicSalary) || 0;
    const unusedLeaveDaysVal = parseFloat(unusedLeaveDays) || 0;
    
    if (basicSalaryVal <= 0 || unusedLeaveDaysVal <= 0) {
      wx.showToast({
        title: '请输入有效的数值',
        icon: 'none'
      });
      return;
    }
    
    // 计算日工资（法定月计薪天数为21.75天）
    const dailySalary = basicSalaryVal / 21.75;
    
    // 计算未休年假补偿（按照日工资的300%计算，其中包含原本的100%工资，所以额外补偿200%）
    const compensation = dailySalary * unusedLeaveDaysVal * 2;
    
    // 生成详细计算过程
    const detailProcess = `计算公式：未休年假补偿 = 日平均工资 × 未休年假天数 × 200%
其中：日平均工资 = 月平均工资 ÷ 21.75

输入数据：
• 基本工资：${basicSalaryVal.toFixed(2)} 元/月
• 未休年假天数：${unusedLeaveDaysVal} 天

计算过程：
第一步：计算日工资
日工资 = ${basicSalaryVal.toFixed(2)} ÷ 21.75
       = ${dailySalary.toFixed(2)} 元/天

第二步：计算未休年假补偿
根据《劳动法》规定，未休年假补偿按照日工资的200%支付
未休年假补偿 = ${dailySalary.toFixed(2)} × ${unusedLeaveDaysVal} × 200%
            = ${dailySalary.toFixed(2)} × ${unusedLeaveDaysVal} × 2
            = ${compensation.toFixed(2)} 元

最终结果：${compensation.toFixed(2)} 元`;

    this.setData({
      result: compensation.toFixed(2),
      detailProcess: detailProcess,
      showDetail: false
    });
  },

  toggleDetail: function() {
    this.setData({
      showDetail: !this.data.showDetail
    });
  },

  toggleLegalBasis: function() {
    this.setData({
      showLegalBasis: !this.data.showLegalBasis
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
      success: function() {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        });
      },
      fail: function() {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
      }
    });
  },

  // 分享功能
  onShareAppMessage: function () {
    const { result } = this.data;
    const shareTitle = result ? `我用未休年假补偿计算器算出了${result}元，快来试试吧！` : '未休年假补偿计算器，快来计算你的年假补偿！';
    
    return {
      title: shareTitle,
      path: '/annual-leave-compensation/annual-leave-compensation',
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
