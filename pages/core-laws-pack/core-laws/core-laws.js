// 导入双模式管理器
const { DualModeManager } = require('../../../data/core-laws/dual-mode-manager.js');

Page({
  data: {
    searchText: '',
    currentMode: 'knowledge', // 'knowledge' 或 'scenarios'
    selectedCategory: 'all', // 'all', 'onboarding', 'working', 'departure'
    filteredData: [], // 当前显示的数据
    expandedItems: {}, // 记录展开状态的对象 {itemId: true/false}
    stats: null, // 统计信息
    dualModeManager: null // 双模式管理器实例
  },

  onLoad() {
    console.log('核心法条页面加载');
    // 初始化双模式管理器
    this.data.dualModeManager = new DualModeManager();
    this.loadData();
    this.loadStats();
  },

  // 加载数据
  loadData() {
    try {
      let data = [];
      const { currentMode, selectedCategory, searchText, dualModeManager } = this.data;
      
      if (!dualModeManager) {
        console.error('双模式管理器未初始化');
        return;
      }
      
      // 根据选择的分类获取当前模式下的数据
      if (selectedCategory === 'all') {
        data = dualModeManager.getCurrentModeData();
      } else {
        // 映射分类名称 - 根据当前模式使用不同的映射
        if (currentMode === 'knowledge') {
          // 知识模式使用中文阶段名
          const stageMap = {
            'onboarding': '入职阶段',
            'working': '在职阶段', 
            'departure': '离职阶段'
          };
          const stageName = stageMap[selectedCategory];
          data = dualModeManager.getCurrentModeDataByStage(stageName);
        } else {
          // 场景模式使用英文阶段名
          data = dualModeManager.getCurrentModeDataByStage(selectedCategory);
        }
      }
      
      console.log(`加载${currentMode}模式-${selectedCategory}分类数据:`, data.length, '条');
      
      // 如果有搜索关键词，进行搜索过滤
      if (searchText && searchText.trim()) {
        data = dualModeManager.searchCurrentModeData(searchText.trim());
        // 如果有分类筛选，还需要进一步过滤
        if (selectedCategory !== 'all') {
          const stageMap = {
            'onboarding': '入职阶段',
            'working': '在职阶段',
            'departure': '离职阶段'
          };
          const stageName = stageMap[selectedCategory];
          data = data.filter(item => {
            if (currentMode === 'knowledge') {
              return item.stage === stageName;
            } else {
              return item.category === selectedCategory;
            }
          });
        }
      }
      
      // 处理展开状态
      const processedData = data.map(item => ({
        ...item,
        expanded: this.data.expandedItems[item.id] || false
      }));
      
      this.setData({
        filteredData: processedData
      });
      
    } catch (error) {
      console.error('加载数据失败:', error);
      this.setData({
        filteredData: []
      });
    }
  },

  // 模式切换 - 新增方法
  onModeChange(e) {
    const mode = e.currentTarget.dataset.mode;
    console.log('模式切换:', mode);
    
    if (!this.data.dualModeManager) {
      console.error('双模式管理器未初始化');
      return;
    }
    
    // 切换模式
    this.data.dualModeManager.switchMode(mode);
    
    this.setData({
      currentMode: mode,
      selectedCategory: 'all', // 切换模式时重置分类
      expandedItems: {}, // 清空展开状态
      searchText: '' // 清空搜索
    });
    
    this.loadData();
    this.loadStats();
  },

  // 分类切换 - 更新方法名
  onCategoryChange(e) {
    const category = e.currentTarget.dataset.category;
    console.log('分类切换:', category);
    
    this.setData({
      selectedCategory: category,
      expandedItems: {} // 清空展开状态
    });
    
    this.loadData();
  },

  // 加载统计信息
  loadStats() {
    try {
      if (!this.data.dualModeManager) {
        console.error('双模式管理器未初始化');
        return;
      }
      
      const stats = this.data.dualModeManager.getCurrentModeStats();
      console.log('当前模式统计信息:', stats);
      this.setData({ stats });
    } catch (error) {
      console.error('加载统计信息失败:', error);
    }
  },

  // 搜索输入
  onSearchInput(e) {
    const searchText = e.detail.value;
    this.setData({
      searchText: searchText
    });
    
    // 实时搜索
    this.loadData();
  },

  // 搜索按钮
  onSearch() {
    console.log('执行搜索:', this.data.searchText);
    this.loadData();
  },

  // 清除搜索
  onClearSearch() {
    this.setData({
      searchText: ''
    });
    this.loadData();
  },

  // 条目点击处理
  onItemTap(e) {
    const item = e.currentTarget.dataset.item;
    const itemId = item.id;
    
    console.log('条目点击:', item.title, 'type:', item.type);
    
    // 如果是知识类型，切换展开状态
    if (item.type === 'knowledge') {
      const expandedItems = { ...this.data.expandedItems };
      expandedItems[itemId] = !expandedItems[itemId];
      
      this.setData({
        expandedItems: expandedItems
      });
      
      // 重新加载数据以更新展开状态
      this.loadData();
    } 
    // 如果是场景类型，导航到详情页
    else if (item.type === 'scenario') {
      wx.navigateTo({
        url: `/pages/core-laws-pack/core-laws-detail/core-laws-detail?id=${itemId}&type=scenario`
      });
    }
  },

  // 复制法条依据
  onCopyLegalBasis(e) {
    const item = e.currentTarget.dataset.item;
    const content = item.legalBasis || '';
    
    if (!content) {
      wx.showToast({
        title: '暂无法条依据',
        icon: 'none'
      });
      return;
    }
    
    this.copyToClipboard(content);
  },

  // 复制完整内容
  onCopyAll(e) {
    const item = e.currentTarget.dataset.item;
    let content = `${item.title}\n\n`;
    
    if (item.summary) {
      content += `简明结论：\n${item.summary}\n\n`;
    }
    
    if (item.legalBasis) {
      content += `法条依据：\n${item.legalBasis}`;
    }
    
    this.copyToClipboard(content);
  },

  // 复制到剪贴板
  copyToClipboard(content) {
    wx.setClipboardData({
      data: content,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: (err) => {
        console.error('复制失败:', err);
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
      }
    });
  },

  // 工具链接点击
  onToolLinkTap(e) {
    const toolLink = e.currentTarget.dataset.toolLink;
    if (!toolLink || toolLink === '无' || toolLink === '') {
      wx.showToast({
        title: '暂无相关工具',
        icon: 'none'
      });
      return;
    }
    
    console.log('工具链接点击:', toolLink);
    wx.showToast({
      title: `跳转到${toolLink}`,
      icon: 'none'
    });
  },

  // 页面分享
  onShareAppMessage() {
    const { currentMode } = this.data;
    const modeText = currentMode === 'knowledge' ? '31条核心法条' : '18种权益场景';
    
    return {
      title: `劳动法速查 - ${modeText}`,
      path: '/pages/core-laws-pack/core-laws/core-laws',
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
          title: '分享失败',
          icon: 'none'
        });
      }
    };
  },

  // 页面分享到朋友圈
  onShareTimeline() {
    return {
      title: '劳动法条速查 - 保障您的合法权益',
      query: '',
      success: (res) => {
        console.log('分享朋友圈成功', res);
      },
      fail: (err) => {
        console.error('分享朋友圈失败', err);
      }
    };
  },

  // 页面显示时刷新数据
  onShow() {
    this.loadData();
  },

  // 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新');
    this.loadData();
    this.loadStats();
    wx.stopPullDownRefresh();
  }
});
