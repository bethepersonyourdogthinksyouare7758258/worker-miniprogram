// pages/docgen/docgen-form.js
Page({
  data: {
    formType: '',
    title: '',
    formData: {
      // 员工信息（固定默认信息）
      employeeName: '马大帅',
      employeeIdCard: '210381199001010123',
      employeeAddress: '辽宁省铁岭市银州区工人街32号',
      employeePhone: '15640234567',
      // 单位信息（固定虚拟信息）
      companyName: '铁岭维多利亚国际娱乐广场',
      companyCreditCode: '912112001234567890',
      companyLegalRep: '范德彪',
      companyContact: '赵四',
      companyPhone: '024-87654321',
      // 解除信息（时间可选择，原因固定）
      terminationDate: '',
      selectedReasons: ['reason1', 'reason2', 'reason3', 'reason4', 'reason5', 'reason6'],
      selectedReasonsText: '（一）未按照劳动合同约定提供劳动保护或者劳动条件的；\n（二）未及时足额支付劳动报酬的；\n（三）未依法为劳动者缴纳社会保险费的；\n（四）用人单位的规章制度违反法律、法规的规定，损害劳动者权益的；\n（五）因本法第二十六条第一款规定的情形致使劳动合同无效的；\n（六）法律、行政法规规定劳动者可以解除劳动合同的其他情形。'
    },
    documentContent: '',
    showPreview: false,
    reasonsMap: {
      'reason1': '（一）未按照劳动合同约定提供劳动保护或者劳动条件的；',
      'reason2': '（二）未及时足额支付劳动报酬的；',
      'reason3': '（三）未依法为劳动者缴纳社会保险费的；',
      'reason4': '（四）用人单位的规章制度违反法律、法规的规定，损害劳动者权益的；',
      'reason5': '（五）因本法第二十六条第一款规定的情形致使劳动合同无效的；',
      'reason6': '（六）法律、行政法规规定劳动者可以解除劳动合同的其他情形。'
    }
  },

  onLoad(options) {
    const type = options.type || 'arbitration'
    const title = this.getTitleByType(type)
    
    this.setData({
      formType: type,
      title: title
    })
    
    wx.setNavigationBarTitle({
      title: title
    })
  },

  getTitleByType(type) {
    const titles = {
      arbitration: '劳动仲裁申请书',
      resignation: '被迫离职通知书',
      complaint: '劳动监察投诉书'
    }
    return titles[type] || '法律文书生成'
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

  // 生成文书内容
  generateResignationNotice() {
    const { formData } = this.data
    
    // 格式化日期
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }

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

（一） 未按照劳动合同约定提供劳动保护或者劳动条件的；
（二） 未及时足额支付劳动报酬的；
（三） 未依法为劳动者缴纳社会保险费的；
（四） 用人单位的规章制度违反法律、法规的规定，损害劳动者权益的；
（五） 因本法第二十六条第一款规定的情形致使劳动合同无效的；
（六） 法律、行政法规规定劳动者可以解除劳动合同的其他情形。

本人决定从${formatDate(formData.terminationDate)}起解除与贵单位的劳动关系。

根据《劳动合同法》第38条、第46条规定，贵单位应向本人支付经济补偿金。如单位拒绝支付，本人将不得不提起劳动仲裁及向有关部门投诉。
特此通知
员工姓名：${formData.employeeName}
${formatDate(new Date().toISOString().split('T')[0])}`

    return content
  },

  // 生成文书
  handleGenerateDocument() {
    if (!this.validateForm()) {
      return
    }

    let documentContent = ''
    
    if (this.data.formType === 'resignation') {
      documentContent = this.generateResignationNotice()
    }
    
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
      path: `/pages/docgen/docgen-form/docgen-form?type=${this.data.formType}`,
      imageUrl: ''
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: `${this.data.title} - 专业法律文书生成`,
      query: `type=${this.data.formType}`,
      imageUrl: ''
    }
  }
})
