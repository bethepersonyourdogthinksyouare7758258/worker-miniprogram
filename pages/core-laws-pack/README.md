# 📚 核心法条板块 README

## 📖 项目概述

核心法条板块是"打工者生存工具包"小程序的核心功能之一，旨在为用户提供全面、准确、实用的劳动法相关知识和维权指导。该板块通过系统化整理劳动法条文和实际维权场景，帮助用户快速查询相关权益保障信息。

### 🎯 功能定位
- **法条知识库**：提供权威的劳动法条文解读（32条）
- **维权场景指南**：提供具体的维权操作指导（18条）
- **双模式切换**：法条知识 vs 维权场景模式切换
- **实用参考工具**：便于复制分享的法律内容

### 👥 目标用户
- 在职员工：了解劳动权益，预防劳动纠纷
- 求职者：掌握入职相关法律知识
- 离职人员：获取离职维权指导
- HR从业者：参考劳动法规范操作

## 🏗️ 页面架构设计

### 📱 主页面 (`core-laws/`)
**双模式设计**：
- **法条知识模式**：展开/收缩式显示，无需跳转页面
- **维权场景模式**：列表式展示，点击跳转详情页

**核心功能**：
- **模式切换**：法条知识 ↔ 维权场景
- **阶段筛选**：入职阶段、在职阶段、离职阶段
- **实时搜索**：支持标题和关键词模糊匹配
- **内容展开**：法条知识支持就地展开查看详情
- **一键复制**：支持复制完整内容到剪贴板

### 📄 场景详情页 (`scenario-detail/`)
**专用于维权场景**：
- **所需条件**：列出适用该场景的前置条件
- **操作步骤**：详细的维权操作指导
- **法条依据**：相关法律条文引用
- **相关解释**：法条的具体解释和案例说明
- **复制功能**：支持复制完整场景指导

## 📂 文件结构说明

```
pages/core-laws-pack/
├── README.md                   # 项目文档（本文件）
├── REFACTOR_PLAN.md           # 重构计划文档
│
├── core-laws/                  # 主页面目录
│   ├── core-laws.js           # 页面逻辑控制
│   ├── core-laws.wxml         # 页面结构布局
│   ├── core-laws.wxss         # 页面样式设计
│   └── core-laws.json         # 页面配置文件
│
└── scenario-detail/            # 维权场景详情页
    ├── scenario-detail.js     # 详情页面逻辑
    ├── scenario-detail.wxml   # 详情页面结构
    ├── scenario-detail.wxss   # 详情页面样式
    └── scenario-detail.json   # 详情页面配置
```

### 📁 数据层架构

**数据文件位置**：`/data/core-laws/`

```
data/core-laws/
├── legal-knowledge.js          # 法条知识库（32条）
├── rights-scenarios.js         # 维权场景库（18条）
├── utils/                      # 工具函数目录
│   ├── legal-tag-extractor.js # 法条标签提取工具
│   └── search-utils.js         # 搜索工具函数
├── csv-to-js-converter.js      # CSV转换工具
└── data-processor.js           # 数据处理工具
```

**数据来源**：
- **标准化CSV文件**：`assets/法条知识-最终标准版.csv`、`assets/维权场景-最终标准版.csv`
- **主键标识**：法条ID (LAW001-LAW032)、场景ID (SCENE001-SCENE018)

## 🔧 核心功能实现

### 数据结构设计

#### 法条知识数据格式
```javascript
{
  id: "LAW001",                    // 唯一标识
  type: "knowledge",               // 数据类型
  category: "onboarding",          // 阶段分类
  tag: "试用期",                   // 内容标签
  title: "试用期最长多久？",        // 问题标题
  summary: "简明结论内容",         // 简明结论
  legalBasis: "《劳动合同法》...", // 法条依据
  sections: [                     // 展开内容
    {
      id: 1,
      title: "基本规定",
      content: [{ id: 1, text: "具体内容" }]
    }
  ],
  copyable: true,                 // 是否支持复制
  expandable: true                // 是否支持展开
}
```

#### 维权场景数据格式
```javascript
{
  id: "SCENE001",                 // 唯一标识
  type: "scenario",               // 数据类型  
  category: "onboarding",         // 阶段分类
  title: "场景标题",              // 场景标题
  conditions: "所需条件",         // 适用条件
  actionSteps: ["步骤1", "步骤2"], // 操作步骤
  legalBasis: "法条依据",         // 法律依据
  relatedLaws: "相关解释",        // 详细解释
  detailPageUrl: "/pages/...",    // 详情页链接
  copyable: true,                 // 是否支持复制
  navigable: true                 // 是否支持跳转
}
```

### 关键功能组件

#### 1. 模式切换组件
```javascript
switchMode(mode) {
  // 切换法条知识 vs 维权场景模式
  this.setData({ 
    currentMode: mode,
    selectedStage: 'all' 
  })
  this.loadData()
}
```

#### 2. 搜索过滤组件  
```javascript
searchAndFilter(searchText, stage) {
  // 综合搜索和阶段筛选
  let results = this.data.allItems
  if (stage !== 'all') {
    results = results.filter(item => item.category === stage)
  }
  if (searchText) {
    results = results.filter(item => 
      item.searchText.includes(searchText.toLowerCase())
    )
  }
  return results
}
```

#### 3. 内容展开组件
```javascript
toggleExpand(e) {
  // 法条知识展开/收缩功能
  const itemId = e.currentTarget.dataset.id
  const expandedItems = [...this.data.expandedItems]
  const index = expandedItems.indexOf(itemId)
  
  if (index > -1) {
    expandedItems.splice(index, 1)  // 收缩
  } else {
    expandedItems.push(itemId)      // 展开
  }
  
  this.setData({ expandedItems })
}
```

#### 4. 复制功能组件
```javascript
copyItem(e) {
  // 复制完整条目内容
  const item = e.currentTarget.dataset.item
  let copyText = `${item.title}\n\n${item.summary}\n\n`
  
  if (item.sections) {
    item.sections.forEach(section => {
      copyText += `${section.title}:\n`
      section.content.forEach(content => {
        copyText += `${content.text}\n`
      })
      copyText += '\n'
    })
  }
  
  wx.setClipboardData({
    data: copyText,
    success: () => wx.showToast({title: '复制成功'})
  })
}
```

## 📊 数据统计

### 内容统计
- **法条知识**：32条
  - 入职阶段：8条 (LAW001-LAW008)
  - 在职阶段：11条 (LAW009-LAW019)  
  - 离职阶段：13条 (LAW020-LAW032)

- **维权场景**：18条
  - 入职阶段：4条 (SCENE001-SCENE004)
  - 在职阶段：7条 (SCENE005-SCENE011)
  - 离职阶段：7条 (SCENE012-SCENE018)

### 技术特性
- **搜索优化**：每条数据都包含 `searchText` 字段用于全文检索
- **标签提取**：自动从法条依据中提取法律标签
- **主键规范**：统一的ID命名规则便于管理和引用
- **数据分离**：内容与代码完全分离，便于维护更新

## 🎨 UI设计特色

### 视觉设计
- **渐变按钮**：蓝色渐变（法条知识）+ 橙色渐变（场景筛选）
- **卡片布局**：现代化卡片设计，清晰的内容层次
- **双标签系统**：橙色主题标签 + 绿色类型标签
- **展开动画**：平滑的内容展开/收缩动画效果

### 交互设计
- **实时搜索**：输入即时过滤，无需点击搜索按钮
- **智能提示**：搜索无结果时显示友好提示
- **一键操作**：复制、展开、跳转等操作一键完成
- **状态保持**：展开状态在筛选时保持不变

## 🚀 项目重构历程

### 重构目标（已完成）
- ✅ **数据规范化**：CSV数据转换为标准JS模块
- ✅ **功能增强**：双模式切换 + 搜索优化
- ✅ **UI现代化**：全新视觉设计 + 动画效果
- ✅ **代码优化**：模块化设计 + 工具函数提取

### 重构成果
- **内容扩充**：从12条增加到50条（32+18）
- **功能完善**：支持两种不同的内容展示模式
- **体验提升**：更直观的交互和更美观的界面
- **代码质量**：更好的可维护性和扩展性

## ⚡ 性能优化

### 加载优化
- **按需加载**：根据模式和筛选条件动态加载内容
- **搜索优化**：预生成搜索文本提高检索速度
- **缓存机制**：展开状态和筛选状态智能缓存

### 用户体验优化
- **快速响应**：所有交互响应时间 < 100ms
- **平滑动画**：展开/收缩使用CSS动画优化
- **错误处理**：友好的错误提示和容错机制

## 📋 使用说明

### 用户操作指南
1. **选择模式**：点击"法条知识"或"维权场景"切换内容类型
2. **筛选阶段**：选择"入职"、"在职"、"离职"或"全部"筛选内容
3. **搜索内容**：在搜索框输入关键词进行模糊搜索
4. **查看详情**：
   - 法条知识：点击条目展开查看详细内容
   - 维权场景：点击条目跳转到详情页面
5. **复制内容**：长按条目或点击复制按钮复制完整内容

### 开发维护指南
1. **数据更新**：修改对应的数据文件（`legal-knowledge.js` 或 `rights-scenarios.js`）
2. **样式调整**：修改 `core-laws.wxss` 文件
3. **功能扩展**：在 `core-laws.js` 中添加新的方法
4. **工具函数**：使用 `data/core-laws/utils/` 下的工具函数

---

**文档版本**：v2.0（重构后）  
**最后更新**：2025-08-25  
**维护状态**：✅ 已完成重构，功能稳定

*本板块已完成全面重构，数据结构规范化，功能完善，UI现代化。*
