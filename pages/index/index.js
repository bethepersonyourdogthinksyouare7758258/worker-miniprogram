// index.js
Page({
  data: {
    
  },
  
  navigateToList(e) {
    const category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: `../list/list?category=${category}`
    });
  },

  // 分享功能
  onShareAppMessage: function () {
    return {
      title: '劳动法小助手 - 专业的劳动法计算工具，快来试试吧！',
      path: '/pages/index/index',
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
