Page({
  data: {
    scenes: [
      {
        id: 'salary',
        title: '这个工资合理么？',
        description: '计算到手工资、个税和理想薪资',
        icon: '💰'
      },
      {
        id: 'overtime',
        title: '怎么计算我的加班费用',
        description: '不同工时制度下的加班费计算',
        icon: '🕒'
      },
      {
        id: 'social_insurance',
        title: '五险一金缴对了么',
        description: '社保、公积金基数与缴纳计算',
        icon: '📄'
      },
      {
        id: 'severance',
        title: '我离职了 钱给齐了么？',
        description: '经济补偿、赔偿与未休年假工资',
        icon: '🚪'
      }
    ],
    tools: [
      { name: '个人所得税计算器', path: '/pages/calculator/individual-income-tax/individual-income-tax', icon: '💰' },
      { name: '加班费计算器', path: '/pages/calculator/overtime-pay/overtime-pay', icon: '🕒' },
      { name: '未休年假补偿', path: '/pages/calculator/annual-leave-compensation/annual-leave-compensation', icon: '🌴' },
      { name: '双倍工资计算器', path: '/pages/calculator/double-salary/double-salary', icon: '✌️' },
      { name: '经济赔偿金', path: '/pages/calculator/severance-pay/severance-pay', icon: '📄' },
      { name: '经济补偿金计算器', path: '/pages/calculator/economic-bcj/economics-bcj', icon: '💸' },
      { name: '病假工资', path: '/pages/calculator/sick-pay/sick-pay', icon: '🤒' },
      { name: '社保公积金基数', path: '/pages/calculator/social-base/social-base', icon: '🏦' },
      { name: '工伤赔偿计算器', path: '/pages/calculator/injury-compensation/injury-compensation', icon: '🩹' },
      { name: '一次性工亡赔偿金', path: '/pages/calculator/death-compensation/death-compensation', icon: '🕊️' },
      { name: '税后工资计算器', path: '/pages/calculator/after-tax-salary/after-tax-salary', icon: '💳' },
      { name: '五险一金计算器', path: '/pages/calculator/social-insurance/social-insurance', icon: '🧾' },
      { name: '劳动仲裁/诉讼时效', path: '/pages/calculator/labor-arbitration/labor-arbitration', icon: '⏳' }
    ]
  },

  navigateToScene: function(e) {
    const sceneId = e.currentTarget.dataset.sceneId;
    wx.navigateTo({
      url: `/pages/calculator/scene/scene?id=${sceneId}`
    });
  },

  navigateToCalculator: function(e) {
    const path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: path,
      fail: () => {
        wx.showToast({
          title: '功能暂未开放',
          icon: 'none'
        });
      }
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
