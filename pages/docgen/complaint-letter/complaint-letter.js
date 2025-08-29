// pages/docgen/complaint-letter/complaint-letter.js
Page({
  data: {
    title: '劳动监察投诉书',
    selectedItems: [], // 选中的投诉项目数组
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

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },

  // 投诉事项选择处理
  handleComplaintItemSelect(e) {
    const item = e.currentTarget.dataset.item
    let selectedItems = [...this.data.selectedItems]
    let formSelectedItems = [...this.data.formData.selectedComplaintItems]
    
    const index = selectedItems.indexOf(item)
    if (index > -1) {
      // 取消选择
      selectedItems.splice(index, 1)
      formSelectedItems.splice(formSelectedItems.indexOf(item), 1)
    } else {
      // 添加选择
      selectedItems.push(item)
      formSelectedItems.push(item)
    }
    
    // 同步更新两个数组
    this.setData({
      selectedItems: selectedItems,
      'formData.selectedComplaintItems': formSelectedItems
    })
    
    wx.showToast({
      title: `✨ 已选择 ${selectedItems.length} 项`,
      icon: 'none',
      duration: 1500
    })
  },

  // 投诉变量输入处理
  handleComplaintVariableInput(e) {
    const variable = e.currentTarget.dataset.variable
    const value = e.detail.value
    this.setData({
      [`formData.complaintVariables.${variable}`]: value
    })
  },

  // 日期选择处理
  handleComplaintDateChange(e) {
    const variable = e.currentTarget.dataset.variable
    const value = e.detail.value
    this.setData({
      [`formData.complaintVariables.${variable}`]: value
    })
  },

  // 表单验证
  validateForm() {
    const { formData } = this.data
    
    if (formData.selectedComplaintItems.length === 0) {
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
    
    let content = `劳动监察投诉书

投诉人：${formData.complainantName}
身份证号码：${formData.complainantIdCard}
工作单位：${formData.complainantWorkUnit}
住址：${formData.complainantAddress}
联系方式：${formData.complainantPhone}

被投诉人单位名称：${formData.respondentName}
统一社会信用代码：${formData.respondentCreditCode}
住址：${formData.respondentAddress}
联系电话：${formData.respondentPhone}

投诉事项：\n`

    // 根据选择的投诉事项生成内容
    formData.selectedComplaintItems.forEach((item, index) => {
      content += this.getComplaintItemContent(item, complaintVariables, index + 1)
    })

    content += `\n此致
${formData.respondentAddress.includes('省') ? formData.respondentAddress.split('省')[0] + '省' : formData.respondentAddress.split('市')[0] + '市'}劳动保障监察大队

投诉人：${formData.complainantName}
日期：${this.formatDate(formData.complaintVariables.complaintDate || new Date().toISOString().split('T')[0])}`

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
    
    return `事实与理由：投诉人于${workStartDate}入职被投诉单位，担任${jobPosition}岗位，月工资${monthlySalary}元。截至${workEndDate}，已工作${workMonths}个月，但被投诉单位始终未与本人订立书面劳动合同，违反《劳动合同法》相关规定。

投诉请求：请求劳动保障监察部门责令被投诉单位立即与投诉人补订书面劳动合同，并支付二倍工资差额${compensation}元。

💡 提示：可使用小程序内"双倍工资计算器"功能计算准确金额。

附件：工资银行流水、工作证复印件、考勤表\n\n`
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
