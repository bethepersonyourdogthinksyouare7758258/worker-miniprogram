Page({
  data: {
    // 工资类型选择
    salaryType: null, // 'time' 或 'piece'
    
    // 记录方式选择
    recordType: null, // 'manual' 或 'calendar'
    
    // 计时工资数据
    monthlySalary: null,
    workdayHours: null,
    weekendHours: null,
    holidayHours: null,
    
    // 计件工资数据
    piecePrice: null,
    workdayPieces: null,
    weekendPieces: null,
    holidayPieces: null,
    
    // 日历记录数据
    calendarWorkdayHours: 0,
    calendarWeekendHours: 0,
    calendarHolidayHours: 0,
    hasCalendarData: false,
    
    // 日期选择器数据
    selectedDate: null,
    startTime: null,
    endTime: null,
    calculatedHours: '0.00',
    overtimeRecords: [],
    
    // 日历模态框数据
    showCalendarModal: false,
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    calendarDays: [],
    selectedCalendarDate: null,
    calendarStartTime: null,
    calendarEndTime: null,
    calendarCalculatedHours: '0.00',
    
    // 计算结果
    result: null,
    workdayOvertime: 0,
    weekendOvertime: 0,
    holidayOvertime: 0,
    
         // UI状态
     showDetail: false,
     showImportantNotice: false,
     
     // 工作时间设置
     workStartTime: '09:00',
     workEndTime: '18:00',
     showWorkTimeModal: false
  },

  // 选择工资类型
  selectSalaryType: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      salaryType: type,
      recordType: null, // 重置记录方式
      result: null // 重置结果
    });
  },

  // 选择记录方式
  selectRecordType: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      recordType: type,
      result: null // 重置结果
    });
  },

  // 输入框绑定
  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  // 日期选择器变化
  bindDateChange: function(e) {
    const selectedDate = e.detail.value;
    
    // 检查是否已有加班记录
    const existingRecord = this.data.overtimeRecords.find(record => record.date === selectedDate);
    
    this.setData({
      selectedDate: selectedDate,
      startTime: existingRecord ? existingRecord.startTime : null,
      endTime: existingRecord ? existingRecord.endTime : null,
      calculatedHours: existingRecord ? existingRecord.hours.toFixed(2) : '0.00'
    });
  },

  // 开始时间变化
  bindStartTimeChange: function(e) {
    this.setData({
      startTime: e.detail.value
    });
    this.calculateHours();
  },

  // 结束时间变化
  bindEndTimeChange: function(e) {
    this.setData({
      endTime: e.detail.value
    });
    this.calculateHours();
  },

  // 计算加班时长
  calculateHours: function() {
    const { startTime, endTime } = this.data;
    
    if (!startTime || !endTime) {
      this.setData({
        calculatedHours: '0.00'
      });
      return;
    }
    
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    
    if (end <= start) {
      end.setDate(end.getDate() + 1); // 跨天处理
    }
    
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    this.setData({
      calculatedHours: diffHours.toFixed(2)
    });
  },

  // 保存加班时间
  saveOvertimeTime: function() {
    const { selectedDate, startTime, endTime, calculatedHours, overtimeRecords } = this.data;
    
    if (!selectedDate || !startTime || !endTime) {
      wx.showToast({
        title: '请选择完整的加班时间',
        icon: 'none'
      });
      return;
    }
    
    const hours = parseFloat(calculatedHours);
    if (hours <= 0) {
      wx.showToast({
        title: '加班时长必须大于0',
        icon: 'none'
      });
      return;
    }
    
    // 判断加班类型
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    let type = '工作日';
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      type = '休息日';
    }
    
    // 这里可以添加法定节假日的判断逻辑
    // 暂时简单处理，实际应用中需要维护节假日数据
    
    const newRecord = {
      date: selectedDate,
      startTime: startTime,
      endTime: endTime,
      hours: hours,
      type: type
    };
    
    // 检查是否已存在该日期的记录
    const existingIndex = overtimeRecords.findIndex(record => record.date === selectedDate);
    let updatedRecords;
    
    if (existingIndex >= 0) {
      // 更新现有记录
      updatedRecords = [...overtimeRecords];
      updatedRecords[existingIndex] = newRecord;
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      });
    } else {
      // 添加新记录
      updatedRecords = [...overtimeRecords, newRecord];
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });
    }
    
    this.setData({
      overtimeRecords: updatedRecords
    });
    
    this.updateOvertimeSummary();
  },

  // 清空时间输入
  clearTimeInput: function() {
    this.setData({
      startTime: null,
      endTime: null,
      calculatedHours: '0.00'
    });
  },

  // 清空所有加班记录
  clearAllOvertimeRecords: function() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有已记录的加班时间吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            overtimeRecords: [],
            selectedDate: null,
            startTime: null,
            endTime: null,
            calculatedHours: '0.00'
          });
          this.updateOvertimeSummary();
          this.generateCalendar(); // 重新生成日历
          wx.showToast({
            title: '已清空全部记录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 显示日历模态框
  showCalendar: function() {
    this.generateCalendar();
    this.setData({
      showCalendarModal: true
    });
  },

  // 隐藏日历模态框
  hideCalendar: function() {
    this.setData({
      showCalendarModal: false,
      selectedCalendarDate: null,
      calendarStartTime: null,
      calendarEndTime: null,
      calendarCalculatedHours: '0.00'
    });
  },

  // 生成日历数据
  generateCalendar: function() {
    const { currentYear, currentMonth, overtimeRecords } = this.data;
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendarDays = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dateStr = this.formatDate(currentDate);
      const existingRecord = overtimeRecords.find(record => record.date === dateStr);
      
      calendarDays.push({
        date: dateStr,
        day: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === currentMonth - 1,
        isSelected: false,
        hasOvertime: !!existingRecord,
        isToday: this.isSameDate(currentDate, today)
      });
    }
    
    this.setData({
      calendarDays: calendarDays
    });
  },

  // 格式化日期
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 判断是否为同一天
  isSameDate: function(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  },

  // 选择日期
  selectDate: function(e) {
    const date = e.currentTarget.dataset.date;
    const { calendarDays, overtimeRecords } = this.data;
    
    // 更新选中状态
    const updatedDays = calendarDays.map(day => ({
      ...day,
      isSelected: day.date === date
    }));
    
    // 查找是否已有记录
    const existingRecord = overtimeRecords.find(record => record.date === date);
    
    this.setData({
      calendarDays: updatedDays,
      selectedCalendarDate: date,
      calendarStartTime: existingRecord ? existingRecord.startTime : null,
      calendarEndTime: existingRecord ? existingRecord.endTime : null,
      calendarCalculatedHours: existingRecord ? existingRecord.hours.toFixed(2) : '0.00'
    });
  },

  // 上个月
  prevMonth: function() {
    let { currentYear, currentMonth } = this.data;
    if (currentMonth === 1) {
      currentMonth = 12;
      currentYear--;
    } else {
      currentMonth--;
    }
    
    this.setData({
      currentYear: currentYear,
      currentMonth: currentMonth
    });
    this.generateCalendar();
  },

  // 下个月
  nextMonth: function() {
    let { currentYear, currentMonth } = this.data;
    if (currentMonth === 12) {
      currentMonth = 1;
      currentYear++;
    } else {
      currentMonth++;
    }
    
    this.setData({
      currentYear: currentYear,
      currentMonth: currentMonth
    });
    this.generateCalendar();
  },

  // 日历开始时间变化
  bindCalendarStartTimeChange: function(e) {
    this.setData({
      calendarStartTime: e.detail.value
    });
    this.calculateCalendarHours();
    // 自动保存
    this.autoSaveCalendarOvertime();
  },

  // 日历结束时间变化
  bindCalendarEndTimeChange: function(e) {
    this.setData({
      calendarEndTime: e.detail.value
    });
    this.calculateCalendarHours();
    // 自动保存
    this.autoSaveCalendarOvertime();
  },

  // 计算日历加班时长
  calculateCalendarHours: function() {
    const { calendarStartTime, calendarEndTime } = this.data;
    
    if (!calendarStartTime || !calendarEndTime) {
      this.setData({
        calendarCalculatedHours: '0.00'
      });
      return;
    }
    
    const start = new Date(`2000-01-01 ${calendarStartTime}`);
    const end = new Date(`2000-01-01 ${calendarEndTime}`);
    
    if (end <= start) {
      end.setDate(end.getDate() + 1); // 跨天处理
    }
    
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    this.setData({
      calendarCalculatedHours: diffHours.toFixed(2)
    });
  },

  // 自动保存日历加班时间
  autoSaveCalendarOvertime: function() {
    const { selectedCalendarDate, calendarStartTime, calendarEndTime, calendarCalculatedHours, overtimeRecords } = this.data;
    
    if (!selectedCalendarDate || !calendarStartTime || !calendarEndTime) {
      return; // 不完整时不自动保存
    }
    
    const hours = parseFloat(calendarCalculatedHours);
    if (hours <= 0) {
      return; // 时长无效时不自动保存
    }
    
    // 智能识别加班类型和剔除正常上班时间
    const overtimeInfo = this.analyzeOvertimeType(selectedCalendarDate, calendarStartTime, calendarEndTime, hours);
    
    if (overtimeInfo.isValid) {
      const newRecord = {
        date: selectedCalendarDate,
        startTime: calendarStartTime,
        endTime: calendarEndTime,
        hours: overtimeInfo.overtimeHours,
        type: overtimeInfo.type,
        originalHours: hours,
        normalWorkHours: overtimeInfo.normalWorkHours
      };
      
      // 检查是否已存在该日期的记录
      const existingIndex = overtimeRecords.findIndex(record => record.date === selectedCalendarDate);
      let updatedRecords;
      
      if (existingIndex >= 0) {
        // 更新现有记录
        updatedRecords = [...overtimeRecords];
        updatedRecords[existingIndex] = newRecord;
      } else {
        // 添加新记录
        updatedRecords = [...overtimeRecords, newRecord];
      }
      
      this.setData({
        overtimeRecords: updatedRecords
      });
      
      this.updateOvertimeSummary();
      this.generateCalendar(); // 重新生成日历以更新指示器
      
      // 显示加班类型和剔除信息
      this.showOvertimeAnalysis(overtimeInfo);
    }
  },

  // 智能分析加班类型和剔除正常上班时间
  analyzeOvertimeType: function(date, startTime, endTime, totalHours) {
    const workDate = new Date(date);
    const dayOfWeek = workDate.getDay();
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    
    // 使用用户设置的工作时间
    const normalWorkStart = parseInt(this.data.workStartTime.split(':')[0]);
    const normalWorkEnd = parseInt(this.data.workEndTime.split(':')[0]);
    const normalWorkHours = normalWorkEnd - normalWorkStart;
    
    let type = '';
    let overtimeHours = totalHours;
    let normalWorkHoursDeducted = 0;
    let isValid = true;
    let message = '';
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // 周末加班
      type = '休息日';
      overtimeHours = totalHours; // 周末全天都算加班
      message = `识别为${type}加班，时长：${overtimeHours}小时`;
    } else {
      // 工作日加班
      type = '工作日';
      
      // 判断是否在正常上班时间内
      if (startHour >= normalWorkStart && endHour <= normalWorkEnd) {
        // 完全在正常上班时间内，需要剔除
        if (totalHours <= normalWorkHours) {
          // 完全在正常上班时间内，不算加班
          isValid = false;
          message = '该时间段为正常上班时间，已自动剔除';
        } else {
          // 部分超出正常上班时间
          normalWorkHoursDeducted = normalWorkHours;
          overtimeHours = totalHours - normalWorkHours;
          message = `工作日加班，已剔除正常上班时间${normalWorkHours}小时，实际加班时长：${overtimeHours}小时`;
        }
      } else if (startHour < normalWorkStart || endHour > normalWorkEnd) {
        // 在正常上班时间外，全部算加班
        overtimeHours = totalHours;
        message = `工作日加班，时长：${overtimeHours}小时`;
      } else {
        // 跨正常上班时间
        if (startHour < normalWorkStart) {
          // 早于正常上班时间
          const earlyHours = normalWorkStart - startHour;
          overtimeHours = earlyHours;
          normalWorkHoursDeducted = totalHours - earlyHours;
        } else {
          // 晚于正常下班时间
          const lateHours = endHour - normalWorkEnd;
          overtimeHours = lateHours;
          normalWorkHoursDeducted = totalHours - lateHours;
        }
        message = `工作日加班，已剔除正常上班时间${normalWorkHoursDeducted}小时，实际加班时长：${overtimeHours}小时`;
      }
    }
    
    // 检查法定节假日（这里可以扩展节假日数据库）
    const isHoliday = this.checkHoliday(date);
    if (isHoliday) {
      type = '法定节假日';
      overtimeHours = totalHours; // 节假日全天都算加班
      message = `识别为${type}加班，时长：${overtimeHours}小时`;
    }
    
    return {
      type: type,
      overtimeHours: overtimeHours,
      normalWorkHours: normalWorkHoursDeducted,
      isValid: isValid,
      message: message,
      originalHours: totalHours
    };
  },

  // 检查是否为法定节假日（简化版本，实际应用中需要完整的节假日数据库）
  checkHoliday: function(date) {
    const holidays = [
      '2024-01-01', // 元旦
      '2024-02-10', '2024-02-11', '2024-02-12', '2024-02-13', '2024-02-14', '2024-02-15', '2024-02-16', '2024-02-17', // 春节
      '2024-04-04', '2024-04-05', '2024-04-06', // 清明节
      '2024-05-01', '2024-05-02', '2024-05-03', '2024-05-04', '2024-05-05', // 劳动节
      '2024-06-08', '2024-06-09', '2024-06-10', // 端午节
      '2024-09-15', '2024-09-16', '2024-09-17', // 中秋节
      '2024-10-01', '2024-10-02', '2024-10-03', '2024-10-04', '2024-10-05', '2024-10-06', '2024-10-07', // 国庆节
      '2025-01-01', // 元旦
      '2025-01-28', '2025-01-29', '2025-01-30', '2025-01-31', '2025-02-01', '2025-02-02', '2025-02-03', '2025-02-04', '2025-02-05', '2025-02-06', // 春节
      '2025-04-04', '2025-04-05', '2025-04-06', // 清明节
      '2025-05-01', '2025-05-02', '2025-05-03', // 劳动节
      '2025-05-31', '2025-06-01', '2025-06-02', // 端午节
      '2025-10-01', '2025-10-02', '2025-10-03', '2025-10-04', '2025-10-05', '2025-10-06', '2025-10-07', // 国庆节
    ];
    
    return holidays.includes(date);
  },

  // 显示加班分析结果
  showOvertimeAnalysis: function(overtimeInfo) {
    if (!overtimeInfo.isValid) {
      wx.showModal({
        title: '时间分析',
        content: overtimeInfo.message,
        showCancel: false,
        confirmText: '知道了'
      });
      return;
    }
    
    let content = overtimeInfo.message;
    if (overtimeInfo.normalWorkHours > 0) {
      content += `\n\n已自动剔除正常上班时间${overtimeInfo.normalWorkHours}小时`;
    }
    
    wx.showModal({
      title: '加班时间分析',
      content: content,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 显示工作时间设置
  showWorkTimeSettings: function() {
    this.setData({
      showWorkTimeModal: true
    });
  },

  // 隐藏工作时间设置
  hideWorkTimeSettings: function() {
    this.setData({
      showWorkTimeModal: false
    });
  },

  // 工作时间开始时间变化
  bindWorkStartTimeChange: function(e) {
    this.setData({
      workStartTime: e.detail.value
    });
  },

  // 工作时间结束时间变化
  bindWorkEndTimeChange: function(e) {
    this.setData({
      workEndTime: e.detail.value
    });
  },

  // 保存工作时间设置
  saveWorkTimeSettings: function() {
    const { workStartTime, workEndTime } = this.data;
    
    // 验证时间设置
    const startHour = parseInt(workStartTime.split(':')[0]);
    const endHour = parseInt(workEndTime.split(':')[0]);
    
    if (startHour >= endHour) {
      wx.showToast({
        title: '结束时间必须晚于开始时间',
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      showWorkTimeModal: false
    });
    
    wx.showToast({
      title: '设置已保存',
      icon: 'success'
    });
  },

  // 保存日历加班时间
  saveCalendarOvertime: function() {
    const { selectedCalendarDate, calendarStartTime, calendarEndTime, calendarCalculatedHours, overtimeRecords } = this.data;
    
    if (!selectedCalendarDate || !calendarStartTime || !calendarEndTime) {
      wx.showToast({
        title: '请选择完整的加班时间',
        icon: 'none'
      });
      return;
    }
    
    const hours = parseFloat(calendarCalculatedHours);
    if (hours <= 0) {
      wx.showToast({
        title: '加班时长必须大于0',
        icon: 'none'
      });
      return;
    }
    
    // 智能识别加班类型和剔除正常上班时间
    const overtimeInfo = this.analyzeOvertimeType(selectedCalendarDate, calendarStartTime, calendarEndTime, hours);
    
    if (overtimeInfo.isValid) {
      const newRecord = {
        date: selectedCalendarDate,
        startTime: calendarStartTime,
        endTime: calendarEndTime,
        hours: overtimeInfo.overtimeHours,
        type: overtimeInfo.type,
        originalHours: hours,
        normalWorkHours: overtimeInfo.normalWorkHours
      };
      
      // 检查是否已存在该日期的记录
      const existingIndex = overtimeRecords.findIndex(record => record.date === selectedCalendarDate);
      let updatedRecords;
      
      if (existingIndex >= 0) {
        // 更新现有记录
        updatedRecords = [...overtimeRecords];
        updatedRecords[existingIndex] = newRecord;
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        });
      } else {
        // 添加新记录
        updatedRecords = [...overtimeRecords, newRecord];
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        });
      }
      
      this.setData({
        overtimeRecords: updatedRecords
      });
      
      this.updateOvertimeSummary();
      this.generateCalendar(); // 重新生成日历以更新指示器
      
      // 显示加班类型和剔除信息
      this.showOvertimeAnalysis(overtimeInfo);
    } else {
      wx.showModal({
        title: '时间分析',
        content: overtimeInfo.message,
        showCancel: false,
        confirmText: '知道了'
      });
    }
  },

  // 清空当日加班时间
  clearDayOvertime: function() {
    const { selectedCalendarDate, overtimeRecords } = this.data;
    
    if (!selectedCalendarDate) {
      wx.showToast({
        title: '请先选择日期',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: '确认清空',
      content: `确定要清空 ${selectedCalendarDate} 的加班时间吗？`,
      success: (res) => {
        if (res.confirm) {
          const updatedRecords = overtimeRecords.filter(record => record.date !== selectedCalendarDate);
          
          this.setData({
            overtimeRecords: updatedRecords,
            calendarStartTime: null,
            calendarEndTime: null,
            calendarCalculatedHours: '0.00'
          });
          
          this.updateOvertimeSummary();
          this.generateCalendar(); // 重新生成日历以更新指示器
          
          wx.showToast({
            title: '已清空当日记录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 取消日历选择
  cancelCalendarSelection: function() {
    this.setData({
      selectedCalendarDate: null,
      calendarStartTime: null,
      calendarEndTime: null,
      calendarCalculatedHours: '0.00'
    });
    
    // 清除选中状态
    const { calendarDays } = this.data;
    const updatedDays = calendarDays.map(day => ({
      ...day,
      isSelected: false
    }));
    
    this.setData({
      calendarDays: updatedDays
    });
  },

  // 删除加班记录
  deleteOvertimeRecord: function(e) {
    const index = e.currentTarget.dataset.index;
    const overtimeRecords = [...this.data.overtimeRecords];
    overtimeRecords.splice(index, 1);
    
    this.setData({
      overtimeRecords: overtimeRecords
    });
    
    this.updateOvertimeSummary();
    this.generateCalendar(); // 重新生成日历以更新指示器
    
    wx.showToast({
      title: '删除成功',
      icon: 'success'
    });
  },

  // 更新加班汇总
  updateOvertimeSummary: function() {
    const { overtimeRecords } = this.data;
    
    let workdayHours = 0;
    let weekendHours = 0;
    let holidayHours = 0;
    
    overtimeRecords.forEach(record => {
      if (record.type === '工作日') {
        workdayHours += record.hours;
      } else if (record.type === '休息日') {
        weekendHours += record.hours;
      } else if (record.type === '法定节假日') {
        holidayHours += record.hours;
      }
    });
    
    this.setData({
      calendarWorkdayHours: workdayHours.toFixed(2),
      calendarWeekendHours: weekendHours.toFixed(2),
      calendarHolidayHours: holidayHours.toFixed(2),
      hasCalendarData: overtimeRecords.length > 0
    });
  },

  // 计算加班费
  calculate: function() {
    const { salaryType, recordType, monthlySalary, workdayHours, weekendHours, holidayHours, 
            piecePrice, workdayPieces, weekendPieces, holidayPieces,
            calendarWorkdayHours, calendarWeekendHours, calendarHolidayHours, hasCalendarData } = this.data;

    if (!salaryType) {
      wx.showToast({
        title: '请选择工资类型',
        icon: 'none'
      });
      return;
    }

    if (salaryType === 'time') {
      // 计时工资计算
      if (!monthlySalary) {
        wx.showToast({
          title: '请输入月工资',
          icon: 'none'
        });
        return;
      }

      if (!recordType) {
        wx.showToast({
          title: '请选择记录方式',
          icon: 'none'
        });
        return;
      }

      let wHours = 0, wEndHours = 0, hHours = 0;

      if (recordType === 'manual') {
        if (!workdayHours && !weekendHours && !holidayHours) {
          wx.showToast({
            title: '请至少输入一种加班时间',
            icon: 'none'
          });
          return;
        }
        wHours = parseFloat(workdayHours) || 0;
        wEndHours = parseFloat(weekendHours) || 0;
        hHours = parseFloat(holidayHours) || 0;
      } else if (recordType === 'calendar') {
        if (!hasCalendarData) {
          wx.showToast({
            title: '请先记录加班时间',
            icon: 'none'
          });
          return;
        }
        wHours = calendarWorkdayHours;
        wEndHours = calendarWeekendHours;
        hHours = calendarHolidayHours;
      }

      // 计时工资计算公式
      const monthlySalaryVal = parseFloat(monthlySalary);
      const dailySalary = monthlySalaryVal / 21.75;
      const hourlySalary = dailySalary / 8;

      const workdayOvertime = hourlySalary * wHours * 1.5; // 150%
      const weekendOvertime = hourlySalary * wEndHours * 2.0; // 200%
      const holidayOvertime = hourlySalary * hHours * 3.0; // 300%

      const totalOvertime = workdayOvertime + weekendOvertime + holidayOvertime;

      this.setData({
        result: totalOvertime.toFixed(2),
        workdayOvertime: workdayOvertime.toFixed(2),
        weekendOvertime: weekendOvertime.toFixed(2),
        holidayOvertime: holidayOvertime.toFixed(2),
        showDetail: false
      });

    } else if (salaryType === 'piece') {
      // 计件工资计算
      if (!piecePrice) {
        wx.showToast({
          title: '请输入标准件单价',
          icon: 'none'
        });
        return;
      }

      if (!workdayPieces && !weekendPieces && !holidayPieces) {
        wx.showToast({
          title: '请至少输入一种加班件数',
          icon: 'none'
        });
        return;
      }

      const piecePriceVal = parseFloat(piecePrice);
      const wPieces = parseFloat(workdayPieces) || 0;
      const wEndPieces = parseFloat(weekendPieces) || 0;
      const hPieces = parseFloat(holidayPieces) || 0;

      // 计件工资计算公式
      const workdayOvertime = wPieces * piecePriceVal * 0.5; // 50%额外
      const weekendOvertime = wEndPieces * piecePriceVal * 1.0; // 100%额外
      const holidayOvertime = hPieces * piecePriceVal * 2.0; // 200%额外

      const totalOvertime = workdayOvertime + weekendOvertime + holidayOvertime;

      this.setData({
        result: totalOvertime.toFixed(2),
        workdayOvertime: workdayOvertime.toFixed(2),
        weekendOvertime: weekendOvertime.toFixed(2),
        holidayOvertime: holidayOvertime.toFixed(2),
        showDetail: false
      });
    }
  },

  // 切换详细说明
  toggleDetail: function() {
    this.setData({
      showDetail: !this.data.showDetail
    });
  },

  // 切换重要说明显示
  toggleImportantNotice: function() {
    this.setData({
      showImportantNotice: !this.data.showImportantNotice
    });
  },

  // 复制结果
  copyResult: function() {
    if (this.data.result === null) {
      wx.showToast({
        title: '没有计算结果可复制',
        icon: 'none'
      });
      return;
    }

    const { salaryType, result, workdayOvertime, weekendOvertime, holidayOvertime } = this.data;
    
    let resultText = `【加班费计算结果】\n总计加班费：${result} 元\n\n`;
    
    if (salaryType === 'time') {
      resultText += `工作日加班费：${workdayOvertime} 元\n`;
      resultText += `休息日加班费：${weekendOvertime} 元\n`;
      resultText += `法定节假日加班费：${holidayOvertime} 元`;
    } else if (salaryType === 'piece') {
      resultText += `工作日加班费：${workdayOvertime} 元\n`;
      resultText += `休息日加班费：${weekendOvertime} 元\n`;
      resultText += `法定节假日加班费：${holidayOvertime} 元`;
    }

    wx.setClipboardData({
      data: resultText,
      success: function() {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        });
      },
      fail: function() {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
      }
    });
  },

  // 分享功能
  onShareAppMessage: function () {
    const { result } = this.data;
    const shareTitle = result ? `我用加班费计算器算出了${result}元加班费，快来试试吧！` : '加班费计算器 - 快来计算你的加班费！';
    
    return {
      title: shareTitle,
      path: '/overtime-pay/overtime-pay',
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
          title: '分享取消',
          icon: 'none'
        });
      }
    };
  }
});
