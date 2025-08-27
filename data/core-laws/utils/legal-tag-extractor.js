/**
 * 法律名标签提取器
 * 从法条依据文本中自动提取法律名称
 */

/**
 * 提取法律名标签
 * @param {string} legalBasis - 法条依据文本
 * @returns {string} - 提取的法律名标签
 */
function extractLegalTag(legalBasis) {
  if (!legalBasis || typeof legalBasis !== 'string') {
    return '';
  }

  // 定义法律名称匹配规则
  const legalNamePatterns = [
    // 法律类
    { pattern: /《([^》]*劳动合同法[^》]*)》/g, name: '劳动合同法' },
    { pattern: /《([^》]*劳动法[^》]*)》/g, name: '劳动法' },
    { pattern: /《([^》]*社会保险法[^》]*)》/g, name: '社会保险法' },
    
    // 条例类
    { pattern: /《([^》]*工伤保险条例[^》]*)》/g, name: '工伤保险条例' },
    { pattern: /《([^》]*职工带薪年休假条例[^》]*)》/g, name: '职工带薪年休假条例' },
    { pattern: /《([^》]*全国年节及纪念日放假办法[^》]*)》/g, name: '全国年节及纪念日放假办法' },
    { pattern: /《([^》]*住房公积金管理条例[^》]*)》/g, name: '住房公积金管理条例' },
    
    // 规定类
    { pattern: /《([^》]*工资支付暂行规定[^》]*)》/g, name: '工资支付暂行规定' },
    { pattern: /《([^》]*企业职工患病或非因工负伤医疗期规定[^》]*)》/g, name: '企业职工患病或非因工负伤医疗期规定' },
    { pattern: /《([^》]*企业职工带薪年休假实施办法[^》]*)》/g, name: '企业职工带薪年休假实施办法' },
    { pattern: /《([^》]*女职工劳动保护特别规定[^》]*)》/g, name: '女职工劳动保护特别规定' },
    { pattern: /《([^》]*用人单位职业健康监护监督管理办法[^》]*)》/g, name: '用人单位职业健康监护监督管理办法' },
    
    // 司法解释类
    { pattern: /《([^》]*最高人民法院[^》]*劳动争议[^》]*解释[^》]*)》/g, name: '劳动争议司法解释' },
    { pattern: /《([^》]*劳动争议调解仲裁法[^》]*)》/g, name: '劳动争议调解仲裁法' },
    
    // 通知类
    { pattern: /《([^》]*国家劳动总局[^》]*婚丧假[^》]*)》/g, name: '婚丧假规定' },
    { pattern: /《([^》]*基本医疗保险关系转移接续暂行办法[^》]*)》/g, name: '基本医疗保险关系转移接续暂行办法' }
  ];

  // 按优先级匹配
  for (const { pattern, name } of legalNamePatterns) {
    if (pattern.test(legalBasis)) {
      return name;
    }
  }

  // 通用法律名提取（兜底方案）
  const generalMatch = legalBasis.match(/《([^》]+)》/);
  if (generalMatch && generalMatch[1]) {
    let legalName = generalMatch[1];
    
    // 清理常见的冗余信息
    legalName = legalName
      .replace(/^中华人民共和国/, '')
      .replace(/第.*条.*/, '')
      .replace(/第.*款.*/, '')
      .replace(/第.*项.*/, '')
      .trim();
    
    return legalName || '相关法律法规';
  }

  return '相关法律法规';
}

/**
 * 批量提取法律标签
 * @param {Array} lawsArray - 法条数组
 * @returns {Array} - 添加了legalTag的法条数组
 */
function batchExtractLegalTags(lawsArray) {
  return lawsArray.map(law => ({
    ...law,
    legalTag: extractLegalTag(law.legalBasis)
  }));
}

module.exports = {
  extractLegalTag,
  batchExtractLegalTags
};
