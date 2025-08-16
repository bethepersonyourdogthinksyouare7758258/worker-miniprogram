import wxCharts from '../../../../utils/wxcharts';

Component({
  properties: {
    cityName: String,
    income: Object,
    costs: Object,
    hideTitle: {
      type: Boolean,
      value: false
    }
  },

  data: {
    isExpanded: false,
    activeTab: 'income',
    monthlySavings: 0,
    savingsRate: 0,
    formattedIncome: '¥--',
    formattedCosts: '¥--',
    formattedSavings: '¥--'
  },

  lifetimes: {
    ready() {
      this.updateSavings();
      if (this.data.isExpanded) {
        this.renderCharts();
      }
    }
  },

  observers: {
    'income, costs': function(income, costs) {
      if (income && costs) {
        this.updateSavings();
        if (this.data.isExpanded) {
          this.renderCharts();
        }
      }
    }
  },

  methods: {
    toggleExpand() {
      this.setData({ isExpanded: !this.data.isExpanded }, () => {
        if (this.data.isExpanded) {
          this.renderCharts();
        }
      });
    },

    switchTab(e) {
      this.setData({ activeTab: e.currentTarget.dataset.tab }, () => {
        this.renderCharts();
      });
    },

    updateSavings() {
      if (!this.data.income || !this.data.costs) {
        this.setData({
          formattedIncome: '¥--',
          formattedCosts: '¥--',
          formattedSavings: '¥--'
        });
        return;
      }
      const monthlySavings = this.data.income.税后工资 - this.data.costs.总支出;
      const savingsRate = this.data.income.税后工资 ? (monthlySavings / this.data.income.税后工资) * 100 : 0;
      
      const format = (value) => {
        if (typeof value !== 'number') return '¥--';
        return '¥' + value.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
      };

      this.setData({ 
        monthlySavings, 
        savingsRate,
        formattedIncome: format(this.data.income.税后工资),
        formattedCosts: format(this.data.costs.总支出),
        formattedSavings: format(monthlySavings)
      });
    },

    renderCharts() {
      if (!this.data.income || !this.data.costs) {
        return;
      }
      if (this.data.activeTab === 'income') {
        this.renderIncomeChart();
      } else if (this.data.activeTab === 'expense') {
        this.renderExpenseChart();
      }
    },

    renderIncomeChart() {
      if (!this.data.income) return;
      new wxCharts({
        canvasId: 'incomeChart',
        type: 'ring',
        series: [{
          name: '税后工资',
          data: this.data.income.税后工资,
          format: (val) => '税后工资: ' + val.toFixed(2)
        }, {
          name: '个人所得税',
          data: this.data.income.个人所得税,
          format: (val) => '个税: ' + val.toFixed(2)
        }, {
          name: '社保公积金',
          data: this.data.income.社保公积金,
          format: (val) => '社保公积金: ' + val.toFixed(2)
        }],
        width: 320,
        height: 200,
        dataLabel: true
      });
    },

    renderExpenseChart() {
      if (!this.data.costs) return;
      new wxCharts({
        canvasId: 'expenseChart',
        type: 'ring',
        series: [{
          name: '住房',
          data: this.data.costs.住房,
          format: (val) => '住房: ' + val.toFixed(2)
        }, {
          name: '餐饮',
          data: this.data.costs.餐饮,
          format: (val) => '餐饮: ' + val.toFixed(2)
        }, {
          name: '交通',
          data: this.data.costs.交通,
          format: (val) => '交通: ' + val.toFixed(2)
        }, {
          name: '教育',
          data: this.data.costs.教育,
          format: (val) => '教育: ' + val.toFixed(2)
        }, {
          name: '日常开销',
          data: this.data.costs.日常开销,
          format: (val) => '日常开销: ' + val.toFixed(2)
        }],
        width: 320,
        height: 200,
        dataLabel: true
      });
    }
  }
});
