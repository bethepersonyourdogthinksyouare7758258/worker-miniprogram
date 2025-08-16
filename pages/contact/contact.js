Page({
  data: {
    feedbackText: '',
    faqList: [
      {
        question: '文书生成的内容准确吗？',
        answer: '我们的文书模板基于最新的劳动法律法规设计，经过专业法律人士审核。但建议在正式使用前咨询专业律师进行确认。',
        expanded: false
      },
      {
        question: '我的个人信息会被保存吗？',
        answer: '不会。所有信息仅在您的手机本地处理，我们不会上传或保存任何个人数据到服务器，充分保护您的隐私安全。',
        expanded: false
      },
      {
        question: '计算器的算法依据是什么？',
        answer: '所有计算器都严格按照《劳动法》、《劳动合同法》等相关法律法规的标准公式设计，确保计算结果的准确性和合法性。',
        expanded: false
      },
      {
        question: '为什么某些信息无法修改？',
        answer: '当前版本使用默认角色信息（如马大帅等），生成文书后请手动修改为真实信息。支持自定义信息的新版本正在开发中。',
        expanded: false
      },
      {
        question: '生成的文书可以直接使用吗？',
        answer: '生成的文书为标准模板格式，具体使用时需要根据实际情况修改相关信息，建议在正式提交前咨询专业法律人士。',
        expanded: false
      }
    ]
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '关于我们'
    });
  },

  // 处理反馈输入
  onFeedbackInput(e) {
    this.setData({
      feedbackText: e.detail.value
    });
  },

  // 提交反馈
  submitFeedback() {
    const feedback = this.data.feedbackText.trim();
    
    if (!feedback) {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none'
      });
      return;
    }

    // 模拟提交反馈
    wx.showLoading({
      title: '提交中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '感谢您的反馈',
        icon: 'success',
        duration: 2000
      });

      // 清空输入框
      this.setData({
        feedbackText: ''
      });

      // 可以在这里保存反馈到本地存储或发送到服务器
      const feedbackData = {
        content: feedback,
        time: new Date().toLocaleString(),
        version: '1.0.0'
      };
      
      // 保存到本地存储
      try {
        let feedbackList = wx.getStorageSync('feedbackList') || [];
        feedbackList.unshift(feedbackData);
        wx.setStorageSync('feedbackList', feedbackList.slice(0, 50)); // 只保留最近50条
      } catch (e) {
        console.error('保存反馈失败', e);
      }
    }, 1000);
  },

  // 切换FAQ展开状态
  toggleFaq(e) {
    const index = e.currentTarget.dataset.index;
    const faqList = this.data.faqList;
    
    // 切换当前项的展开状态
    faqList[index].expanded = !faqList[index].expanded;
    
    // 可选：关闭其他展开的项
    faqList.forEach((item, i) => {
      if (i !== index) {
        item.expanded = false;
      }
    });
    
    this.setData({
      faqList
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '五年四班劳动委员 - 专业的劳动法律服务助手',
      path: '/pages/contact/contact',
      imageUrl: '/images/share-image.png', // 可以添加分享图片
      success: (res) => {
        wx.showToast({
          title: '分享成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        wx.showToast({
          title: '分享失败',
          icon: 'none'
        });
      }
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '五年四班劳动委员 - 让每一位劳动者的权益都得到保障',
      imageUrl: '/images/share-timeline.png' // 可以添加朋友圈分享图片
    };
  }
});
