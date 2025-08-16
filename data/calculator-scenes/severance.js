module.exports = {
  "id": "severance",
  "title": "我离职了 钱给齐了么？",
  "description": "离职时涉及多种复杂的补偿金计算。这里可以帮你理清应得的经济补偿、赔偿金、代通知金等，确保合法权益。",
  "calculators": [
    {
      "name": "经济补偿金(N)",
      "path": "/pages/calculator/economic-compensation/economic-compensation",
      "icon": "💼"
    },
    {
      "name": "经济赔偿金(2N)",
      "path": "/pages/calculator/severance-pay/severance-pay",
      "icon": "⚖️"
    },
    {
      "name": "工伤赔偿",
      "path": "/pages/calculator/injury-compensation/injury-compensation",
      "icon": "🤕"
    }
  ]
};
