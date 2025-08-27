# 核心法条数据库文档

## 📋 项目概述

本目录包含微信小程序"职场权益速查"的**核心法条数据文件**，提供劳动法相关的知识库和维权场景指导。这些数据文件采用**数据-代码分离**的架构设计，将内容数据独立于业务逻辑，便于维护和扩展。

### 数据来源
- **CSV集成数据**: 来自 `assets/法条需求 - Sheet1.csv` 的结构化数据
- **原有内容**: 标记为"【原来】"的历史内容，确保向后兼容

### 架构优势
- ✅ **数据保护**: 内容与代码分离，减少误修改风险
- ✅ **易于维护**: 统一的数据结构，便于批量更新
- ✅ **可扩展性**: 模块化设计，支持灵活添加新内容
- ✅ **性能优化**: 按需加载，提升应用响应速度

---

## 📁 文件结构

```
data/core-laws/
├── legal-knowledge.js     # 法条知识库 (32个条目)
├── rights-scenarios.js    # 维权场景库 (18个条目)
└── README.md             # 本文档
```

### 核心数据文件

| 文件名 | 描述 | 条目数 | 用途 |
|--------|------|--------|------|
| `legal-knowledge.js` | 法条知识库 | 32条 | 简明法律知识问答 |
| `rights-scenarios.js` | 维权场景库 | 18条 | 具体维权操作指导 |

---

## 🏗️ 数据模型详解

### 三阶段分类体系

所有数据按照劳动关系的生命周期分为三个阶段：

| 阶段标识 | 中文名称 | 描述 | 示例场景 |
|---------|----------|------|----------|
| `onboarding` | 入职阶段 | 入职相关的法律问题 | 试用期、签合同、缴社保 |
| `working` | 在职阶段 | 工作期间的权益保障 | 加班费、工伤、调岗降薪 |
| `departure` | 离职阶段 | 离职相关的法律事务 | 经济补偿、离职证明、竞业限制 |

### 数据结构定义

#### 基础条目结构
```javascript
{
  id: 'unique-identifier',           // 唯一标识符
  title: '条目标题',                 // 显示标题
  category: 'onboarding',           // 阶段分类
  keywords: '关键词1 关键词2',       // 搜索关键词
  source: 'csv-knowledge',          // 数据源标识
  provider: '内容提供者',           // 内容贡献者
  toolLink: '相关工具名称',         // 关联计算器工具(可选)
  sections: [...]                   // 内容区块数组
}
```

#### 内容区块结构
```javascript
{
  id: 1,                           // 区块ID
  title: '区块标题',               // 如: "简明结论"、"法律依据"
  content: [                       // 内容项数组
    {
      id: 1,
      text: '具体内容文本'
    }
  ]
}
```

### 字段详细说明

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `id` | String | ✅ | 条目唯一标识，使用kebab-case命名 |
| `title` | String | ✅ | 条目显示标题，用户可见 |
| `category` | String | ✅ | 阶段分类: onboarding/working/departure |
| `keywords` | String | ✅ | 空格分隔的搜索关键词 |
| `source` | String | ✅ | 数据源: csv-knowledge/csv-scenarios/original |
| `provider` | String | ❌ | 内容提供者姓名 |
| `toolLink` | String | ❌ | 关联的计算器工具名称 |
| `sections` | Array | ✅ | 内容区块数组，包含具体内容 |

### 数据源标识说明

| 标识 | 含义 | 示例 |
|------|------|------|
| `csv-knowledge` | CSV表格中的法条知识 | 试用期时长、工资标准等 |
| `csv-scenarios` | CSV表格中的维权场景 | 未签合同维权、加班费争议等 |
| `original` | 原有系统内容 | 标记"【原来】"的历史数据 |

---

## 💻 使用示例代码

### 1. 模块导入
```javascript
// 在微信小程序页面中导入
const legalKnowledge = require('../../../data/core-laws/legal-knowledge.js')
const rightsScenarios = require('../../../data/core-laws/rights-scenarios.js')
```

### 2. 基础数据查询
```javascript
// 获取入职阶段的所有法条知识
const onboardingKnowledge = legalKnowledge.onboarding

// 获取在职阶段的所有维权场景  
const workingScenarios = rightsScenarios.working

// 获取特定条目
const trialPeriodInfo = legalKnowledge.onboarding.find(
  item => item.id === 'trial-period-duration'
)
```

### 3. 关键词搜索
```javascript
// 搜索包含特定关键词的条目
function searchByKeyword(keyword) {
  const allKnowledge = [
    ...legalKnowledge.onboarding,
    ...legalKnowledge.working,
    ...legalKnowledge.departure
  ]
  
  return allKnowledge.filter(item => 
    item.keywords.includes(keyword) || 
    item.title.includes(keyword)
  )
}

// 搜索"试用期"相关内容
const results = searchByKeyword('试用期')
```

### 4. 按阶段分类展示
```javascript
// 页面数据初始化
Page({
  data: {
    categoryFilters: [
      { id: 'all', name: '全部' },
      { id: 'onboarding', name: '入职阶段' },
      { id: 'working', name: '工作期间' },
      { id: 'departure', name: '离职阶段' }
    ]
  },

  // 加载法律知识（"全部"按钮）
  loadLegalKnowledge() {
    const allKnowledge = [
      ...legalKnowledge.onboarding,
      ...legalKnowledge.working, 
      ...legalKnowledge.departure
    ]
    
    this.setData({ 
      filteredCategories: allKnowledge,
      selectedCategory: 'all'
    })
  },

  // 加载维权场景（阶段按钮）
  loadRightsScenarios(category) {
    const scenarios = rightsScenarios[category] || []
    this.setData({ 
      filteredCategories: scenarios,
      selectedCategory: category
    })
  }
})
```

### 5. 详情页面使用
```javascript
// 详情页面动态加载内容
loadContent(itemId, dataType, stage) {
  let itemData = null
  
  if (dataType === 'knowledge') {
    const stageData = legalKnowledge[stage] || []
    itemData = stageData.find(item => item.id === itemId)
  } else if (dataType === 'scenario') {
    const stageData = rightsScenarios[stage] || []
    itemData = stageData.find(item => item.id === itemId)
  }
  
  if (itemData) {
    this.setData({
      title: itemData.title,
      sections: itemData.sections,
      provider: itemData.provider || '',
      toolLink: itemData.toolLink || ''
    })
  }
}
```

---

## 🔧 维护指南

### 添加新的法条知识

1. **确定分类阶段**：选择 `onboarding`、`working` 或 `departure`

2. **创建条目结构**：
```javascript
{
  id: 'new-knowledge-item',        // 使用kebab-case命名
  title: '新法条知识标题',
  category: 'working',             // 对应的阶段
  keywords: '关键词1 关键词2',
  source: 'csv-knowledge',         // 数据来源
  provider: '内容提供者',
  sections: [
    {
      id: 1,
      title: '简明结论',
      content: [
        { id: 1, text: '具体结论内容' }
      ]
    },
    {
      id: 2, 
      title: '法律依据',
      content: [
        { id: 1, text: '相关法律条文' }
      ]
    }
  ]
}
```

3. **添加到对应数组**：将新条目添加到 `legal-knowledge.js` 相应阶段的数组中

### 添加新的维权场景

维权场景通常包含更多操作指导，推荐使用以下结构：

```javascript
{
  id: 'new-rights-scenario',
  title: '新维权场景标题', 
  category: 'working',
  keywords: '维权 场景关键词',
  source: 'csv-scenarios',
  provider: '内容提供者',
  sections: [
    {
      id: 1,
      title: '所需条件',
      content: [
        { id: 1, text: '满足的条件1' },
        { id: 2, text: '满足的条件2' }
      ]
    },
    {
      id: 2,
      title: '操作步骤', 
      content: [
        { id: 1, text: '1. 第一步操作...' },
        { id: 2, text: '2. 第二步操作...' }
      ]
    },
    {
      id: 3,
      title: '法律依据',
      content: [
        { id: 1, text: '相关法律条文引用' }
      ]
    },
    {
      id: 4,
      title: '相关法条与解释',
      content: [
        { id: 1, text: '详细的法律解释和说明' }
      ]
    }
  ]
}
```

### ID命名规范

- 使用**kebab-case**格式（小写字母+连字符）
- 体现内容主题，具有描述性
- 避免使用缩写，保持可读性

#### 命名示例
```javascript
// ✅ 推荐命名
'trial-period-duration'           // 试用期时长
'overtime-pay-calculation'        // 加班费计算
'economic-compensation-standard'  // 经济补偿标准

// ❌ 不推荐命名  
'tp-duration'                     // 缩写不清晰
'OvertimePayCalc'                 // 驼峰命名不符合规范
'item1'                          // 无描述性
```

### 数据一致性检查清单

在修改数据前，请确认以下事项：

- [ ] **ID唯一性**：新条目的ID在整个文件中是唯一的
- [ ] **阶段分类正确**：category字段与实际所属阶段匹配
- [ ] **关键词完整**：包含主要搜索关键词，用空格分隔
- [ ] **内容结构完整**：sections数组包含必要的内容区块
- [ ] **字段类型正确**：各字段的数据类型符合定义
- [ ] **模块导出正常**：文件末尾正确使用 `module.exports`

### 数据验证脚本

可以使用以下简单脚本验证数据完整性：

```javascript
// 验证数据完整性
const legalKnowledge = require('./legal-knowledge.js')
const rightsScenarios = require('./rights-scenarios.js')

function validateData() {
  const allIds = []
  
  // 检查法条知识数据
  Object.keys(legalKnowledge).forEach(stage => {
    legalKnowledge[stage].forEach(item => {
      if (!item.id || !item.title || !item.sections) {
        console.error(`法条知识数据不完整: ${item.id}`)
      }
      if (allIds.includes(item.id)) {
        console.error(`发现重复ID: ${item.id}`)
      }
      allIds.push(item.id)
    })
  })
  
  // 检查维权场景数据
  Object.keys(rightsScenarios).forEach(stage => {
    rightsScenarios[stage].forEach(item => {
      if (!item.id || !item.title || !item.sections) {
        console.error(`维权场景数据不完整: ${item.id}`)
      }
      if (allIds.includes(item.id)) {
        console.error(`发现重复ID: ${item.id}`)
      }
      allIds.push(item.id)
    })
  })
  
  console.log(`数据验证完成，共检查 ${allIds.length} 个条目`)
}

validateData()
```

---

## 📊 数据统计

### 当前数据概况

| 类型 | 入职阶段 | 在职阶段 | 离职阶段 | 总计 |
|------|----------|----------|----------|------|
| **法条知识** | 8条 | 11条 | 13条 | **32条** |
| **维权场景** | 4条 | 7条 | 7条 | **18条** |
| **合计** | 12条 | 18条 | 20条 | **50条** |

### 内容提供者统计

主要内容贡献者包括：睡睡、石贤博、沈江枫、潘帅、李凡、艾一帆、绵羊、冷杉、范新寓等专业人士。

---

## 🚀 技术规范

### 文件编码
- **编码格式**: UTF-8
- **换行符**: LF (Unix风格)
- **缩进**: 2个空格

### JavaScript规范  
- 使用ES5语法，兼容微信小程序环境
- 字符串优先使用单引号
- 对象和数组末尾保留逗号（便于版本控制）
- 使用 `module.exports` 导出模块

### 注释规范
```javascript
// 文件头部注释
// 数据描述 - 数据来源说明
// 创建时间: YYYY-MM-DD
// 说明: 文件用途和内容概述

// 区块注释
// 阶段名称 + 数据描述
```

---

## 📞 技术支持

如需技术支持或有数据维护相关问题，请：

1. 检查本文档的相关章节
2. 运行数据验证脚本确认数据完整性
3. 参考现有条目的结构和格式
4. 遵循命名规范和数据模型定义

---

## 🔄 文件路径更新说明

**重要提醒**: 由于数据文件已从 `data/` 移动到 `data/core-laws/`，在引用这些文件时需要更新导入路径：

### 旧路径（需要更新）：
```javascript
const legalKnowledge = require('../../data/legal-knowledge.js')
const rightsScenarios = require('../../data/rights-scenarios.js')
```

### 新路径（正确）：
```javascript
const legalKnowledge = require('../../data/core-laws/legal-knowledge.js')
const rightsScenarios = require('../../data/core-laws/rights-scenarios.js')
```

请确保所有相关页面文件都使用新的路径进行导入。

---

*最后更新时间: 2025-08-24*  
*文档版本: v2.0*  
*变更说明: 重新组织文件结构，移除对phrases.js的错误引用，专注于核心法条数据*
