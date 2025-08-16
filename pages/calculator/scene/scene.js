// pages/calculator/scene/scene.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const sceneId = options.id;
    if (sceneId) {
      this.loadSceneData(sceneId);
    } else {
      console.error("Scene ID is missing");
      // Optionally, navigate back or show an error message
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
    }
  },

  loadSceneData(sceneId) {
    // In a real project, you might have a more sophisticated data loading/mapping mechanism.
    // For this refactor, we'll use a simple mapping.
    const sceneDataMap = {
      'salary': require('../../../data/calculator-scenes/salary.js'),
      'overtime': require('../../../data/calculator-scenes/overtime.js'),
      'social_insurance': require('../../../data/calculator-scenes/social_insurance.js'),
      'severance': require('../../../data/calculator-scenes/severance.js')
    };

    const sceneData = sceneDataMap[sceneId];

    if (sceneData) {
      this.setData({
        scene: sceneData
      });
      wx.setNavigationBarTitle({
        title: sceneData.title
      });
    } else {
      console.error(`No data found for scene ID: ${sceneId}`);
      wx.showToast({
        title: '场景不存在',
        icon: 'error'
      });
    }
  },

  navigateToCalculator(event) {
    const path = event.currentTarget.dataset.path;
    if (path) {
      wx.navigateTo({
        url: path,
        fail: (err) => {
          console.error(`Failed to navigate to ${path}`, err);
          wx.showToast({
            title: '功能暂未开放',
            icon: 'none'
          });
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
