// pages/dataInput/dataInput.js
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
    console.log('DataInput page loaded');
  },

  // 处理输入框变化（工资、副业收入、生活成本）
  onInputChange: function (e) {
    const type = e.currentTarget.dataset.type;
    const value = parseFloat(e.detail.value) || 0;
    this.setData({
      [`salary.${type}`]: value
    });
  },

  // 处理滑块变化（评分）
  onWeightChange: function (e) {
    const type = e.currentTarget.dataset.type;
    const work = e.currentTarget.dataset.work; // offer 或 ideal
    const value = e.detail.value;
    this.setData({
      [`weights.${type}.${work}`]: value
    });
  },

  // 保存数据并跳转到 Result 页面
  goToResult: function () {
    // 构造存储数据，保持与 Result 页面兼容的结构
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

    // 存储数据
    wx.setStorageSync('dataInput', dataInput);

    // 跳转到 Result 页面
    wx.navigateTo({
      url: '/pages/result/result',
      success: function () {
        console.log('Navigation to Result successful');
      },
      fail: function (err) {
        console.error('Navigation to Result failed:', err);
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: '工作性价比数据输入',
      path: '/pages/dataInput/dataInput',
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
