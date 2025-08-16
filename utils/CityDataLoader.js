const { cityData } = require('./city_data.js');

class CityDataLoader {
  constructor() {
    this.cityDataMap = new Map();
    this.loadData();
  }

  loadData() {
    cityData.forEach(data => {
      this.cityDataMap.set(data.city, data);
    });
  }

  getCityData(cityName) {
    return this.cityDataMap.get(cityName);
  }

  getAvailableCities() {
    return Array.from(this.cityDataMap.keys());
  }
}

module.exports = CityDataLoader;
