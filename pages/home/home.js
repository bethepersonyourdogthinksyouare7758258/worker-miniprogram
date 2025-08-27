Page({
  data: {},
  navigateToOfferComparer: function() {
    wx.navigateTo({

      url: '/pages/work-comparator/splash/splash'
    })
  },
  navigateToCalculator: function() {
    wx.navigateTo({
      url: '/pages/calculator/index'
    })
  },
  navigateToTextPack: function() {
    wx.navigateTo({

      url: '/pages/text-library/textpack/textpack'
    })
  },
  navigateToDocGen: function() {
    wx.navigateTo({
      url: '/pages/docgen/docgen-list/docgen-list'
    })
  },
  navigateToCityCompare: function() {
    wx.navigateTo({
      url: '/pages/city-compare/city-compare'
    });
  },
  navigateToCoreLaws: function() {
    wx.navigateTo({
      url: '/pages/core-laws-pack/core-laws/core-laws'
    });
  },
  navigateToBackgroundCheckGuide: function() {
    wx.navigateTo({
      url: '/pages/background-check-guide/background-check-guide'
    });
  },
  navigateToContact: function() {
    wx.navigateTo({
      url: '/pages/contact/contact'
    });
  },

  // 分享功能
  onShareAppMessage: function () {
    return {
      title: '劳动法小助手 - 工作性价比对比、计算器、文档生成等实用工具！',
      path: '/pages/home/home',
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