Component({
  properties: {
    settings: {
      type: Object,
      value: {}
    },
    availableCities: {
      type: Array,
      value: []
    }
  },

  data: {
    salaryInput: '',
    housingFundInput: '',
    cityIndex: 0
  },

  observers: {
    'settings.salary': function(salary) {
      if (salary > 0) {
        this.setData({
          salaryInput: salary.toString()
        });
      }
    },
    'settings.housingFundRate': function(rate) {
      this.setData({
        housingFundInput: (parseFloat(rate) * 100).toString()
      });
    },
    'settings.sourceCity': function(city) {
      const index = this.data.availableCities.indexOf(city);
      if (index > -1) {
        this.setData({
          cityIndex: index
        });
      }
    }
  },

  methods: {
    handleCityChange(e) {
      const index = e.detail.value;
      this.setData({
        cityIndex: index
      });
      this.triggerEvent('settingChange', {
        key: 'sourceCity',
        value: this.data.availableCities[index]
      });
    },

    handleSalaryChange(e) {
      const value = e.detail.value;
      this.setData({
        salaryInput: value
      });
      this.triggerEvent('settingChange', {
        key: 'salary',
        value: value !== '' ? Number(value) : 0
      });
    },

    handleHousingFundChange(e) {
      const value = e.detail.value;
      this.setData({
        housingFundInput: value
      });
      if (value !== '') {
        const percent = Number(value);
        if (percent >= 5 && percent <= 12) {
          this.triggerEvent('settingChange', {
            key: 'housingFundRate',
            value: (percent / 100).toString()
          });
        }
      }
    }
  }
});
