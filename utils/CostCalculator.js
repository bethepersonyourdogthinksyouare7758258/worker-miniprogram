class CostCalculator {
  constructor(cityDataLoader) {
    this.cityDataLoader = cityDataLoader;
  }

  calculateMonthlyCosts(cityData, settings) {
    const housing = this.calculateHousingCost(cityData, settings);
    const dining = this.calculateDiningCost(cityData, settings);
    const transport = this.calculateTransportCost(cityData, settings);
    const education = this.calculateEducationCost(cityData, settings);
    const utilities = this.calculateUtilitiesCost(cityData, settings);

    return {
      住房: Math.round(housing),
      餐饮: Math.round(dining),
      交通: Math.round(transport),
      教育: Math.round(education),
      日常开销: Math.round(utilities),
      总支出: Math.round(housing + dining + transport + education + utilities)
    };
  }

  calculateMonthlyIncome(salary, cityData, settings) {
    const monthSalary = salary / 12;
    const insuranceBase = Math.min(
      Math.max(monthSalary, cityData.social_security_base_min),
      cityData.social_security_base_max
    );

    const insurance = {
      养老保险: insuranceBase * 0.08,
      医疗保险: insuranceBase * 0.02,
      失业保险: insuranceBase * 0.005,
      住房公积金: insuranceBase * parseFloat(settings.housingFundRate)
    };

    const monthlyInsurance = Object.values(insurance).reduce((a, b) => a + b, 0);
    const taxable = monthSalary - monthlyInsurance - 5000;
    const tax = this.calculateTax(Math.max(0, taxable));

    return {
      税前工资: Math.round(monthSalary),
      社保公积金: Math.round(monthlyInsurance),
      个人所得税: Math.round(tax),
      税后工资: Math.round(monthSalary - monthlyInsurance - tax)
    };
  }

  calculateHousingCost(cityData, settings) {
    if (settings.housingType === 'rent') {
      if (settings.housingLocation === 'center') {
        if (settings.housingSize === 'shared') {
          return cityData.rent_center_1b * 0.6;
        } else if (settings.housingSize === 'small') {
          return cityData.rent_center_1b;
        } else {
          return cityData.rent_center_3b;
        }
      } else {
        if (settings.housingSize === 'shared') {
          return cityData.rent_suburb_1b * 0.6;
        } else if (settings.housingSize === 'small') {
          return cityData.rent_suburb_1b;
        } else {
          return cityData.rent_suburb_3b;
        }
      }
    } else {
      let housePrice;
      if (settings.housingLocation === 'center') {
        housePrice = cityData.house_price_center;
      } else {
        housePrice = cityData.house_price_suburb;
      }
      
      let area;
      if (settings.housingSize === 'small') {
        area = 60;
      } else {
        area = 120;
      }
      
      const totalPrice = housePrice * area;
      const downPayment = totalPrice * 0.3;
      const loan = totalPrice - downPayment;
      
      const years = settings.loanTerm || 30;
      const months = years * 12;
      
      const useHousingFund = parseFloat(settings.housingFundRate) > 0.05;
      const baseRate = settings.loanInterestRate || 0.0588;
      
      const effectiveRate = useHousingFund 
        ? baseRate * 0.7 + 0.0325 * 0.3
        : baseRate;
      
      const monthlyRate = effectiveRate / 12;
      
      const monthlyPayment = loan * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      
      const propertyFee = settings.housingSize === 'small' 
        ? 180
        : 360;
      
      return monthlyPayment + propertyFee;
    }
  }

  calculateDiningCost(cityData, settings) {
    if (settings.companyMeals) {
      const nonWorkdayRatio = 0.27;
      const diningHomeRatio = settings.diningHomeRatio / 100;
      const diningOutRatio = 1 - diningHomeRatio;
      const nonWorkdayCost = cityData.dining_home * diningHomeRatio + cityData.dining_out * diningOutRatio;
      return nonWorkdayCost * nonWorkdayRatio;
    } else {
      const diningHomeRatio = settings.diningHomeRatio / 100;
      const diningOutRatio = 1 - diningHomeRatio;
      return cityData.dining_home * diningHomeRatio + cityData.dining_out * diningOutRatio;
    }
  }

  calculateTransportCost(cityData, settings) {
    switch(settings.transportType) {
      case 'public':
        return cityData.transport_public;
      case 'car':
        return cityData.transport_car + (settings.carLoanMonthlyPayment || 0);
      case 'ebike':
        return 100;
      case 'bike':
        return 0;
      case 'walk':
        return 0;
      default:
        return cityData.transport_public;
    }
  }

  calculateEducationCost(cityData, settings) {
    let educationCost = 0;
    
    if (settings.childrenCount > 0) {
      settings.educationTypes.forEach(educationType => {
        switch(educationType) {
          case 'kindergarten':
            educationCost += cityData.kindergarten;
            break;
          case 'primary':
            educationCost += cityData.primary;
            break;
          case 'middle':
            educationCost += cityData.middle;
            break;
          case 'high':
            educationCost += cityData.high;
            break;
          case 'international':
            educationCost += cityData.international;
            break;
          default:
            break;
        }
      });
    }
    
    return educationCost;
  }

  calculateUtilitiesCost(cityData, settings) {
    let entertainmentCost = 0;
    switch(settings.entertainmentLevel) {
      case 'poor': 
        entertainmentCost = 0;
        break;
      case 'low': 
        entertainmentCost = (cityData.fitness + cityData.cinema) * 2;
        break;
      case 'medium':
        entertainmentCost = (cityData.fitness + cityData.cinema) * 4;
        break;
      case 'high':
        entertainmentCost = (cityData.fitness + cityData.cinema) * 8;
        break;
      default:
        break;
    }
    return cityData.utilities + cityData.mobile_plan + cityData.internet + entertainmentCost;
  }

  calculateTax(monthlyTaxable) {
    const brackets = [
      { limit: 0, rate: 0.03, deduction: 0 },
      { limit: 3000, rate: 0.1, deduction: 210 },
      { limit: 12000, rate: 0.2, deduction: 1410 },
      { limit: 25000, rate: 0.25, deduction: 2660 },
      { limit: 35000, rate: 0.3, deduction: 4410 },
      { limit: 55000, rate: 0.35, deduction: 7160 },
      { limit: 80000, rate: 0.45, deduction: 15160 }
    ];

    for (let i = brackets.length - 1; i >= 0; i--) {
      if (monthlyTaxable > brackets[i].limit) {
        return monthlyTaxable * brackets[i].rate - brackets[i].deduction;
      }
    }
    return 0;
  }

  calculateRequiredSalary(sourceCityName, targetCityName, sourceSalary, settings) {
    const sourceCityData = this.cityDataLoader.getCityData(sourceCityName);
    const targetCityData = this.cityDataLoader.getCityData(targetCityName);
    
    if (!sourceCityData || !targetCityData) {
      throw new Error('城市数据未找到');
    }

    const sourceIncome = this.calculateMonthlyIncome(sourceSalary, sourceCityData, settings);
    const sourceCosts = this.calculateMonthlyCosts(sourceCityData, settings);
    const targetSavingsGoal = sourceIncome.税后工资 - sourceCosts.总支出;

    const targetCosts = this.calculateMonthlyCosts(targetCityData, settings);
    
    const targetAfterTaxMonthly = targetCosts.总支出 + targetSavingsGoal;
    
    let targetAnnualSalary = sourceSalary;
    let lastDiff = Infinity;
    let step = 10000;
    
    for (let i = 0; i < 100; i++) {
      const monthlyIncome = this.calculateMonthlyIncome(targetAnnualSalary, targetCityData, settings);
      const diff = monthlyIncome.税后工资 - targetAfterTaxMonthly;
      
      if (Math.abs(diff) < 100) {
        break;
      }
      
      if (diff < 0) {
        targetAnnualSalary += step;
      } else {
        targetAnnualSalary -= step;
      }
      
      if ((diff > 0 && lastDiff < 0) || (diff < 0 && lastDiff > 0)) {
        step = Math.max(1000, step / 2);
      }
      
      lastDiff = diff;
    }
    
    return targetAnnualSalary;
  }
}

module.exports = CostCalculator;
