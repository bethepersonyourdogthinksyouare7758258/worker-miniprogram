// 导入双模式管理器
const { DualModeManager } = require('../../../data/core-laws/dual-mode-manager.js');

Page({
  data: {
    item: null, // 当前显示的条目
    itemType: '', // 条目类型: 'knowledge' 或 'scenario'
    dualModeManager: null
  },

  onLoad(options) {
    console.log('详情页面加载, 参数:', options);
    
    // 初始化双模式管理器
    this.data.dualModeManager = new DualModeManager();
    
    const { id, type } = options;
    
    if (!id) {
      console.error('缺少必要参数: id');
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      return;
    }

    this.setData({
      itemType: type || 'scenario'
    });

    this.loadItemDetail(id);
  },

  // 加载条目详情
  loadItemDetail(id) {
    try {
      if (!this.data.dualModeManager) {
        console.error('双模式管理器未初始化');
        return;
      }

      const item = this.data.dualModeManager.getItemById(id);
      
      if (!item) {
        console.error('未找到条目:', id);
        wx.showToast({
          title: '内容不存在',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
        return;
      }

      console.log('加载条目详情:', item.title);
      this.setData({
        item: item
      });
      
      // 设置页面标题
      wx.setNavigationBarTitle({
        title: item.type === 'scenario' ? '场景详情' : '法条详情'
      });

    } catch (error) {
      console.error('加载条目详情失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // 复制内容
  onCopyContent(e) {
    const content = e.currentTarget.dataset.content;
    if (!content) {
      wx.showToast({
        title: '无内容可复制',
        icon: 'none'
      });
      return;
    }

    this.copyToClipboard(content);
  },

  // 复制步骤
  onCopySteps(e) {
    const item = e.currentTarget.dataset.item;
    if (!item || !item.steps || item.steps.length === 0) {
      wx.showToast({
        title: '无步骤可复制',
        icon: 'none'
      });
      return;
    }

    const stepsText = item.steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
    this.copyToClipboard(stepsText);
  },

  // 复制全部内容
  onCopyAll() {
    const { item } = this.data;
    if (!item) return;

    let content = `${item.title}\n\n`;
    
    if (item.type === 'scenario') {
      if (item.conditions) {
        content += `适用条件：\n${item.conditions}\n\n`;
      }
      
      if (item.steps && item.steps.length > 0) {
        content += `维权步骤：\n`;
        item.steps.forEach((step, index) => {
          content += `${index + 1}. ${step}\n`;
        });
        content += '\n';
      }
      
      if (item.explanation) {
        content += `详细说明：\n${item.explanation}\n\n`;
      }
    } else {
      if (item.summary) {
        content += `简明结论：\n${item.summary}\n\n`;
      }
    }
    
    if (item.legalBasis) {
      content += `法律依据：\n${item.legalBasis}`;
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
  onGoBack() {
    wx.navigateBack();
  },

  // 页面分享
  onShareAppMessage() {
    const { item } = this.data;
    if (!item) {
      return {
        title: '劳动法速查',
        path: '/pages/core-laws-pack/core-laws/core-laws'
      };
    }

    return {
      title: `${item.title} - 劳动法速查`,
      path: `/pages/core-laws-pack/core-laws-detail/core-laws-detail?id=${item.id}&type=${item.type}`,
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
    const { item } = this.data;
    const title = item ? `${item.title} - 劳动法速查` : '劳动法速查';
    
    return {
      title: title,
      query: item ? `id=${item.id}&type=${item.type}` : '',
      success: (res) => {
        console.log('分享朋友圈成功', res);
      },
      fail: (err) => {
        console.error('分享朋友圈失败', err);
      }
    };
  }
});
