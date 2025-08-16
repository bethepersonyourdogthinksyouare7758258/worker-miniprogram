// list.js
const phrasesData = require('../../../data/phrases.js');

Page({
  data: {
    phrases: [],
    expandedItems: {},
    pageTitle: ''
  },

  onLoad: function(options) {
    const category = options.category;
    let phrases = [];
    let pageTitle = '';
    
    switch(category) {
      case 'jobSeeking':
        phrases = phrasesData.jobSeeking;
        pageTitle = '🙋 求职阶段';
        wx.setNavigationBarTitle({
          title: '求职阶段话术'
        });
        break;
      case 'working':
        phrases = phrasesData.working;
        pageTitle = '💼 在职阶段';
        wx.setNavigationBarTitle({
          title: '在职阶段话术'
        });
        break;
      case 'resignation':
        phrases = phrasesData.resignation;
        pageTitle = '👋 离职阶段';
        wx.setNavigationBarTitle({
          title: '离职阶段话术'
        });
        break;
      default:
        phrases = [];
        pageTitle = '话术模板';
    }
    
    this.setData({
      phrases: phrases,
      pageTitle: pageTitle
    });
  },

  toggleExpand: function(e) {
    const id = e.currentTarget.dataset.id;
    const key = `expandedItems[${id}]`;
    
    this.setData({
      [key]: !this.data.expandedItems[id]
    });
  },

  copyText: function(e) {
    const text = e.currentTarget.dataset.text;
    
    wx.setClipboardData({
      data: text,
      success: function() {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function() {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});
