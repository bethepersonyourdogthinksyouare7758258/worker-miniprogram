// 维权场景详情页
const { rightsScenarios } = require('../../../data/core-laws/rights-scenarios.js');

Page({
  data: {
    scenarioId: '',
    scenario: null,
    loading: true,
    error: false,
    errorMessage: ''
  },

  onLoad(options) {
    console.log('维权场景详情页加载', options);
    
    const scenarioId = options.id;
    if (!scenarioId) {
      this.showError('场景ID不能为空');
      return;
    }

    this.setData({
      scenarioId: scenarioId
    });

    this.loadScenarioDetail();
  },

  // 加载场景详情
  loadScenarioDetail() {
    try {
      const scenario = this.getScenarioById(this.data.scenarioId);
      
      if (!scenario) {
        this.showError('未找到对应的维权场景');
        return;
      }

      console.log('加载场景详情:', scenario);
      
      this.setData({
        scenario: scenario,
        loading: false,
        error: false
      });

      // 设置页面标题
      wx.setNavigationBarTitle({
        title: scenario.title.length > 10 ? scenario.title.substring(0, 10) + '...' : scenario.title
      });

    } catch (error) {
      console.error('加载场景详情失败:', error);
      this.showError('加载场景详情失败');
    }
  },

  // 根据ID获取场景详情
  getScenarioById(scenarioId) {
    let scenario = null;
    
    // 在所有分类中查找
    Object.keys(rightsScenarios).forEach(category => {
      if (Array.isArray(rightsScenarios[category])) {
        const found = rightsScenarios[category].find(item => item.id === scenarioId);
        if (found) {
          scenario = found;
        }
      }
    });

    return scenario;
  },

  // 显示错误
  showError(message) {
    this.setData({
      loading: false,
      error: true,
      errorMessage: message
    });

    wx.setNavigationBarTitle({
      title: '场景详情'
    });
  },

  // 复制条件
  onCopyConditions() {
    if (this.data.scenario && this.data.scenario.conditions) {
      this.copyToClipboard(`所需条件：\n${this.data.scenario.conditions}`);
    }
  },

  // 复制操作步骤
  onCopyActionSteps() {
    if (this.data.scenario && this.data.scenario.actionSteps) {
      const content = `操作步骤：\n${this.data.scenario.actionSteps.join('\n')}`;
      this.copyToClipboard(content);
    }
  },

  // 复制法条依据
  onCopyLegalBasis() {
    if (this.data.scenario && this.data.scenario.legalBasis) {
      this.copyToClipboard(`法条依据：\n${this.data.scenario.legalBasis}`);
    }
  },

  // 复制相关法条解释
  onCopyRelatedLaws() {
    if (this.data.scenario && this.data.scenario.relatedLaws) {
      this.copyToClipboard(`相关法条解释：\n${this.data.scenario.relatedLaws}`);
    }
  },

  // 复制全文
  onCopyAll() {
    if (!this.data.scenario) return;

    const scenario = this.data.scenario;
    let content = `${scenario.title}\n\n`;

    if (scenario.conditions) {
      content += `所需条件：\n${scenario.conditions}\n\n`;
    }

    if (scenario.actionSteps && scenario.actionSteps.length > 0) {
      content += `操作步骤：\n${scenario.actionSteps.join('\n')}\n\n`;
    }

    if (scenario.legalBasis) {
      content += `法条依据：\n${scenario.legalBasis}\n\n`;
    }

    if (scenario.relatedLaws) {
      content += `相关法条解释：\n${scenario.relatedLaws}`;
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

  // 返回上一页
  onBack() {
    wx.navigateBack({
      success: () => {
        console.log('返回成功');
      },
      fail: () => {
        // 如果无法返回，跳转到主页
        wx.redirectTo({
          url: '/pages/core-laws-pack/core-laws-api/core-laws-api'
        });
      }
    });
  },

  // 跳转到主页
  onGoHome() {
    wx.redirectTo({
      url: '/pages/core-laws-pack/core-laws-api/core-laws-api',
      success: () => {
        console.log('跳转主页成功');
      },
      fail: (err) => {
        console.error('跳转主页失败:', err);
      }
    });
  },

  // 页面分享
  onShareAppMessage() {
    const scenario = this.data.scenario;
    if (!scenario) {
      return {
        title: '维权场景详情',
        path: '/pages/core-laws-pack/core-laws-api/core-laws-api'
      };
    }

    return {
      title: `维权指南：${scenario.title}`,
      path: `/pages/core-laws-pack/scenario-detail/scenario-detail?id=${scenario.id}`,
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
    const scenario = this.data.scenario;
    if (!scenario) {
      return {
        title: '劳动法维权指南'
      };
    }

    return {
      title: `维权指南：${scenario.title}`,
      query: `id=${scenario.id}`,
      success: (res) => {
        console.log('分享朋友圈成功', res);
      },
      fail: (err) => {
        console.error('分享朋友圈失败', err);
      }
    };
  },

  // 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新场景详情');
    this.loadScenarioDetail();
    wx.stopPullDownRefresh();
  }
});
