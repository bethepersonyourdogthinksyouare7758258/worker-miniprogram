Component({
  properties: {
    settings: {
      type: Object,
      value: {}
    }
  },

  data: {
    activeTab: 'housing',
    housingTypeOptions: ['租房', '购房'],
    housingLocationOptions: ['市中心', '郊区'],
    housingSizeOptions: ['合租', '小户型', '大户型'],
    loanTermOptions: [10, 15, 20, 25, 30],
    transportTypeOptions: ['公共交通', '私家车', '电动车', '自行车', '步行'],
    entertainmentLevelOptions: ['极简生活', '基本娱乐', '中等娱乐', '丰富娱乐'],
    educationTypeOptions: ['幼儿园', '小学', '初中', '高中', '国际学校'],
    
    housingTypeIndex: 0,
    housingLocationIndex: 0,
    housingSizeIndex: 0,
    loanTermIndex: 4,
    transportTypeIndex: 0,
    entertainmentLevelIndex: 2,
    educationTypeIndexes: []
  },

  observers: {
    'settings.childrenCount': function(count) {
      const currentCount = this.data.settings.educationTypes.length;
      if (currentCount < count) {
        const newTypes = [...this.data.settings.educationTypes];
        for (let i = currentCount; i < count; i++) {
          newTypes.push('kindergarten');
        }
        this.triggerEvent('settingChange', { key: 'educationTypes', value: newTypes });
      } else if (currentCount > count) {
        this.triggerEvent('settingChange', { key: 'educationTypes', value: this.data.settings.educationTypes.slice(0, count) });
      }
    }
  },

  methods: {
    switchTab(e) {
      this.setData({
        activeTab: e.currentTarget.dataset.tab
      });
    },

    handleSettingChange(e) {
      const { key } = e.currentTarget.dataset;
      let value = e.detail.value;

      if (key === 'companyMeals') {
        value = e.detail.value;
      } else if (typeof value === 'string' && !isNaN(value)) {
        value = Number(value);
      }
      
      this.triggerEvent('settingChange', { key, value });
    },

    handleSliderChange(e) {
      const { key } = e.currentTarget.dataset;
      let value = e.detail.value;
      if (key === 'loanInterestRate') {
        value /= 100;
      }
      this.triggerEvent('settingChange', { key, value });
    },

    handleInputChange(e) {
      const { key } = e.currentTarget.dataset;
      this.triggerEvent('settingChange', { key, value: Number(e.detail.value) });
    },

    handleEducationTypeChange(e) {
      const { index } = e.currentTarget.dataset;
      const newTypes = [...this.data.settings.educationTypes];
      newTypes[index] = this.data.educationTypeOptions[e.detail.value];
      this.triggerEvent('settingChange', { key: 'educationTypes', value: newTypes });
    }
  }
});
