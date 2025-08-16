Page({
  data: {
    searchText: '',
    selectedCategory: 'all',
    categoryFilters: [
      {id: 'all', name: '全部'},
      {id: 'onboarding', name: '入职阶段'},
      {id: 'working', name: '工作期间'},
      {id: 'departure', name: '离职阶段'}
    ],
    allCategories: [
      {id: 'illegal-probation', title: '试用期被违法对待怎么办？', category: 'onboarding', keywords: '试用期 赔偿 违法'},
      {id: 'double-salary', title: '公司不签劳动合同，能要求双倍工资吗？', category: 'onboarding', keywords: '合同 二倍工资 不签'},
      {id: 'indefinite-contract', title: '如何签订无固定期限劳动合同？', category: 'working', keywords: '无固定期限 合同 二倍工资'},
      {id: 'unpaid-wages', title: '工资被拖欠了，我该怎么办？', category: 'working', keywords: '拖欠 工资 维权'},
      {id: 'unpaid-overtime', title: '加班费没给，如何追讨？', category: 'working', keywords: '加班费 拖欠 维权'},
      {id: 'unused-leave', title: '年假没休完，能要求补偿吗？', category: 'working', keywords: '年假 年休假 补偿'},
      {id: 'severance-pay', title: '离职时，我能获得经济补偿吗？', category: 'departure', keywords: '离职 经济补偿 N'},
      {id: 'notice-pay', title: '公司辞退我，有代通知金吗？', category: 'departure', keywords: '代通知金 +1 提前'},
      {id: 'illegal-dismissal', title: '被公司违法解雇，如何维权？', category: 'departure', keywords: '违法解雇 赔偿金 2N'},
      {id: 'deposit-refund', title: '入职押金或财物，如何要回？', category: 'departure', keywords: '押金 财物 返还'},
      {id: 'no-termination-proof', title: '公司不给离职证明，怎么办？', category: 'departure', keywords: '离职证明 不给'},
      {id: 'non-compete', title: '竞业限制协议，我能获得补偿吗？', category: 'departure', keywords: '竞业限制 补偿'}
    ],
    filteredCategories: []
  },

  onLoad() {
    this.setData({
      filteredCategories: this.data.allCategories
    })
  },

  // 搜索功能
  onSearchInput(e) {
    const searchText = e.detail.value.toLowerCase()
    this.setData({
      searchText: searchText
    })
    this.filterCategories()
  },

  onSearch() {
    this.filterCategories()
  },

  // 分类筛选
  onCategoryFilter(e) {
    const categoryId = e.currentTarget.dataset.category
    this.setData({
      selectedCategory: categoryId
    })
    this.filterCategories()
  },

  // 筛选逻辑
  filterCategories() {
    let filtered = this.data.allCategories
    
    // 按分类筛选
    if (this.data.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.data.selectedCategory)
    }
    
    // 按搜索词筛选
    if (this.data.searchText) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(this.data.searchText) ||
        item.keywords.toLowerCase().includes(this.data.searchText)
      )
    }
    
    this.setData({
      filteredCategories: filtered
    })
  },

  navigateToDetail(e) {
    const type = e.currentTarget.dataset.type
    console.log('跳转参数:', type)
    wx.navigateTo({
      url: `/pages/core-laws-detail/core-laws-detail?type=${type}`,
      success: (res) => {
        console.log('跳转成功', res)
      },
      fail: (err) => {
        console.error('跳转失败', err)
      }
    })
  },

  // 分享功能
  onShareAppMessage: function () {
    return {
      title: '劳动权益保障 - 常见法律问题分类',
      path: '/pages/core-laws/core-laws',
      success: (res) => {
        console.log('分享成功', res);
        wx.showToast({
          title: '分享成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('分享失败', err);
        wx.showToast({
          title: '分享取消',
          icon: 'none'
        });
      }
    };
  }
})
