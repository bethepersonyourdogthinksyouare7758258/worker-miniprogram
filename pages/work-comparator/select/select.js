// pages/select/select.js
Page({
  goToOfferComparison: function () {
    wx.navigateTo({
      url: '/pages/rating/rating?comparisonType=offer_vs_ideal',
      success: function () {
        console.log('Navigated to rating page');
      },
      fail: function (err) {
        console.error('Navigation to rating failed:', err);
      }
    });
  },

  goToTwoOfferComparison: function () {
    wx.navigateTo({
      url: '/pages/rating-two/rating-two?comparisonType=two_offers',
      success: function () {
        console.log('Navigated to rating-two page');
      },
      fail: function (err) {
        console.error('Navigation to rating-two failed:', err);
        wx.showToast({
          title: '跳转失败，请检查配置',
          icon: 'none'
        });
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: '工作比较选择',
      path: '/pages/select/select',
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
