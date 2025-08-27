Page({
  goToNextPage: function () {
    wx.navigateTo({
      url: '/pages/select/select'
    });
  },

  onShareAppMessage: function () {
    return {
      title: '工作性价比对比器',
      path: '/pages/splash/splash',
      success: (res) => {
        wx.showToast({
          title: '分享成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        wx.showToast({
          title: '分享取消',
          icon: 'none'
        });
      }
    };
  }
});
