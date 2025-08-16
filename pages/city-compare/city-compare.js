const CityDataLoader = require('../../utils/CityDataLoader.js');
const CostCalculator = require('../../utils/CostCalculator.js');

Page({
  data: {
    cityDataLoader: null,
    costCalculator: null,
    availableCities: [],
    isLoading: true,
    error: null,
    settings: {
      sourceCity: '',
      salary: 240000,
      housingFundRate: '0.08',
      housingType: 'rent',
      housingLocation: 'center',
      housingSize: 'small',
      companyMeals: false,
      diningHomeRatio: 70,
      transportType: 'public',
      carLoanMonthlyPayment: 0,
      childrenCount: 0,
      educationTypes: [],
      entertainmentLevel: 'medium',
      loanInterestRate: 0.0588,
      loanTerm: 30
    },
    sourceIncome: null,
    sourceCosts: null
  },

  onLoad: function () {
    this.loadCityData();
  },

  loadCityData: function () {
    try {
      this.setData({ isLoading: true });
      
      const loader = new CityDataLoader();
      const calculator = new CostCalculator(loader);
      const cities = loader.getAvailableCities();
      
      this.setData({
        cityDataLoader: loader,
        costCalculator: calculator,
        availableCities: cities,
        'settings.sourceCity': cities.length > 0 ? cities[0] : '',
        isLoading: false
      });

      this.calculateResults();

    } catch (err) {
      this.setData({
        error: '加载城市数据失败，请稍后重试',
        isLoading: false
      });
      console.error('Error loading city data:', err);
    }
  },

  calculateResults: function() {
    const { costCalculator, settings, cityDataLoader } = this.data;
    if (costCalculator && settings.sourceCity && settings.salary > 0) {
      const cityData = cityDataLoader.getCityData(settings.sourceCity);
      
      if (cityData) {
        const income = costCalculator.calculateMonthlyIncome(settings.salary, cityData, settings);
        const costs = costCalculator.calculateMonthlyCosts(cityData, settings);
        
        this.setData({
          sourceIncome: income,
          sourceCosts: costs
        });
      }
    }
  },

  handleSettingChange: function (e) {
    const { key, value } = e.detail;
    this.setData({
      [`settings.${key}`]: value
    });
    this.calculateResults();
  },

  calculateRequiredSalary: function (e) {
    const { targetCity } = e.detail;
    const { costCalculator, settings } = this.data;
    if (!costCalculator) return 0;
    
    try {
      return costCalculator.calculateRequiredSalary(
        settings.sourceCity,
        targetCity,
        settings.salary,
        settings
      );
    } catch (err) {
      console.error('Error calculating required salary:', err);
      return 0;
    }
  },

  getCityIncomeAndCosts: function (e) {
    const { targetCity, targetSalary } = e.detail;
    const { costCalculator, cityDataLoader, settings } = this.data;
    if (!costCalculator || !cityDataLoader) return null;
    
    try {
      const cityData = cityDataLoader.getCityData(targetCity);
      if (!cityData) return null;

      const tempSettings = {
        ...settings,
        sourceCity: targetCity,
        salary: targetSalary
      };

      const income = costCalculator.calculateMonthlyIncome(targetSalary, cityData, tempSettings);
      const costs = costCalculator.calculateMonthlyCosts(cityData, tempSettings);
      
      return { income, costs };
    } catch (err) {
      console.error('Error calculating city income and costs:', err);
      return null;
    }
  },

  // 分享功能
  onShareAppMessage: function () {
    const { settings } = this.data;
    const shareTitle = settings.sourceCity ? 
      `我在用城市生活成本对比工具分析${settings.sourceCity}，快来试试吧！` : 
      '城市生活成本对比工具 - 找到最适合你的城市！';
    
    return {
      title: shareTitle,
      path: '/pages/city-compare/city-compare',
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
