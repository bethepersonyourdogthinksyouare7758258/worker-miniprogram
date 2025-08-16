module.exports = {
  "id": "salary",
  "title": "这个工资合理么？",
  "description": "帮你快速判断薪酬构成、税后收入、以及在不同城市的生活成本，确保你获得的待遇是公平且有竞争力的。",
  "calculators": [
    {
      "name": "税后工资计算器",
      "path": "/pages/calculator/net-salary/net-salary",
      "icon": "💸"
    },
    {
      "name": "个人所得税计算器",
      "path": "/pages/calculator/individual-income-tax/individual-income-tax",
      "icon": "💰"
    },
    {
      "name": "年终奖计算器",
      "path": "/pages/calculator/double-salary/double-salary",
      "icon": "🧧"
    }
  ]
};
