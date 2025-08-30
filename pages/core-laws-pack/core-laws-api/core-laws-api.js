// API版核心法条页面（带本地数据降级）
const { DualModeManager } = require('../../../data/core-laws/dual-mode-manager.js');

Page({
  data: {
    searchText: '',
    currentMode: 'knowledge', // 'knowledge' 或 'scenarios'
    selectedStage: 'all', // 'all', '入职阶段', '在职阶段', '离职阶段'
    filteredData: [], // 当前显示的数据
    expandedItems: {}, // 记录展开状态的对象 {itemId: true/false}
    stats: null, // 统计信息
    stages: [], // 阶段列表
    loading: false, // 加载状态
    apiBaseUrl: 'http://localhost:8000', // API基础地址
    useLocalFallback: false, // 是否使用本地降级
    dualModeManager: null, // 双模式管理器实例（降级用）
    
    // 服务器切换相关
    availableServers: [
      {
        id: 'local',
        name: '本地服务器',
        url: 'http://localhost:8000',
        status: 'unknown' // unknown, online, offline
      },
      {
        id: 'remote',
        name: '远程服务器',
        url: 'http://49.235.84.195:8001',
        status: 'unknown'
      }
    ],
    currentServerId: 'local',
    currentServer: {}, // 当前服务器信息
    serverPickerIndex: 0, // picker选中的索引
    serverPickerRange: [], // picker显示的选项
    serverCheckInProgress: false // 服务器检测中
  },

  onLoad() {
    console.log('API版核心法条页面加载');
    
    // 初始化降级数据管理器
    this.data.dualModeManager = new DualModeManager();
    
    // 初始化当前服务器信息
    this.updateCurrentServer();
    
    // 加载保存的服务器配置
    this.loadServerConfig();
    
    // 检测服务器状态
    this.checkAllServersStatus();
    
    // 尝试加载API数据，如果失败则使用本地数据
    this.initializeData();
  },

  // 更新当前服务器信息
  updateCurrentServer() {
    const currentServer = this.data.availableServers.find(s => s.id === this.data.currentServerId) || this.data.availableServers[0];
    const serverPickerRange = this.data.availableServers.map(server => `${server.name} (${server.status === 'online' ? '在线' : server.status === 'offline' ? '离线' : '检测中'})`);
    const serverPickerIndex = this.data.availableServers.findIndex(s => s.id === this.data.currentServerId);
    
    this.setData({
      currentServer: currentServer,
      serverPickerRange: serverPickerRange,
      serverPickerIndex: Math.max(0, serverPickerIndex)
    });
  },

  // 加载服务器配置
  loadServerConfig() {
    try {
      const savedServerId = wx.getStorageSync('selectedServerId');
      if (savedServerId) {
        this.switchToServer(savedServerId, false); // false = 不保存到存储，因为已经是从存储加载的
        console.log('📡 加载保存的服务器配置:', savedServerId);
      }
    } catch (error) {
      console.warn('加载服务器配置失败:', error);
    }
  },

  // 保存服务器配置
  saveServerConfig(serverId) {
    try {
      wx.setStorageSync('selectedServerId', serverId);
      console.log('💾 保存服务器配置:', serverId);
    } catch (error) {
      console.error('保存服务器配置失败:', error);
    }
  },

  // 检测所有服务器状态
  async checkAllServersStatus() {
    this.setData({ serverCheckInProgress: true });
    
    const servers = [...this.data.availableServers];
    
    // 并发检测所有服务器
    const checkPromises = servers.map(async (server, index) => {
      try {
        const response = await this.checkServerHealth(server.url);
        servers[index].status = response ? 'online' : 'offline';
        console.log(`🔍 服务器 ${server.name} (${server.url}):`, servers[index].status);
      } catch (error) {
        servers[index].status = 'offline';
        console.log(`🔍 服务器 ${server.name} (${server.url}): offline (${error.message})`);
      }
    });
    
    await Promise.all(checkPromises);
    
    this.setData({ 
      availableServers: servers,
      serverCheckInProgress: false 
    });
    
    // 更新当前服务器状态
    this.updateCurrentServer();
  },

  // 检测单个服务器健康状态
  checkServerHealth(baseUrl) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${baseUrl}/health`,
        method: 'GET',
        timeout: 3000, // 3秒超时
        success: (res) => {
          resolve(res.statusCode === 200);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  // 切换服务器
  switchToServer(serverId, shouldSave = true) {
    const server = this.data.availableServers.find(s => s.id === serverId);
    if (!server) {
      console.error('服务器不存在:', serverId);
      return;
    }

    console.log(`🔄 切换到服务器: ${server.name} (${server.url})`);
    
    this.setData({
      currentServerId: serverId,
      apiBaseUrl: server.url,
      useLocalFallback: false // 重置降级状态
    });

    // 更新当前服务器显示
    this.updateCurrentServer();

    if (shouldSave) {
      this.saveServerConfig(serverId);
    }

    // 显示切换提示
    wx.showToast({
      title: `切换到${server.name}`,
      icon: 'none',
      duration: 1500
    });

    // 重新加载数据
    this.initializeData();
  },

  // Picker选择服务器
  onServerPickerChange(e) {
    const pickerIndex = parseInt(e.detail.value);
    const selectedServer = this.data.availableServers[pickerIndex];
    
    if (selectedServer && selectedServer.id !== this.data.currentServerId) {
      console.log('Picker选择服务器:', selectedServer.name);
      this.switchToServer(selectedServer.id);
    }
  },

  // 初始化数据（优先API，降级本地）
  async initializeData() {
    try {
      await this.loadStages();
      await this.loadData();
      await this.loadStats();
      console.log('✅ 成功使用API数据');
    } catch (error) {
      console.warn('❌ API不可用，启用本地数据降级:', error);
      this.enableLocalFallback();
    }
  },

  // 启用本地数据降级
  enableLocalFallback() {
    console.log('🔄 启用本地数据降级模式');
    this.setData({
      useLocalFallback: true,
      stages: ['入职阶段', '在职阶段', '离职阶段']
    });
    
    wx.showToast({
      title: '使用离线数据',
      icon: 'none',
      duration: 2000
    });
    
    this.loadLocalData();
    this.loadLocalStats();
  },

  // API请求封装
  apiRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.data.apiBaseUrl}${url}`,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.data?.detail || 'Unknown error'}`));
          }
        },
        fail: (err) => {
          console.error('API请求失败:', err);
          reject(err);
        }
      });
    });
  },

  // 加载阶段列表
  async loadStages() {
    try {
      const stages = await this.apiRequest('/api/stages');
      console.log('阶段列表:', stages);
      this.setData({ stages });
    } catch (error) {
      console.error('加载阶段列表失败:', error);
      throw error; // 抛出错误以触发降级
    }
  },

  // 加载统计信息
  async loadStats() {
    try {
      const stats = await this.apiRequest('/api/stats');
      console.log('统计信息:', stats);
      this.setData({ stats });
    } catch (error) {
      console.error('加载统计信息失败:', error);
      if (!this.data.useLocalFallback) {
        throw error;
      }
    }
  },

  // 加载本地统计信息（降级方案）
  loadLocalStats() {
    try {
      if (!this.data.dualModeManager) return;
      
      const stats = this.data.dualModeManager.getCurrentModeStats();
      console.log('本地统计信息:', stats);
      this.setData({ stats });
    } catch (error) {
      console.error('加载本地统计信息失败:', error);
    }
  },

  // 加载数据（API优先，本地降级）
  async loadData() {
    try {
      this.setData({ loading: true });
      
      if (this.data.useLocalFallback) {
        this.loadLocalData();
        return;
      }

      const { selectedStage, searchText } = this.data;
      let data = [];

      // 如果有搜索词，使用搜索接口
      if (searchText && searchText.trim()) {
        data = await this.searchLaws(searchText.trim());
        // 如果有阶段筛选，进一步过滤
        if (selectedStage !== 'all') {
          data = data.filter(item => item.stage === selectedStage);
        }
      } else {
        // 根据阶段获取数据
        const params = {};
        if (selectedStage !== 'all') {
          params.stage = selectedStage;
        }
        
        const queryString = Object.keys(params).length > 0 ? 
          '?' + Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&') : '';
        
        data = await this.apiRequest(`/api/laws${queryString}`);
      }

      // 数据格式转换
      const processedData = data.map(item => this.transformDataFormat(item));

      // 处理展开状态
      const dataWithExpandState = processedData.map(item => ({
        ...item,
        expanded: this.data.expandedItems[item.id] || false
      }));
      
      console.log(`✅ API加载数据成功: ${dataWithExpandState.length} 条`);
      this.setData({
        filteredData: dataWithExpandState,
        loading: false
      });

    } catch (error) {
      console.error('API加载数据失败，尝试本地降级:', error);
      
      if (!this.data.useLocalFallback) {
        this.enableLocalFallback();
      } else {
        this.setData({ 
          filteredData: [],
          loading: false
        });
      }
    }
  },

  // 加载本地数据（降级方案）
  loadLocalData() {
    try {
      let data = [];
      const { selectedStage, searchText, dualModeManager } = this.data;
      
      if (!dualModeManager) {
        console.error('双模式管理器未初始化');
        this.setData({ filteredData: [], loading: false });
        return;
      }
      
      // 根据选择的分类获取当前模式下的数据
      if (selectedStage === 'all') {
        data = dualModeManager.getCurrentModeData();
      } else {
        // 映射阶段名称
        const stageMap = {
          '入职阶段': '入职阶段',
          '在职阶段': '在职阶段', 
          '离职阶段': '离职阶段'
        };
        const stageName = stageMap[selectedStage];
        data = dualModeManager.getCurrentModeDataByStage(stageName);
      }
      
      // 如果有搜索关键词，进行搜索过滤
      if (searchText && searchText.trim()) {
        data = dualModeManager.searchCurrentModeData(searchText.trim());
        // 如果有分类筛选，还需要进一步过滤
        if (selectedStage !== 'all') {
          data = data.filter(item => item.stage === selectedStage);
        }
      }
      
      // 处理展开状态
      const processedData = data.map(item => ({
        ...item,
        expanded: this.data.expandedItems[item.id] || false
      }));
      
      console.log(`📱 本地加载数据成功: ${processedData.length} 条`);
      this.setData({
        filteredData: processedData,
        loading: false
      });
      
    } catch (error) {
      console.error('加载本地数据失败:', error);
      this.setData({
        filteredData: [],
        loading: false
      });
    }
  },

  // 搜索法条
  async searchLaws(keyword) {
    try {
      const results = await this.apiRequest(`/api/laws/search?q=${encodeURIComponent(keyword)}`);
      console.log('搜索结果:', results.length, '条');
      return results;
    } catch (error) {
      console.error('搜索失败:', error);
      throw error;
    }
  },

  // 数据格式转换 - 后端格式转前端格式
  transformDataFormat(backendData) {
    return {
      id: backendData.id.toString(),
      type: 'knowledge', // 目前只处理法条知识
      stage: backendData.stage,
      category: this.mapStageToCategory(backendData.stage),
      tag: backendData.tag,
      legalTag: this.extractLegalTag(backendData.legal_basis),
      title: backendData.title,
      summary: backendData.summary,
      legalBasis: backendData.legal_basis,
      toolLink: backendData.tool_link !== '无' ? backendData.tool_link : null,
      provider: backendData.provider,
      reviewer: backendData.reviewer,
      // 搜索文本
      searchText: `${backendData.title} ${backendData.tag} ${backendData.summary} ${backendData.legal_basis}`.toLowerCase()
    };
  },

  // 阶段映射：中文阶段名 -> 英文category
  mapStageToCategory(stage) {
    const stageMap = {
      '入职阶段': 'onboarding',
      '在职阶段': 'working', 
      '离职阶段': 'departure'
    };
    return stageMap[stage] || 'working';
  },

  // 从法条依据中提取法律标签
  extractLegalTag(legalBasis) {
    if (!legalBasis) return '';
    
    const matches = legalBasis.match(/《([^》]+)》/);
    return matches ? matches[1] : '';
  },

  // 模式切换 (暂时保留，但目前只支持knowledge模式)
  onModeChange(e) {
    const mode = e.currentTarget.dataset.mode;
    console.log('模式切换:', mode);
    
    if (mode !== 'knowledge') {
      wx.showToast({
        title: '场景模式开发中',
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      currentMode: mode,
      selectedStage: 'all',
      expandedItems: {},
      searchText: ''
    });
    
    this.loadData();
  },

  // 阶段切换
  onCategoryChange(e) {
    const category = e.currentTarget.dataset.category;
    console.log('阶段切换:', category);
    
    // 将前端category映射回后端stage
    let stage = 'all';
    if (category !== 'all') {
      const categoryMap = {
        'onboarding': '入职阶段',
        'working': '在职阶段',
        'departure': '离职阶段'
      };
      stage = categoryMap[category] || 'all';
    }
    
    this.setData({
      selectedCategory: category,
      selectedStage: stage,
      expandedItems: {}
    });
    
    this.loadData();
  },

  // 搜索输入
  onSearchInput(e) {
    const searchText = e.detail.value;
    this.setData({ searchText });
    
    // 防抖处理
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadData();
    }, 500);
  },

  // 搜索按钮
  onSearch() {
    console.log('执行搜索:', this.data.searchText);
    this.loadData();
  },

  // 清除搜索
  onClearSearch() {
    this.setData({ searchText: '' });
    this.loadData();
  },

  // 条目点击处理
  onItemTap(e) {
    const item = e.currentTarget.dataset.item;
    const itemId = item.id;
    
    console.log('条目点击:', item.title, 'type:', item.type);
    
    // 法条知识展开/收缩
    if (item.type === 'knowledge') {
      const expandedItems = { ...this.data.expandedItems };
      const newExpandState = !expandedItems[itemId];
      expandedItems[itemId] = newExpandState;
      
      // 直接更新当前数据的展开状态，避免重新加载导致页面跳转
      const updatedData = this.data.filteredData.map(dataItem => {
        if (dataItem.id === itemId) {
          return { ...dataItem, expanded: newExpandState };
        }
        return dataItem;
      });
      
      this.setData({ 
        expandedItems,
        filteredData: updatedData
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
    
    if (item.provider) {
      content += `\n\n内容提供者：${item.provider}`;
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

  // 页面分享
  onShareAppMessage() {
    const dataSource = this.data.useLocalFallback ? '本地数据' : 'API数据';
    return {
      title: `劳动法速查 - 31条核心法条(${dataSource})`,
      path: '/pages/core-laws-pack/core-laws-api/core-laws-api',
      success: (res) => {
        console.log('分享成功', res);
      },
      fail: (err) => {
        console.error('分享失败', err);
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
