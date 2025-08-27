// 数据处理脚本 - 批量更新legal-knowledge数据结构
const { extractLegalTag } = require('./utils/legal-tag-extractor');
const { generateSearchText } = require('./utils/search-utils');

// 为法条知识条目补充缺失字段
function processLegalKnowledgeItem(item) {
  // 如果已经有完整结构，跳过
  if (item.sections && item.keywords && item.legalTag) {
    return {
      ...item,
      legalTag: extractLegalTag(item.legalBasis),
      copyable: true,
      expandable: true
    };
  }

  // 基于内容生成keywords
  const keywords = generateKeywords(item);
  
  // 基于内容生成sections
  const sections = generateSections(item);
  
  // 提取法律标签
  const legalTag = extractLegalTag(item.legalBasis);

  const processedItem = {
    ...item,
    keywords,
    legalTag,
    sections,
    copyable: true,
    expandable: true
  };

  // 生成搜索文本
  processedItem.searchText = generateSearchText(processedItem);

  return processedItem;
}

// 生成关键词
function generateKeywords(item) {
  if (item.keywords) return item.keywords;

  let keywords = [];
  
  // 从标题提取关键词
  if (item.title) {
    keywords.push(...extractKeywordsFromText(item.title));
  }
  
  // 从标签提取关键词
  if (item.tag) {
    keywords.push(item.tag);
  }

  // 从摘要提取关键词
  if (item.summary) {
    keywords.push(...extractKeywordsFromText(item.summary, 3));
  }

  return keywords.slice(0, 8).join(' ');
}

// 从文本提取关键词
function extractKeywordsFromText(text, maxWords = 2) {
  const commonWords = ['的', '和', '与', '或', '是', '不', '在', '有', '为', '以', '对', '按', '及', '等', '但', '可', '应', '须', '得', '于', '由', '从', '到', '向', '给', '被'];
  const words = text.split(/[，。；：？！、\s]+/)
    .filter(word => word.length > 1 && !commonWords.includes(word))
    .slice(0, maxWords);
  return words;
}

// 生成sections结构
function generateSections(item) {
  if (item.sections) return item.sections;

  const sections = [];
  let sectionId = 1;

  // 基本内容section
  if (item.summary) {
    sections.push({
      id: sectionId++,
      title: "基本规定",
      content: [
        { id: 1, text: item.summary }
      ]
    });
  }

  // 法律依据section
  if (item.legalBasis) {
    sections.push({
      id: sectionId++,
      title: "法律依据",
      content: [
        { id: 1, text: item.legalBasis }
      ]
    });
  }

  // 根据不同类型添加特殊section
  if (item.tag === '试用期') {
    sections.push({
      id: sectionId++,
      title: "注意事项",
      content: [
        { id: 1, text: "同一单位与同一员工只能约定一次试用期" },
        { id: 2, text: "试用期包含在合同期限内" }
      ]
    });
  }

  if (item.tag === '工伤') {
    sections.push({
      id: sectionId++,
      title: "申请要点",
      content: [
        { id: 1, text: "工伤认定需要在事故发生后1年内申请" },
        { id: 2, text: "用人单位应在30日内主动申请工伤认定" }
      ]
    });
  }

  if (item.tag === '加班') {
    sections.push({
      id: sectionId++,
      title: "计算方式",
      content: [
        { id: 1, text: "平日延时加班：基础工资 × 1.5倍" },
        { id: 2, text: "周末加班：基础工资 × 2倍" },
        { id: 3, text: "法定节假日加班：基础工资 × 3倍" }
      ]
    });
  }

  return sections;
}

// 处理整个数据结构
function processAllData(legalKnowledge) {
  const processedData = {};
  
  Object.keys(legalKnowledge).forEach(category => {
    if (Array.isArray(legalKnowledge[category])) {
      processedData[category] = legalKnowledge[category].map(processLegalKnowledgeItem);
    } else {
      processedData[category] = legalKnowledge[category];
    }
  });

  return processedData;
}

module.exports = {
  processLegalKnowledgeItem,
  processAllData,
  generateKeywords,
  generateSections
};
