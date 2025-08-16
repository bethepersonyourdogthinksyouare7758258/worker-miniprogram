// pages/docgen/docgen-form.js
Page({
  data: {
    formType: '',
    title: '',
    formData: {}, // Minimal formData
    documentContent: '',
    showPreview: false
  },

  onLoad(options) {
    const type = options.type || 'arbitration'
    const title = this.getTitleByType(type)
    
    this.setData({
      formType: type,
      title: title,
      formData: {} // Ensure formData is empty or minimal
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
})
