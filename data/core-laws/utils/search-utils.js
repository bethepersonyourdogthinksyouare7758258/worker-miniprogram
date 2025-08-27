// 搜索功能工具函数
// 支持全文搜索、关键词匹配、内容生成等功能

/**
 * 生成搜索文本（合并所有可搜索字段）
 * @param {Object} item - 数据条目
 * @returns {string} - 用于搜索的合并文本
 */
function generateSearchText(item) {
  let searchText = '';
  
  // 基础字段
  if (item.title) searchText += item.title + ' ';
  if (item.keywords) searchText += item.keywords + ' ';
  if (item.summary) searchText += item.summary + ' ';
  if (item.tag) searchText += item.tag + ' ';
  if (item.legalTag) searchText += item.legalTag + ' ';
  
  // 维权场景特有字段
  if (item.type === 'scenario') {
    if (item.conditions) searchText += item.conditions + ' ';
    if (item.actionSteps && Array.isArray(item.actionSteps)) {
      searchText += item.actionSteps.join(' ') + ' ';
    }
    if (item.relatedLaws) searchText += item.relatedLaws + ' ';
  }
  
  // 法律依据
  if (item.legalBasis) searchText += item.legalBasis + ' ';
  
  // 提供者信息
  if (item.provider) searchText += item.provider + ' ';
  
  return searchText.toLowerCase().trim();
}

/**
 * 执行全文搜索
 * @param {string} query - 搜索关键词
 * @param {Array} items - 要搜索的数据数组
 * @returns {Array} - 搜索结果数组
 */
function searchItems(query, items) {
  if (!query || !query.trim()) {
    return items;
  }
  
  // 分词处理，支持空格和中文标点分隔
  const keywords = query.toLowerCase()
    .split(/[\s\u3000\u3001\u3002\uff0c\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u3010\u3011\u300a\u300b]+/)
    .filter(keyword => keyword.trim().length > 0);
  
  if (keywords.length === 0) {
    return items;
  }
  
  return items.filter(item => {
    // 确保item有searchText字段
    if (!item.searchText) {
      return false;
    }
    
    // 所有关键词都必须匹配（AND逻辑）
    return keywords.every(keyword => 
      item.searchText.includes(keyword)
    );
  });
}

/**
 * 按阶段筛选数据
 * @param {string} category - 阶段类别 ('all', 'onboarding', 'working', 'departure')
 * @param {Array} items - 要筛选的数据数组
 * @returns {Array} - 筛选结果数组
 */
function filterByCategory(category, items) {
  if (!category || category === 'all') {
    return items;
  }
  
  return items.filter(item => item.category === category);
}

/**
 * 按类型筛选数据
 * @param {string} type - 数据类型 ('all', 'knowledge', 'scenario')
 * @param {Array} items - 要筛选的数据数组
 * @returns {Array} - 筛选结果数组
 */
function filterByType(type, items) {
  if (!type || type === 'all') {
    return items;
  }
  
  return items.filter(item => item.type === type);
}

/**
 * 综合搜索和筛选
 * @param {Object} params - 搜索参数
 * @param {string} params.query - 搜索关键词
 * @param {string} params.type - 数据类型
 * @param {string} params.category - 阶段类别
 * @param {Array} params.items - 源数据数组
 * @returns {Array} - 处理结果数组
 */
function searchAndFilter(params) {
  let { query, type, category, items } = params;
  
  if (!Array.isArray(items)) {
    return [];
  }
  
  let results = [...items];
  
  // 按类型筛选
  results = filterByType(type, results);
  
  // 按阶段筛选
  results = filterByCategory(category, results);
  
  // 执行搜索
  results = searchItems(query, results);
  
  return results;
}

/**
 * 批量生成搜索文本
 * @param {Array} items - 数据数组
 * @returns {Array} - 添加了searchText字段的数据数组
 */
function batchGenerateSearchText(items) {
  return items.map(item => ({
    ...item,
    searchText: generateSearchText(item)
  }));
}

/**
 * 高亮搜索关键词（用于显示）
 * @param {string} text - 原始文本
 * @param {string} query - 搜索关键词
 * @returns {string} - 高亮处理后的文本
 */
function highlightKeywords(text, query) {
  if (!query || !text) {
    return text;
  }
  
  const keywords = query.split(/\s+/).filter(k => k.trim());
  let highlightedText = text;
  
  keywords.forEach(keyword => {
    if (keyword.trim()) {
      const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    }
  });
  
  return highlightedText;
}

module.exports = {
  generateSearchText,
  searchItems,
  filterByCategory,
  filterByType,
  searchAndFilter,
  batchGenerateSearchText,
  highlightKeywords
};
