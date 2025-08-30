// pages/docgen/complaint-letter/complaint-letter.js
Page({
  data: {
    title: '劳动监察投诉书',
    selectedItems: [], // 选中的投诉项目数组
    // 投诉项目列表，每项都有checked状态
    complaintItems: [
      { id: 'item1', checked: false, label: '制定的内部劳动保障规章违反劳动法律法规' },
      { id: 'item2', checked: false, label: '未依法与投诉人订立书面劳动合同' },
      { id: 'item3', checked: false, label: '违法使用童工' },
      { id: 'item4', checked: false, label: '违反女职工特殊劳动保护规定' },
      { id: 'item5', checked: false, label: '违法延长工作时间，侵害劳动者休息休假权利' },
      { id: 'item6', checked: false, label: '拖欠工资且未执行最低工资标准' },
      { id: 'item7', checked: false, label: '未依法为投诉人缴纳社会保险费' },
      { id: 'item8', checked: false, label: '劳务派遣单位与用工单位违反劳务派遣规定' },
      { id: 'item9', checked: false, label: '违反职业介绍规定，收取高额费用且提供虚假岗位信息' }
    ],
    // 动态表单显示状态
    showItem1Form: false,
    showItem2Form: false,
    showItem3Form: false,
    showItem4Form: false,
    showItem5Form: false,
    showItem6Form: false,
    showItem7Form: false,
    showItem8Form: false,
    showItem9Form: false,
    formData: {
      // 投诉人信息（固定默认信息）
      complainantName: '马大帅',
      complainantIdCard: '210381199001010123',
      complainantAddress: '辽宁省铁岭市银州区工人街32号',
      complainantPhone: '15640234567',
      complainantWorkUnit: '铁岭维多利亚国际娱乐广场',
      // 被投诉单位信息（固定虚拟信息）
      respondentName: '铁岭维多利亚国际娱乐广场',
      respondentCreditCode: '912112001234567890',
      respondentAddress: '辽宁省铁岭市银州区中央大街188号',
      respondentPhone: '024-87654321',
      // 投诉事项相关（用户可填写的变量）
      selectedComplaintItems: [],
      complaintVariables: {
        // 各种投诉事项需要的变量
        complaintDate: '', // 投诉日期
        violationDate: '', // 违法日期
        violationAmount: '', // 违法金额
        workStartDate: '', // 入职日期
        workEndDate: '', // 离职日期
        workMonths: '', // 工作月数
        jobPosition: '', // 工作岗位
        monthlySalary: '', // 月工资
        owedSalary: '', // 拖欠工资
        minimumWage: '', // 最低工资标准
        pregnancyDate: '', // 怀孕日期
        childAge: '', // 童工年龄
        overtimeHours: '', // 加班时间
        serviceFee: '', // 服务费
        customAmount1: '', // 自定义金额1
        customAmount2: '', // 自定义金额2
        customDate1: '', // 自定义日期1
        customDate2: '' // 自定义日期2
      }
    },
    documentContent: '',
    showPreview: false,
    // 投诉事项映射
    complaintItemsMap: {
      'item1': '制定的内部劳动保障规章违反劳动法律法规',
      'item2': '未依法与投诉人订立书面劳动合同',
      'item3': '违法使用童工',
      'item4': '违反女职工特殊劳动保护规定',
      'item5': '违法延长工作时间，侵害劳动者休息休假权利',
      'item6': '拖欠工资且未执行最低工资标准',
      'item7': '未依法为投诉人缴纳社会保险费',
      'item8': '劳务派遣单位与用工单位违反劳务派遣规定',
      'item9': '违反职业介绍规定，收取高额费用且提供虚假岗位信息'
    }
  },

  // 辅助函数：检查某个投诉项是否被选中
  isItemSelected(itemId) {
    return this.data.selectedItems.includes(itemId)
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },

  // 投诉事项选择处理
  handleComplaintItemSelect(e) {
    console.log('🔍 点击投诉事项选择:', e.currentTarget.dataset.item)
    
    const itemId = e.currentTarget.dataset.item
    let selectedItems = [...this.data.selectedItems]
    let complaintItems = [...this.data.complaintItems]
    
    console.log('🔍 当前选中项:', selectedItems)
    console.log('🔍 点击的项目:', itemId)
    
    // 找到对应的投诉项
    const itemIndex = complaintItems.findIndex(item => item.id === itemId)
    if (itemIndex === -1) return
    
    // 切换选中状态
    const isCurrentlySelected = complaintItems[itemIndex].checked
    complaintItems[itemIndex].checked = !isCurrentlySelected
    
    if (!isCurrentlySelected) {
      // 添加到选中列表
      selectedItems.push(itemId)
      console.log('✅ 添加选择:', itemId)
    } else {
      // 从选中列表移除
      const selectedIndex = selectedItems.indexOf(itemId)
      if (selectedIndex > -1) {
        selectedItems.splice(selectedIndex, 1)
      }
      console.log('❌ 取消选择:', itemId)
      // 清理该项对应的表单数据
      this.clearFormDataForItem(itemId)
    }
    
    console.log('🔍 新的选中项数组:', selectedItems)
    console.log('🔍 更新后的选项状态:', complaintItems)
    
    // 更新显示状态变量
    const formShowStates = {
      showItem1Form: selectedItems.includes('item1'),
      showItem2Form: selectedItems.includes('item2'),
      showItem3Form: selectedItems.includes('item3'),
      showItem4Form: selectedItems.includes('item4'),
      showItem5Form: selectedItems.includes('item5'),
      showItem6Form: selectedItems.includes('item6'),
      showItem7Form: selectedItems.includes('item7'),
      showItem8Form: selectedItems.includes('item8'),
      showItem9Form: selectedItems.includes('item9')
    }
    
    console.log('🔍 表单显示状态:', formShowStates)
    
    // 更新数据
    this.setData({
      selectedItems: selectedItems,
      complaintItems: complaintItems,
      'formData.selectedComplaintItems': selectedItems,
      ...formShowStates
    })
    
    console.log('🔍 setData后的数据:', this.data.selectedItems)
    console.log('🔍 setData后的选项状态:', this.data.complaintItems)
    console.log('🔍 formData中的选择:', this.data.formData.selectedComplaintItems)
    
    wx.showToast({
      title: selectedItems.length > 0 ? `✅ 已选择 ${selectedItems.length} 项` : '已取消所有选择',
      icon: 'none',
      duration: 1500
    })
  },

  // 清理取消选择项的表单数据
  clearFormDataForItem(item) {
    const updateData = {}
    
    // 根据不同投诉项清理对应的表单字段
    switch(item) {
      case 'item1':
        updateData['formData.complaintVariables.violationDate'] = ''
        break
      case 'item2':
        updateData['formData.complaintVariables.workStartDate'] = ''
        updateData['formData.complaintVariables.workEndDate'] = ''
        updateData['formData.complaintVariables.jobPosition'] = ''
        updateData['formData.complaintVariables.monthlySalary'] = ''
        updateData['formData.complaintVariables.workMonths'] = ''
        updateData['formData.complaintVariables.customAmount1'] = ''
        break
      case 'item3':
        updateData['formData.complaintVariables.childAge'] = ''
        updateData['formData.complaintVariables.customDate1'] = ''
        break
      case 'item4':
        updateData['formData.complaintVariables.pregnancyDate'] = ''
        updateData['formData.complaintVariables.violationDate'] = ''
        break
      case 'item5':
        updateData['formData.complaintVariables.workStartDate'] = ''
        updateData['formData.complaintVariables.overtimeHours'] = ''
        break
      case 'item6':
        updateData['formData.complaintVariables.workStartDate'] = ''
        updateData['formData.complaintVariables.workEndDate'] = ''
        updateData['formData.complaintVariables.owedSalary'] = ''
        updateData['formData.complaintVariables.monthlySalary'] = ''
        updateData['formData.complaintVariables.minimumWage'] = ''
        updateData['formData.complaintVariables.customAmount1'] = ''
        break
      case 'item7':
        updateData['formData.complaintVariables.workStartDate'] = ''
        updateData['formData.complaintVariables.workEndDate'] = ''
        break
      case 'item8':
        updateData['formData.complaintVariables.workStartDate'] = ''
        updateData['formData.complaintVariables.workEndDate'] = ''
        updateData['formData.complaintVariables.owedSalary'] = ''
        break
      case 'item9':
        updateData['formData.complaintVariables.violationDate'] = ''
        updateData['formData.complaintVariables.serviceFee'] = ''
        updateData['formData.complaintVariables.monthlySalary'] = ''
        updateData['formData.complaintVariables.customAmount1'] = ''
        break
    }
    
    this.setData(updateData)
  },

  // 投诉变量输入处理
  handleComplaintVariableInput(e) {
    const variable = e.currentTarget.dataset.variable
    const value = e.detail.value
    this.setData({
      [`formData.complaintVariables.${variable}`]: value
    })
  },

  // 添加picker点击调试
  handlePickerTap(e) {
    console.log('🖱️ Picker被点击:', e.currentTarget.dataset.variable)
  },

  // 日期选择处理
  handleComplaintDateChange(e) {
    console.log('📅 日期选择触发:', e.currentTarget.dataset.variable, e.detail.value)
    
    const variable = e.currentTarget.dataset.variable
    const value = e.detail.value
    
    console.log('📅 设置日期变量:', variable, '=', value)
    
    this.setData({
      [`formData.complaintVariables.${variable}`]: value
    })
    
    console.log('📅 日期设置完成:', this.data.formData.complaintVariables[variable])
  },

  // 表单验证
  validateForm() {
    const { selectedItems, formData } = this.data
    
    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择投诉事项',
        icon: 'none'
      })
      return false
    }
    
    if (!formData.complaintVariables.complaintDate) {
      wx.showToast({
        title: '请选择投诉日期',
        icon: 'none'
      })
      return false
    }
    
    // 验证特定投诉项的必填字段
    for (let item of selectedItems) {
      if (!this.validateItemSpecificFields(item)) {
        return false
      }
    }
    
    return true
  },

  // 验证特定投诉项的必填字段
  validateItemSpecificFields(item) {
    const { complaintVariables } = this.data.formData
    
    switch(item) {
      case 'item2': // 未签劳动合同
        if (!complaintVariables.workStartDate) {
          wx.showToast({ title: '请填写入职日期', icon: 'none' })
          return false
        }
        if (!complaintVariables.jobPosition) {
          wx.showToast({ title: '请填写工作岗位', icon: 'none' })
          return false
        }
        break
      case 'item3': // 童工
        if (!complaintVariables.childAge) {
          wx.showToast({ title: '请填写童工年龄', icon: 'none' })
          return false
        }
        break
      case 'item6': // 拖欠工资
        if (!complaintVariables.owedSalary) {
          wx.showToast({ title: '请填写拖欠工资总额', icon: 'none' })
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

  // 格式化月份日期（年月格式）
  formatMonthDate(dateStr) {
    if (!dateStr) return null
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月`
  },

  // 生成投诉书内容
  generateComplaintLetter() {
    const { formData } = this.data
    const { complaintVariables } = formData
    const currentDate = this.formatDate(complaintVariables.complaintDate || new Date().toISOString().split('T')[0])
    
    let content = `劳动监察投诉书

致：劳动保障监察大队

投诉人：${formData.complainantName}
身份证号码：${formData.complainantIdCard}
工作单位：${formData.complainantWorkUnit}
住址：${formData.complainantAddress}
联系方式：${formData.complainantPhone}

被投诉单位名称：${formData.respondentName}
统一社会信用代码：${formData.respondentCreditCode}
住址：${formData.respondentAddress}
联系电话：${formData.respondentPhone}

投诉日期：${currentDate}

投诉事项及事实理由：\n`

    // 根据选择的投诉事项生成内容
    this.data.selectedItems.forEach((item, index) => {
      content += this.getComplaintItemContent(item, complaintVariables, index + 1)
    })

    content += `

综上所述，被投诉单位的上述行为违反了相关劳动法律法规，侵害了投诉人的合法权益。根据《劳动保障监察条例》的相关规定，请求贵监察大队依法调查处理，责令被投诉单位改正违法行为，切实维护劳动者的合法权益。

此致
劳动保障监察大队

投诉人：${formData.complainantName}（签名）
日期：${currentDate}

【附件清单】
根据投诉事项，请准备相关证明材料：
• 身份证复印件
• 劳动合同或工作证明
• 工资条或银行流水
• 其他相关证据材料

【温馨提示】
本投诉书由"打工者生存工具包"小程序自动生成，请根据实际情况修改个人信息并准备相关证据材料。如需法律咨询，建议联系专业律师。`

    return content
  },

  // 获取具体投诉事项内容
  getComplaintItemContent(item, variables, index) {
    const itemName = this.data.complaintItemsMap[item]
    let content = `${index}. ${itemName}\n\n`
    
    // 根据不同投诉事项，使用用户填写的数据动态生成内容
    switch(item) {
      case 'item1':
        content += this.generateItem1Content(variables)
        break
      case 'item2':
        content += this.generateItem2Content(variables)
        break
      case 'item3':
        content += this.generateItem3Content(variables)
        break
      case 'item4':
        content += this.generateItem4Content(variables)
        break
      case 'item5':
        content += this.generateItem5Content(variables)
        break
      case 'item6':
        content += this.generateItem6Content(variables)
        break
      case 'item7':
        content += this.generateItem7Content(variables)
        break
      case 'item8':
        content += this.generateItem8Content(variables)
        break
      case 'item9':
        content += this.generateItem9Content(variables)
        break
      default:
        content += '事实与理由：[请填写具体事实和理由]\n\n投诉请求：[请填写投诉请求]'
    }
    
    return content
  },

  // 生成规章制度违法内容
  generateItem1Content(variables) {
    const violationDate = this.formatDate(variables.violationDate) || '[请填写制定日期]'
    return `事实与理由：被投诉单位于${violationDate}制定的内部规章制度违反劳动法律法规，侵害了劳动者的合法权益。

投诉请求：请求劳动保障监察部门责令被投诉单位修改违法规章制度，纠正违法行为。

附件：违法规章制度复印件、劳动合同复印件\n\n`
  },

  // 生成未签劳动合同内容  
  generateItem2Content(variables) {
    const workStartDate = this.formatDate(variables.workStartDate) || '[请填写入职日期]'
    const workEndDate = this.formatDate(variables.workEndDate) || '[请填写截至日期]'
    const jobPosition = variables.jobPosition || '[请填写岗位]'
    const monthlySalary = variables.monthlySalary || '[请填写月工资]'
    const workMonths = variables.workMonths || '[请填写工作月数]'
    const compensation = variables.customAmount1 || '[请填写二倍工资差额]'
    
    return `事实与理由：
投诉人于${workStartDate}入职被投诉单位，担任${jobPosition}岗位，月工资${monthlySalary}元。截至${workEndDate}，投诉人已工作${workMonths}个月，但被投诉单位始终未与投诉人订立书面劳动合同。

根据《中华人民共和国劳动合同法》第十条规定："建立劳动关系，应当订立书面劳动合同。已建立劳动关系，未同时订立书面劳动合同的，应当自用工之日起一个月内订立书面劳动合同。"第八十二条规定："用人单位自用工之日起超过一个月不满一年未与劳动者订立书面劳动合同的，应当向劳动者每月支付二倍工资。"

被投诉单位的行为明显违反了上述法律规定。

投诉请求：
1. 请求劳动保障监察部门责令被投诉单位立即与投诉人补订书面劳动合同；
2. 责令被投诉单位支付未签订书面劳动合同的二倍工资差额${compensation}元；
3. 依法对被投诉单位的违法行为予以处罚。

法律依据：《中华人民共和国劳动合同法》第十条、第八十二条
附件：工资银行流水、工作证复印件、考勤表

\n`
  },

  // 其他投诉事项生成函数
  generateItem3Content(variables) {
    const childAge = variables.childAge || '[请填写年龄]'
    const birthDate = this.formatDate(variables.customDate1) || '[请填写出生日期]'
    
    return `事实与理由：被投诉单位雇佣一名年龄为${childAge}岁的员工，出生日期为${birthDate}，未满16周岁，属于童工，违反相关法律规定。

投诉请求：请求劳动保障监察部门查处被投诉单位使用童工的行为，责令其清退童工，并依法予以处罚。

附件：相关证明材料\n\n`
  },

  generateItem4Content(variables) {
    const pregnancyDate = this.formatDate(variables.pregnancyDate) || '[请填写怀孕日期]'
    const violationDate = this.formatDate(variables.violationDate) || '[请填写违法日期]'
    
    return `事实与理由：投诉人于${pregnancyDate}确诊怀孕，属于孕期女职工。被投诉单位于${violationDate}违反女职工特殊劳动保护规定。

投诉请求：请求劳动保障监察部门责令被投诉单位立即停止违法行为，保障女职工合法权益。

附件：医院证明、相关工作记录\n\n`
  },

  generateItem5Content(variables) {
    const startDate = this.formatDate(variables.workStartDate) || '[请填写开始日期]'
    const overtimeHours = variables.overtimeHours || '[请填写加班小时]'
    
    return `事实与理由：自${startDate}起，被投诉单位强制要求每日延长工作时间${overtimeHours}小时，且未安排补休，也未支付加班费，违反劳动法相关规定。

投诉请求：请求劳动保障监察部门责令被投诉单位改正违法工时制度，并依法支付加班费。

💡 提示：可使用小程序内"加班费计算器"功能计算应得加班费。

附件：劳动合同、考勤记录复印件\n\n`
  },

  generateItem6Content(variables) {
    const startMonth = this.formatMonthDate(variables.workStartDate) || '[请填写起始月]'
    const endMonth = this.formatMonthDate(variables.workEndDate) || '[请填写结束月]'
    const owedSalary = variables.owedSalary || '[请填写拖欠金额]'
    const monthlySalary = variables.monthlySalary || '[请填写月均工资]'
    const minimumWage = variables.minimumWage || '[请填写最低工资标准]'
    const wageDiff = variables.customAmount1 || '[请填写差额]'
    
    return `事实与理由：投诉人${startMonth}至${endMonth}工资共计${owedSalary}元（月均${monthlySalary}元），被投诉单位至今未支付。当地最低工资标准为每月${minimumWage}元，实际工资低于最低工资标准，违反劳动法相关规定。

投诉请求：请求劳动保障监察部门责令被投诉单位立即支付拖欠的工资${owedSalary}元，并补足低于最低工资标准的差额${wageDiff}元。

附件：工资条复印件、银行流水记录\n\n`
  },

  generateItem7Content(variables) {
    const workStartDate = this.formatDate(variables.workStartDate) || '[请填写入职日期]'
    const workEndDate = this.formatDate(variables.workEndDate) || '[请填写截止日期]'
    const startMonth = this.formatMonthDate(variables.workStartDate) || '[请填写开始月]'
    const endMonth = this.formatMonthDate(variables.workEndDate) || '[请填写结束月]'
    
    return `事实与理由：投诉人于${workStartDate}入职被投诉单位，但截至${workEndDate}，单位并未依法缴纳社会保险费，违反《社会保险法》相关规定。

投诉请求：请求劳动行政部门责令被投诉单位补缴自${startMonth}至${endMonth}欠缴的社会保险费。

💡 提示：可使用小程序内"社保计算器"功能计算具体缴费金额。

附件：劳动合同、社保缴费记录查询截图\n\n`
  },

  generateItem8Content(variables) {
    const startMonth = this.formatMonthDate(variables.workStartDate) || '[请填写开始月]'
    const endMonth = this.formatMonthDate(variables.workEndDate) || '[请填写结束月]'
    const owedSalary = variables.owedSalary || '[请填写拖欠金额]'
    
    return `事实与理由：投诉人通过劳务派遣工作，但劳务派遣公司未按月支付工资，自${startMonth}至${endMonth}工资共计${owedSalary}元至今未发，违反《劳动合同法》相关规定。

投诉请求：请求劳动行政部门责令单位改正违法行为，并支付拖欠工资${owedSalary}元。

附件：劳务派遣协议复印件、工作记录、工资欠发证明\n\n`
  },

  generateItem9Content(variables) {
    const violationDate = this.formatDate(variables.violationDate) || '[请填写日期]'
    const serviceFee = variables.serviceFee || '[请填写服务费]'
    const promisedSalary = variables.monthlySalary || '[请填写承诺月薪]'
    const actualSalary = variables.customAmount1 || '[请填写实际月薪]'
    
    return `事实与理由：投诉人于${violationDate}到被投诉单位寻求职业介绍服务，该机构收取服务费${serviceFee}元，承诺月薪${promisedSalary}元，但实际月薪仅${actualSalary}元，与描述严重不符，违反相关规定。

投诉请求：请求劳动保障监察部门查处被投诉单位的违法经营行为，责令其退还服务费${serviceFee}元，并依法予以处罚。

附件：服务费收据、岗位推荐宣传单复印件\n\n`
  },

  // 生成文书
  handleGenerateDocument() {
    if (!this.validateForm()) {
      return
    }

    const documentContent = this.generateComplaintLetter()
    
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
      path: `/pages/docgen/complaint-letter/complaint-letter`,
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
