// pages/docgen/arbitration-request/arbitration-request.js
Page({
  data: {
    title: '劳动仲裁申请书',
    formData: {
      // 申请人信息（固定默认信息）
      applicantName: '马大帅',
      applicantIdCard: '210381199001010123',
      applicantAddress: '辽宁省铁岭市银州区工人街32号',
      applicantPhone: '15640234567',
      // 被申请人信息（固定默认信息）
      respondentName: '铁岭维多利亚国际娱乐广场',
      respondentCreditCode: '912112001234567890',
      respondentAddress: '辽宁省铁岭市银州区中央大街188号',
      respondentPhone: '024-87654321',
      // 仲裁请求信息
      disputeAmount: '', // 争议金额
      disputeReason: '', // 争议事由
      factAndReason: '' // 事实和理由
    },
    documentContent: '',
    showPreview: false
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },

  // 处理输入
  handleInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`formData.${field}`]: value
    })
  },

  // 表单验证
  validateForm() {
    const { formData } = this.data
    
    if (!formData.disputeAmount) {
      wx.showToast({
        title: '请填写争议金额',
        icon: 'none'
      })
      return false
    }
    
    if (!formData.disputeReason) {
      wx.showToast({
        title: '请填写争议事由',
        icon: 'none'
      })
      return false
    }
    
    return true
  },

  // 格式化日期
  formatDate(dateStr) {
    if (!dateStr) return '[请填写日期]'
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  },

  // 生成劳动仲裁申请书
  generateArbitrationRequest() {
    const { formData } = this.data

    const content = `劳动人事争议仲裁申请书

申请人：${formData.applicantName}
身份证号：${formData.applicantIdCard}
住址：${formData.applicantAddress}
联系电话：${formData.applicantPhone}

被申请人：${formData.respondentName}
统一社会信用代码：${formData.respondentCreditCode}
住址：${formData.respondentAddress}
联系电话：${formData.respondentPhone}

仲裁请求：

1. 请求裁决被申请人支付申请人${formData.disputeReason}${formData.disputeAmount}元；

2. 请求裁决被申请人承担本案仲裁费用。

事实与理由：

${formData.factAndReason || '申请人与被申请人存在劳动争议，具体事实和理由如下：\n\n[请在此处详细描述争议的具体情况、时间、地点、相关证据等]'}

此致
${formData.respondentAddress.includes('省') ? formData.respondentAddress.split('省')[0] + '省' : formData.respondentAddress.split('市')[0] + '市'}劳动人事争议仲裁委员会

申请人：${formData.applicantName}
申请日期：${this.formatDate(new Date().toISOString().split('T')[0])}`

    return content
  },

  // 生成文书
  handleGenerateDocument() {
    if (!this.validateForm()) {
      return
    }

    const documentContent = this.generateArbitrationRequest()
    
    this.setData({
      documentContent: documentContent,
      showPreview: true
    })
    
    wx.showToast({
      title: '文书生成成功',
      icon: 'success'
    })

    // 滚动到预览区域
    setTimeout(() => {
      wx.pageScrollTo({
        selector: '.preview-container',
        duration: 500
      })
    }, 100)
  },

  // 复制文书内容
  handleCopyDocument() {
    if (!this.data.documentContent) {
      wx.showToast({
        title: '没有可复制的内容',
        icon: 'none'
      })
      return
    }

    wx.setClipboardData({
      data: this.data.documentContent,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        })
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        })
      }
    })
  },

  // 分享文书
  handleShareDocument() {
    if (!this.data.documentContent) {
      wx.showToast({
        title: '没有可分享的内容',
        icon: 'none'
      })
      return
    }

    wx.showShareMenu({
      withShareTicket: true,
      showShareItems: ['shareAppMessage', 'shareTimeline']
    })
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: `${this.data.title} - 法律文书生成器`,
      path: `/pages/docgen/arbitration-request/arbitration-request`,
      imageUrl: ''
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: `${this.data.title} - 专业法律文书生成`,
      query: ``,
      imageUrl: ''
    }
  }
})
