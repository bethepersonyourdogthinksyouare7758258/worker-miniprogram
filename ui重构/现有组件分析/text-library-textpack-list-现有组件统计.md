# text-library-textpack-list.wxss 现有组件统计

## 布局组件

### 页面结构
- `.container` - 主容器
- `.page-header` - 页面头部
- `.page-title` - 页面标题

## 列表组件

### 短语列表
- `.phrases-list` - 短语列表容器
- `.phrase-item` - 短语项容器
- `.phrase-item:active` - 短语项激活状态

### 短语头部
- `.phrase-header` - 短语头部区域
- `.phrase-header:active` - 短语头部激活状态
- `.phrase-title-section` - 短语标题区域
- `.phrase-title` - 短语标题

## 交互组件

### 展开控制
- `.expand-icon` - 展开图标
- `.expand-icon.expanded` - 展开状态图标

### 内容区域
- `.phrase-content` - 短语内容区域

## 提示组件

### 提示区域
- `.tips-section` - 提示区域容器
- `.tips-section::before` - 提示区域伪元素装饰
- `.tips-label` - 提示标签
- `.tips-content` - 提示内容

### 动画效果
- `@keyframes glow` - 发光动画关键帧

## 模板组件

### 模板结构
- `.template-item` - 模板项容器
- `.template-header` - 模板头部
- `.template-type` - 模板类型标识
- `.template-content` - 模板内容
- `.template-content text` - 模板内容文本

## 操作组件

### 复制按钮
- `.copy-btn` - 复制按钮基础样式
- `.copy-btn::before` - 复制按钮伪元素装饰
- `.copy-btn:active` - 复制按钮激活状态
- `.copy-btn:active::before` - 激活时伪元素状态
- `.copy-btn text` - 复制按钮文本

## 组件架构分析

### 页面层次结构
```
.container
├── .page-header
│   └── .page-title
└── .phrases-list
    └── .phrase-item (多个)
        ├── .phrase-header
        │   ├── .phrase-title-section
        │   │   └── .phrase-title
        │   └── .expand-icon (.expanded)
        └── .phrase-content
            ├── .tips-section (::before)
            │   ├── .tips-label
            │   └── .tips-content
            └── .template-item (多个)
                ├── .template-header
                │   ├── .template-type
                │   └── .copy-btn (::before, :active)
                │       └── text
                └── .template-content
                    └── text
```

### 交互设计特点
- **多层级激活状态**: `.phrase-item:active`, `.phrase-header:active`, `.copy-btn:active`
- **伪元素装饰**: `::before` 用于视觉增强效果
- **状态切换**: `.expand-icon.expanded` 展开/收缩状态
- **动画系统**: `@keyframes glow` 提供视觉反馈

### 设计模式
- **手风琴式展开**: 可展开/收缩的内容区域
- **卡片嵌套**: 模板项嵌套在短语项中
- **操作反馈**: 完整的按钮交互状态
- **视觉层次**: 通过伪元素和动画强化界面

## 组件总数统计
- **布局组件**: 3个（容器、页面头部、页面标题）
- **列表组件**: 3个（列表容器、短语项、激活状态）
- **头部组件**: 4个（头部区域、激活态、标题区域、标题）
- **交互组件**: 3个（展开图标、展开状态、内容区域）
- **提示组件**: 4个（提示区域、伪元素、标签、内容）
- **模板组件**: 4个（模板项、头部、类型、内容及文本）
- **操作组件**: 5个（复制按钮相关的5个状态）
- **动画效果**: 1个（发光动画）
- **总计**: 27个样式组件

## 设计特色
- **复杂的嵌套结构**: 支持多层级内容展示
- **丰富的交互反馈**: 多种激活状态和动画效果
- **伪元素装饰系统**: 增强视觉表现力
- **手风琴式用户体验**: 节省空间的展开收缩设计