// pages/docgen/arbitration-request/arbitration-request.js
Page({
  data: {
    title: '劳动仲裁申请书',
    selectedItems: [], // 选中的诉讼请求数组
    // 诉讼请求列表，每项都有checked状态
    arbitrationItems: [
      { id: 'item1', checked: false, label: '确认劳动关系' },
      { id: 'item2', checked: false, label: '支付拖欠劳动报酬' },
      { id: 'item3', checked: false, label: '支付违法解除劳动合同赔偿金' },
      { id: 'item4', checked: false, label: '支付延时加班工资' },
      { id: 'item5', checked: false, label: '支付休息日加班工资' },
      { id: 'item6', checked: false, label: '支付法定节假日加班工资' }
    ],
    // 动态表单显示状态
    showItem1Form: false,
    showItem2Form: false,
    showItem3Form: false,
    showItem4Form: false,
    showItem5Form: false,
    showItem6Form: false,
    formData: {
      // 申请人信息（固定默认信息）
      applicantName: '马大帅',
      applicantIdCard: '210381199001010123',
      applicantGender: '男',
      applicantEthnic: '汉族',
      applicantAddress: '辽宁省铁岭市银州区工人街32号',
      // 被申请人信息（固定默认信息）
      respondentName: '铁岭维多利亚国际娱乐广场',
      respondentCreditCode: '912112001234567890',
      respondentAddress: '辽宁省铁岭市银州区中央大街188号',
      respondentLegalRep: '王富贵',
      // 变量数据（用户可填写）
      variables: {
        // 基础变量
        a: '', // 入职日期
        b: '', // 离职日期
        c: '', // 拖欠劳动报酬金额
        d: '', // 延时加班工资
        e: '', // 休息日加班工资/平均工资
        f: '', // 法定节假日加班工资/工作年限
        k: '', // 延时加班总小时数
        o: '', // 违法解除赔偿金
        q: '', // 拖欠工资时间段
        r: '', // 工作岗位
        t: '', // 工资结构/月工资
        x: '', // 合同签订情况
        y: '', // 合同期限
        z: '', // 工作地点
        // 申请日期
        applicationDate: ''
      }
    },
    documentContent: '',
    showPreview: false,
    // 诉讼请求映射
    arbitrationItemsMap: {
      'item1': '确认劳动关系',
      'item2': '支付拖欠劳动报酬',
      'item3': '支付违法解除劳动合同赔偿金',
      'item4': '支付延时加班工资',
      'item5': '支付休息日加班工资',
      'item6': '支付法定节假日加班工资'
    }
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },

  // 诉讼请求选择处理
  handleArbitrationItemSelect(e) {
    const itemId = e.currentTarget.dataset.item
    let selectedItems = [...this.data.selectedItems]
    let arbitrationItems = [...this.data.arbitrationItems]
    
    // 找到对应的诉讼请求项
    const itemIndex = arbitrationItems.findIndex(item => item.id === itemId)
    if (itemIndex === -1) return
    
    // 切换选中状态
    const isCurrentlySelected = arbitrationItems[itemIndex].checked
    arbitrationItems[itemIndex].checked = !isCurrentlySelected
    
    if (!isCurrentlySelected) {
      // 添加到选中列表
      selectedItems.push(itemId)
    } else {
      // 从选中列表移除
      const selectedIndex = selectedItems.indexOf(itemId)
      if (selectedIndex > -1) {
        selectedItems.splice(selectedIndex, 1)
      }
      // 清理该项对应的表单数据
      this.clearFormDataForItem(itemId)
    }
    
    // 更新显示状态变量
    const formShowStates = {
      showItem1Form: selectedItems.includes('item1'),
      showItem2Form: selectedItems.includes('item2'),
      showItem3Form: selectedItems.includes('item3'),
      showItem4Form: selectedItems.includes('item4'),
      showItem5Form: selectedItems.includes('item5'),
      showItem6Form: selectedItems.includes('item6')
    }
    
    // 更新数据
    this.setData({
      selectedItems: selectedItems,
      arbitrationItems: arbitrationItems,
      ...formShowStates
    })
    
    wx.showToast({
      title: selectedItems.length > 0 ? `✅ 已选择 ${selectedItems.length} 项` : '已取消所有选择',
      icon: 'none',
      duration: 1500
    })
  },

  // 清理取消选择项的表单数据
  clearFormDataForItem(item) {
    const updateData = {}
    
    // 根据不同诉讼请求清理对应的变量字段
    switch(item) {
      case 'item1': // 确认劳动关系
        updateData['formData.variables.a'] = ''
        updateData['formData.variables.b'] = ''
        updateData['formData.variables.r'] = ''
        updateData['formData.variables.t'] = ''
        updateData['formData.variables.x'] = ''
        updateData['formData.variables.y'] = ''
        updateData['formData.variables.z'] = ''
        break
      case 'item2': // 支付拖欠劳动报酬
        updateData['formData.variables.c'] = ''
        updateData['formData.variables.q'] = ''
        updateData['formData.variables.t'] = ''
        break
      case 'item3': // 违法解除赔偿金
        updateData['formData.variables.o'] = ''
        updateData['formData.variables.b'] = ''
        updateData['formData.variables.e'] = ''
        updateData['formData.variables.f'] = ''
        break
      case 'item4': // 延时加班工资
        updateData['formData.variables.d'] = ''
        updateData['formData.variables.k'] = ''
        updateData['formData.variables.t'] = ''
        break
      case 'item5': // 休息日加班工资
        updateData['formData.variables.e'] = ''
        break
      case 'item6': // 法定节假日加班工资
        updateData['formData.variables.f'] = ''
        break
    }
    
    this.setData(updateData)
  },

  // 变量输入处理
  handleVariableInput(e) {
    const variable = e.currentTarget.dataset.variable
    const value = e.detail.value
    this.setData({
      [`formData.variables.${variable}`]: value
    })
  },

  // 日期选择处理
  handleDateChange(e) {
    const variable = e.currentTarget.dataset.variable
    const value = e.detail.value
    
    this.setData({
      [`formData.variables.${variable}`]: value
    })
  },

  // 表单验证
  validateForm() {
    const { selectedItems, formData } = this.data
    
    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择诉讼请求',
        icon: 'none'
      })
      return false
    }
    
    if (!formData.variables.applicationDate) {
      wx.showToast({
        title: '请选择申请日期',
        icon: 'none'
      })
      return false
    }
    
    // 验证特定诉讼请求的必填字段
    for (let item of selectedItems) {
      if (!this.validateItemSpecificFields(item)) {
        return false
      }
    }
    
    return true
  },

  // 验证特定诉讼请求的必填字段
  validateItemSpecificFields(item) {
    const { variables } = this.data.formData
    
    switch(item) {
      case 'item1': // 确认劳动关系
        if (!variables.a) {
          wx.showToast({ title: '请填写入职日期', icon: 'none' })
          return false
        }
        if (!variables.r) {
          wx.showToast({ title: '请填写工作岗位', icon: 'none' })
          return false
        }
        break
      case 'item2': // 拖欠工资
        if (!variables.c) {
          wx.showToast({ title: '请填写拖欠工资金额', icon: 'none' })
          return false
        }
        break
      case 'item3': // 违法解除赔偿金
        if (!variables.o) {
          wx.showToast({ title: '请填写赔偿金额', icon: 'none' })
          return false
        }
        break
      case 'item4': // 延时加班工资
        if (!variables.k) {
          wx.showToast({ title: '请填写加班小时数', icon: 'none' })
          return false
        }
        break
    }
    return true
  },

  // 格式化日期
  formatDate(dateStr) {
    if (!dateStr) return '[请填写日期]'
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  },

  // 生成仲裁申请书内容
  generateArbitrationRequest() {
    const { formData, selectedItems } = this.data
    const { variables } = formData
    
    // 构建诉讼请求部分
    let requests = []
    if (selectedItems.includes('item1')) {
      requests.push(`1.请求确认申请人与被申请人之间于"a=${this.formatDate(variables.a)}"至"b=${this.formatDate(variables.b)}"存在劳动关系；`)
    }
    if (selectedItems.includes('item2')) {
      requests.push(`2.请求裁决被申请人向申请人支付（q=${variables.q || '[请填写时间段]'}）劳动报酬"c=${variables.c || '[请填写金额]'}"元；`)
    }
    if (selectedItems.includes('item3')) {
      requests.push(`3.请求裁决被申请人向申请人支付违法解除劳动合同的赔偿金"o=${variables.o || '[请填写金额]'}"元；`)
    }
    if (selectedItems.includes('item4')) {
      requests.push(`4.请求裁决被申请人支付申请人延时加班工资"d=${variables.d || 't÷21.75÷8×k×1.5'}"元；`)
    }
    if (selectedItems.includes('item5')) {
      requests.push(`5.请求裁决被申请人支付申请人休息日加班工资"e=${variables.e || '[请填写金额]'}"元；`)
    }
    if (selectedItems.includes('item6')) {
      requests.push(`6.请求裁决被申请人支付申请人法定节假日加班工资"f=${variables.f || '[请填写金额]'}"元；`)
    }

    const content = `劳动仲裁申请书

申请人：${formData.applicantName}，${formData.applicantGender}，${formData.applicantEthnic}
身份证号：${formData.applicantIdCard}
住址：${formData.applicantAddress}

被申请人：${formData.respondentName}
统一社会信用代码：${formData.respondentCreditCode}
住址：${formData.respondentAddress}
法定代表人：${formData.respondentLegalRep}

诉讼请求：
${requests.join('\n')}

事实和理由：
"a=${this.formatDate(variables.a)}"，申请人入职被申请人处"x=${variables.x || '[请填写合同情况]'}"，"y=${variables.y || '[请填写合同期限]'}"，工作地点为"z=${variables.z || '[请填写工作地点]'}"，担任"r=${variables.r || '[请填写岗位]'}"一职，工资结构为"t=${variables.t || '[请填写工资结构]'}"。

${this.generateFactsAndReasons(selectedItems, variables)}

此致
${formData.respondentAddress.includes('省') ? formData.respondentAddress.split('省')[0] + '省' : formData.respondentAddress.split('市')[0] + '市'}劳动人事仲裁委员会

申请人：${formData.applicantName}
申请日期：${this.formatDate(variables.applicationDate)}

【温馨提示】
本申请书由"打工者生存工具包"小程序自动生成，请根据实际情况修改个人信息并准备相关证据材料。如需法律咨询，建议联系专业律师。`

    return content
  },

  // 根据选择的请求生成事实和理由
  generateFactsAndReasons(selectedItems, variables) {
    let facts = []
    
    if (selectedItems.includes('item2')) {
      facts.push(`一、被申请人应当向申请人支付劳动报酬"c=${variables.c || '[请填写金额]'}"元。
申请人与被申请人约定月薪为"t=${variables.t || '[请填写工资]'}"，"q=${variables.q || '[请填写时间段]'}"期间被申请人未按约定向申请人支付劳动报酬，至今共拖欠"c=${variables.c || '[请填写金额]'}"元，根据《劳动合同法》第三十条第一款"用人单位应当按照劳动合同约定和国家规定，向劳动者及时足额支付劳动报酬。"的规定，被申请人应当向申请人支付劳动报酬"c=${variables.c || '[请填写金额]'}"元。`)
    }
    
    if (selectedItems.includes('item3')) {
      facts.push(`二、被申请人应当向申请人支付违法解除劳动合同的赔偿金"o=2×e×f"元。
"b=${this.formatDate(variables.b)}"，被申请人违反法律规定解除与申请人间的劳动合同，根据《劳动合同法》第八十七条"用人单位违反本法规定解除或者终止劳动合同的，应当依照本法第四十七条规定的经济补偿标准的二倍向劳动者支付赔偿金。"的规定，被申请人应依照《劳动合同法》第四十七条规定的经济补偿标准的二倍向申请人支付赔偿金。
申请人离职前十二个月平均工资为"e=${variables.e || '[请填写平均工资]'}"元，工作年限为"f=${variables.f || '[请填写工作年限]'}"年，因此被申请人应当向申请人支付违法解除劳动合同的赔偿金"o=2×e×f"元。`)
    }
    
    if (selectedItems.includes('item4')) {
      facts.push(`三、被申请人应当支付申请人延时加班工资"d=t÷21.75÷8×k×1.5"元。
申请人在被申请人处工作期间，存在工作日延时加班的情况，共加班"k=${variables.k || '[请填写小时]'}"小时，根据《劳动法》第四十四条第（一）项"有下列情形之一的，用人单位应当按照下列标准支付高于劳动者正常工作时间工资的工资报酬：（一）安排劳动者延长工作时间的，支付不低于工资的百分之一百五十的工资报酬；"的规定，被申请人应当支付申请人延时加班工资"d=t÷21.75÷8×k×1.5=${variables.d || '[请填写计算结果]'}"元。

💡 提示：可使用小程序内"加班费计算器"功能计算准确金额。`)
    }
    
    return facts.join('\n\n')
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
        duration: 800
      })
    }, 300)
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