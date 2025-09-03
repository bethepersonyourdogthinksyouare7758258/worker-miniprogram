Page({
  data: {
    // 简化的页面数据
  },

  onLoad() {
    // 页面加载时的处理
  },

  // 返回首页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});