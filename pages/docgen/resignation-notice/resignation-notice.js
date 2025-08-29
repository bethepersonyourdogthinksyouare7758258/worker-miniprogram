// pages/docgen/resignation-notice/resignation-notice.js
Page({
  data: {
    title: '被迫离职通知书',
    formData: {
      // 员工信息（固定默认信息）
      employeeName: '马大帅',
      employeeIdCard: '210381199001010123',
      employeeAddress: '辽宁省铁岭市银州区工人街32号',
      employeePhone: '15640234567',
      // 公司信息（固定默认信息）
      companyName: '铁岭维多利亚国际娱乐广场',
      companyCreditCode: '912112001234567890',
      companyLegalRep: '范德彪',
      companyContact: '赵四',
      companyPhone: '024-87654321',
      // 解除日期
      terminationDate: '',
      // 固定的解除原因
      selectedReasonsText: '（一）未按照劳动合同约定提供劳动保护或者劳动条件的；\n（二）未及时足额支付劳动报酬的；\n（三）未依法为劳动者缴纳社会保险费的；\n（四）用人单位的规章制度违反法律、法规的规定，损害劳动者权益的；\n（五）因本法第二十六条第一款规定的情形致使劳动合同无效的；\n（六）法律、行政法规规定劳动者可以解除劳动合同的其他情形。'
    },
    documentContent: '',
    showPreview: false
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },

  // 解除日期选择处理
  handleTerminationDateChange(e) {
    this.setData({
      'formData.terminationDate': e.detail.value
    })
  },

  // 表单验证
  validateForm() {
    const { formData } = this.data
    
    if (!formData.terminationDate) {
      wx.showToast({
        title: '请选择解除日期',
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

  // 生成被迫离职通知书
  generateResignationNotice() {
    const { formData } = this.data

    const content = `被迫解除劳动关系通知书

员工姓名：${formData.employeeName}
身份证号：${formData.employeeIdCard}
单位名称：${formData.companyName}
统一社会信用代码：${formData.companyCreditCode}
住址：${formData.employeeAddress}
法定代表人：${formData.companyLegalRep}
联系人：${formData.companyContact}
联系电话：${formData.companyPhone}

正文：

${formData.companyName}：

因下列原因，根据《劳动合同法》第三十八条的规定

（一）未按照劳动合同约定提供劳动保护或者劳动条件的；
（二）未及时足额支付劳动报酬的；
（三）未依法为劳动者缴纳社会保险费的；
（四）用人单位的规章制度违反法律、法规的规定，损害劳动者权益的；
（五）因本法第二十六条第一款规定的情形致使劳动合同无效的；
（六）法律、行政法规规定劳动者可以解除劳动合同的其他情形。

本人决定从${this.formatDate(formData.terminationDate)}起解除与贵单位的劳动关系。

根据《劳动合同法》第38条、第46条规定，贵单位应向本人支付经济补偿金。如单位拒绝支付，本人将不得不提起劳动仲裁及向有关部门投诉。

特此通知

员工姓名：${formData.employeeName}
${this.formatDate(new Date().toISOString().split('T')[0])}`

    return content
  },

  // 生成文书
  handleGenerateDocument() {
    if (!this.validateForm()) {
      return
    }

    const documentContent = this.generateResignationNotice()
    
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
      path: `/pages/docgen/resignation-notice/resignation-notice`,
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
