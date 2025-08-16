Component({
  properties: {
    settings: {
      type: Object,
      value: {}
    },
    availableCities: {
      type: Array,
      value: []
    },
    calculateRequiredSalary: {
      type: Function,
      value: () => 0
    },
    getCityIncomeAndCosts: {
      type: Function,
      value: () => null
    }
  },

  data: {
    results: [],
    sortBy: 'salaryRatio',
    sortDirection: 'desc',
    expandedCity: null,
    expandedCityDetails: null
  },

  observers: {
    'settings, availableCities': function(settings, availableCities) {
      if (settings.sourceCity && settings.salary > 0) {
        const cityResults = availableCities
          .filter(city => city !== settings.sourceCity)
          .map(city => {
            const requiredSalary = this.properties.calculateRequiredSalary(city);
            return {
              cityName: city,
              requiredSalary,
              salaryRatio: requiredSalary / settings.salary
            };
          });
        this.setData({ results: cityResults });
      }
    }
  },

  computed: {
    sortedResults() {
      return this.data.results.sort((a, b) => {
        const fieldA = this.data.sortBy === 'requiredSalary' ? a.requiredSalary : a.salaryRatio;
        const fieldB = this.data.sortBy === 'requiredSalary' ? b.requiredSalary : b.salaryRatio;
        return this.data.sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      });
    },
    maxRatio() {
      if (this.data.results.length === 0) return 1;
      return Math.max(...this.data.results.map(r => r.salaryRatio));
    }
  },

  methods: {
    handleSort(e) {
      const { field } = e.currentTarget.dataset;
      if (this.data.sortBy === field) {
        this.setData({
          sortDirection: this.data.sortDirection === 'asc' ? 'desc' : 'asc'
        });
      } else {
        this.setData({
          sortBy: field,
          sortDirection: 'asc'
        });
      }
    },

    toggleCityDetails(e) {
      const { city } = e.currentTarget.dataset;
      if (this.data.expandedCity === city) {
        this.setData({ expandedCity: null });
      } else {
        const cityResult = this.data.results.find(r => r.cityName === city);
        if (cityResult) {
          const details = this.properties.getCityIncomeAndCosts(city, cityResult.requiredSalary);
          this.setData({
            expandedCity: city,
            expandedCityDetails: details
          });
        }
      }
    }
  }
});
