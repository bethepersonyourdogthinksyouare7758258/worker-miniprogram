# docgen-list.wxss 现有组件统计

## 布局组件

### 页面结构
- `.container` - 主容器
- `.header` - 页面头部
- `.title` - 主标题
- `.subtitle` - 副标题

## 文档类型组件

### 类型选择区域
- `.document-types` - 文档类型区域容器
- `.section-title` - 区域标题
- `.type-cards` - 类型卡片容器

### 卡片组件
- `.type-card` - 类型卡片基础样式
- `.type-card::before` - 卡片伪元素装饰
- `.type-card:hover` - 卡片悬停状态
- `.card-icon` - 卡片图标
- `.card-title` - 卡片标题
- `.card-desc` - 卡片描述

## 帮助区域组件

### 帮助内容
- `.help-section` - 帮助区域容器
- `.help-content` - 帮助内容区域
- `.help-item` - 帮助项
- `.step-number` - 步骤编号
- `.step-text` - 步骤文本
- `.help-note` - 帮助提示

## 响应式设计

### 中等屏幕适配
```css
@media (min-width: 750rpx) {
  .type-cards { ... }
  .type-card { ... }
}
```

### 大屏幕适配
```css
@media (min-width: 1024rpx) {
  .type-cards { ... }
}
```

## 组件架构分析

### 页面层次结构
```
.container
├── .header
│   ├── .title
│   └── .subtitle
├── .document-types
│   ├── .section-title
│   └── .type-cards
│       └── .type-card (多个)
│           ├── ::before (伪元素)
│           ├── .card-icon
│           ├── .card-title
│           └── .card-desc
└── .help-section
    ├── .help-content
    │   └── .help-item (多个)
    │       ├── .step-number
    │       └── .step-text
    └── .help-note
```

### 交互设计特点
- **悬停效果**: `:hover` 状态提供桌面端交互反馈
- **伪元素装饰**: `::before` 增强卡片视觉效果
- **响应式布局**: 三个断点的自适应设计
- **引导式帮助**: 步骤化的使用说明

### 设计模式
- **卡片网格布局**: 类型选择的网格展示
- **渐进式响应**: 750rpx和1024rpx两个关键断点
- **引导式交互**: 清晰的步骤说明和帮助提示
- **桌面优化**: hover状态适配桌面交互

## 组件总数统计
- **布局组件**: 4个（容器、头部、主标题、副标题）
- **类型组件**: 3个（类型区域、区域标题、卡片容器）
- **卡片组件**: 5个（卡片基础、伪元素、悬停态、图标、标题、描述）
- **帮助组件**: 6个（帮助区域、内容、项目、编号、文本、提示）
- **响应式规则**: 2个媒体查询断点
- **总计**: 18个样式组件 + 2个响应式规则

## 设计特色
- **跨设备适配**: 完整的响应式设计体系
- **桌面端优化**: hover交互适配PC端使用
- **用户引导**: 内置帮助系统提升易用性
- **现代卡片设计**: 伪元素装饰和悬停效果

## 响应式特点
- **移动端优先**: 基础样式针对小屏设计
- **中屏适配**: 750rpx断点调整卡片布局
- **大屏优化**: 1024rpx断点进一步优化展示效果