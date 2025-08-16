// list.js
const phrasesData = require('../../data/phrases.js');

Page({
  data: {
    category: '',
    phrases: [],
    filteredPhrases: [],
    expandedItems: {},
    searchKeyword: '',
    categoryTitles: {
      jobSeeking: '求职阶段',
      working: '在职阶段', 
      resignation: '离职阶段'
    }
  },

  onLoad(options) {
    const category = options.category || 'jobSeeking';
    const phrases = phrasesData[category] || [];
    
    this.setData({
      category: category,
      phrases: phrases,
      filteredPhrases: phrases
    });
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: this.data.categoryTitles[category] || '话术列表'
    });
  },

  toggleExpand(e) {
    const id = e.currentTarget.dataset.id;
    const key = `expandedItems.${id}`;
    
    this.setData({
      [key]: !this.data.expandedItems[id]
    });
  },

  onSearch(e) {
    const keyword = e.detail.value.toLowerCase();
    const filteredPhrases = this.data.phrases.filter(phrase => {
      return phrase.title.toLowerCase().includes(keyword) ||
             phrase.templates.some(template => 
               template.content.toLowerCase().includes(keyword)
             ) ||
             (phrase.tips && phrase.tips.toLowerCase().includes(keyword));
    });

    this.setData({
      searchKeyword: keyword,
      filteredPhrases: filteredPhrases
    });
  },

  copyText(e) {
    const text = e.currentTarget.dataset.text;
    
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success',
          duration: 2000
        });
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'error',
          duration: 2000
        });
      }
    });
  }
});
