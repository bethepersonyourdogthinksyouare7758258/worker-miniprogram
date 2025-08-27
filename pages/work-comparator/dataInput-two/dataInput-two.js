// pages/dataInput-two/dataInput-two.js
Page({
  data: {
    salary: {
      offerSalary: 0,
      idealSalary: 0,
      offerSideIncome: 0,
      idealSideIncome: 0,
      offerCost: 0,
      idealCost: 0
    },
    weights: {
      potentialDevelopment: { offer: 5, ideal: 5 },
      reproduction: { offer: 5, ideal: 5 },
      socialValue: { offer: 5, ideal: 5 },
      socialRecognition: { offer: 5, ideal: 5 },
      resume: { offer: 5, ideal: 5 },
      workComfort: { offer: 5, ideal: 5 },
      jobStability: { offer: 5, ideal: 5 },
      jobEase: { offer: 5, ideal: 5 },
      flexibility: { offer: 5, ideal: 5 }
    }
  },

  onLoad: function () {
    console.log('DataInput-two page loaded');
  },

  onInputChange: function (e) {
    const type = e.currentTarget.dataset.type;
    const value = parseFloat(e.detail.value) || 0;
    this.setData({
      [`salary.${type}`]: value
    });
  },

  onWeightChange: function (e) {
    const type = e.currentTarget.dataset.type;
    const work = e.currentTarget.dataset.work;
    const value = e.detail.value;
    this.setData({
      [`weights.${type}.${work}`]: value
    });
  },

  goToResult: function () {
    const dataInput = {
      salary: this.data.salary,
      offerFactors: {
        potentialDevelopment: this.data.weights.potentialDevelopment.offer,
        reproduction: this.data.weights.reproduction.offer,
        socialValue: this.data.weights.socialValue.offer,
        socialRecognition: this.data.weights.socialRecognition.offer,
        resume: this.data.weights.resume.offer,
        workComfort: this.data.weights.workComfort.offer,
        jobStability: this.data.weights.jobStability.offer,
        jobEase: this.data.weights.jobEase.offer,
        flexibility: this.data.weights.flexibility.offer
      },
      idealFactors: {
        potentialDevelopment: this.data.weights.potentialDevelopment.ideal,
        reproduction: this.data.weights.reproduction.ideal,
        socialValue: this.data.weights.socialValue.ideal,
        socialRecognition: this.data.weights.socialRecognition.ideal,
        resume: this.data.weights.resume.ideal,
        workComfort: this.data.weights.workComfort.ideal,
        jobStability: this.data.weights.jobStability.ideal,
        jobEase: this.data.weights.jobEase.ideal,
        flexibility: this.data.weights.flexibility.ideal
      }
    };

    wx.setStorageSync('dataInput', dataInput);

    wx.navigateTo({
      url: '/pages/result-two/result-two',
      success: function () {
        console.log('Navigation to Result-two successful');
      },
      fail: function (err) {
        console.error('Navigation to Result-two failed:', err);
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: '两份工作数据输入',
      path: '/pages/dataInput-two/dataInput-two',
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
