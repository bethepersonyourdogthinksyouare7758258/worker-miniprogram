Page({
  data: {
    calculators: [
      { name: '个人所得税计算器', url: '/pages/calculator/individual-income-tax/individual-income-tax', icon: '💰' },
      { name: '加班费计算器', url: '/pages/calculator/overtime-pay/overtime-pay', icon: '🕒' },
      { name: '未休年假补偿', url: '/pages/calculator/annual-leave-compensation/annual-leave-compensation', icon: '🌴' },
      { name: '双倍工资计算器', url: '/pages/calculator/double-salary/double-salary', icon: '✌️' },
      { name: '经济赔偿金', url: '/pages/calculator/severance-pay/severance-pay', icon: '📄' },
      { name: '经济补偿金计算器', url: '/pages/calculator/economic-bcj/economics-bcj', icon: '💸' },
      { name: '病假工资', url: '/pages/calculator/sick-pay/sick-pay', icon: '🤒' },
      { name: '社保公积金基数', url: '/pages/calculator/social-base/social-base', icon: '🏦' },
      { name: '工伤赔偿计算器', url: '/pages/calculator/injury-compensation/injury-compensation', icon: '🩹' },
      { name: '一次性工亡赔偿金', url: '/pages/calculator/death-compensation/death-compensation', icon: '🕊️' },
      { name: '税后工资计算器', url: '/pages/calculator/after-tax-salary/after-tax-salary', icon: '💳' },
      { name: '五险一金计算器', url: '/pages/calculator/social-insurance/social-insurance', icon: '🧾' },
      { name: '劳动仲裁/诉讼时效', url: '/pages/calculator/labor-arbitration/labor-arbitration', icon: '⏳' }
    ]
  },

  navigateToCalculator: function(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },

  // 跳转到说明文档页面


  // 预览图片


  // 分享功能
  onShareAppMessage: function () {
    return {
      title: '劳动法计算器大全 - 10个专业计算工具，快来试试吧！',
      path: '/index',
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
