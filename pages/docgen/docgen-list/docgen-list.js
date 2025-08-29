// pages/docgen/docgen-list.js
Page({
  data: {
    documentTypes: [
      {
        type: 'arbitration',
        title: '劳动仲裁申请书',
        desc: '工资拖欠、违法解除等争议',
        icon: '⚖️'
      },
      {
        type: 'resignation', 
        title: '被迫离职通知书',
        desc: '公司违法行为迫使离职',
        icon: '📋'
      },
      {
        type: 'complaint',
        title: '劳动监察投诉书',
        desc: '举报公司违法行为',
        icon: '📄'
      }
    ]
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '文书生成器'
    });
  },

  // 处理文书类型点击事件
  handleDocumentTypeClick(e) {
    const type = e.currentTarget.dataset.type;
    if (type) {
      // 每个文书类型都有独立的页面
      switch(type) {
        case 'complaint':
          wx.navigateTo({
            url: `../complaint-letter/complaint-letter`
          });
          break;
        case 'resignation':
          wx.navigateTo({
            url: `../resignation-notice/resignation-notice`
          });
          break;
        case 'arbitration':
          wx.navigateTo({
            url: `../arbitration-request/arbitration-request`
          });
          break;
        default:
          console.warn('Unknown document type:', type);
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
