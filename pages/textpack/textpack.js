// textpack.js - HR沟通话术库主页
Page({
  data: {
    
  },
  
  navigateToList(e) {
    const category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: `./list/list?category=${category}`
    });
  },

  // 分享功能
  onShareAppMessage: function () {
    return {
      title: 'HR沟通话术库 - 专业的职场沟通模板，快来试试吧！',
      path: '/pages/textpack/textpack',
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
