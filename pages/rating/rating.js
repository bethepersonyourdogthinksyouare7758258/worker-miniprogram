// pages/rating/rating.js
Page({
  data: {
    weights: {
      potentialDevelopment: 5,
      reproduction: 5,
      socialValue: 5,
      socialRecognition: 5,
      resume: 5,
      workComfort: 5,
      jobStability: 5,
      jobEase: 5,
      flexibility: 5
    }
  },

  onLoad: function () {
    console.log('Rating page loaded');
  },

  // 滑块变化事件
  onWeightChange: function (e) {
    const key = e.currentTarget.dataset.type; // 使用 data-type 而不是 data-key，与 WXML 一致
    const value = e.detail.value;
    this.setData({
      [`weights.${key}`]: value
    });
    console.log('Weights updated:', this.data.weights);
  },

  // 保存权重并跳转到 DataInput 页面
  goToDataInput: function () {
    console.log('Saving weights:', this.data.weights);
    wx.setStorageSync('ratingWeights', this.data.weights);
    console.log('Attempting to navigate to DataInput page');
    wx.navigateTo({
      url: '/pages/dataInput/dataInput',
      success: function () {
        console.log('Navigation to DataInput page successful');
      },
      fail: function (err) {
        console.error('Navigation to DataInput page failed:', err);
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: '工作权重评分',
      path: '/pages/rating/rating',
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
