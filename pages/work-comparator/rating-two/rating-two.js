// pages/rating-two/rating-two.js
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
    console.log('Rating-two page loaded');
  },

  onWeightChange: function (e) {
    const key = e.currentTarget.dataset.type;
    const value = e.detail.value;
    this.setData({
      [`weights.${key}`]: value
    });
    console.log('Weights updated:', this.data.weights);
  },

  goToDataInput: function () {
    console.log('Saving weights:', this.data.weights);
    wx.setStorageSync('ratingWeights', this.data.weights);
    console.log('Attempting to navigate to DataInput-two page');
    wx.navigateTo({
      url: '/pages/dataInput-two/dataInput-two',
      success: function () {
        console.log('Navigation to DataInput-two page successful');
      },
      fail: function (err) {
        console.error('Navigation to DataInput-two page failed:', err);
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: '两份工作权重评分',
      path: '/pages/rating-two/rating-two',
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
