// logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log
        }
      })
    });
  },

  onShareAppMessage: function () {
    return {
      title: '操作日志记录',
      path: '/pages/logs/logs',
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
})
