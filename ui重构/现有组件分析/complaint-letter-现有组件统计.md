# complaint-letter.wxss 现有组件统计

## 页面布局组件

### 主要容器
- `.page-container` - 页面主容器
- `.form-container` - 表单容器
- `.preview-container` - 预览容器

## 头部组件

### 头部区域
- `.header-section` - 头部区域
- `.back-button-wrapper` - 返回按钮包装器
- `.back-button` - 返回按钮
- `.back-button:active` - 返回按钮激活状态
- `.back-icon` - 返回图标
- `.back-text` - 返回文本

### 标题区域
- `.title-area` - 标题区域
- `.page-title` - 页面标题
- `.help-hint` - 帮助提示
- `.help-hint .hint-text` - 提示文本

## 表单组件

### 表单卡片
- `.form-card` - 表单卡片
- `.form-card::before` - 表单卡片伪元素装饰
- `.card-header` - 卡片头部
- `.card-icon` - 卡片图标
- `.card-title` - 卡片标题

### 输入组件
- `.input-group` - 输入组
- `.input-group .form-picker` - 组内选择器
- `.input-label` - 输入标签
- `.required-mark` - 必填标记
- `.form-input, .form-textarea` - 输入框和文本域
- `.form-input:focus, .form-textarea:focus` - 聚焦状态
- `.form-textarea` - 文本域
- `.readonly-field` - 只读字段

### 选择器组件
- `.form-picker` - 表单选择器
- `.picker-content` - 选择器内容
- `.form-picker text` - 选择器文本
- `.form-picker > text` - 直接子文本
- `.form-picker:active` - 选择器激活状态
- `.form-picker:active .picker-content` - 激活时内容状态
- `.form-picker:hover` - 选择器悬停状态
- `.form-picker:hover .picker-content` - 悬停时内容状态

## 按钮组件

### 生成按钮
- `.button-section` - 按钮区域
- `.generate-button` - 生成按钮
- `.generate-button::before` - 生成按钮伪元素
- `.generate-button:hover::before` - 悬停时伪元素
- `.generate-button:active` - 生成按钮激活状态
- `.generate-button.disabled` - 禁用状态
- `.generate-button.disabled:active` - 禁用时激活状态

### 操作按钮
- `.action-section` - 操作区域
- `.copy-button, .share-button` - 复制和分享按钮通用样式
- `.copy-button` - 复制按钮
- `.copy-button:active` - 复制按钮激活状态
- `.share-button` - 分享按钮
- `.share-button:active` - 分享按钮激活状态

## 预览组件

### 预览区域
- `.preview-header` - 预览头部
- `.preview-header::before` - 预览头部伪元素
- `.preview-title` - 预览标题
- `.document-display` - 文档显示区域
- `.document-text` - 文档文本

## 选项组件

### 投诉选项
- `.complaint-options` - 投诉选项容器
- `.complaint-item` - 投诉项
- `.complaint-item.selected` - 已选中项
- `.complaint-item:active` - 激活状态
- `.complaint-item:not(.selected):active` - 未选中时激活状态

### 复选框组件
- `.custom-checkbox` - 自定义复选框
- `.custom-checkbox.checked` - 已选中复选框
- `.check-icon` - 选中图标

## 内容组件

### 区域标识
- `.field-section-header` - 字段区域头部
- `.complaint-label` - 投诉标签
- `.section-subtitle` - 区域副标题
- `.input-hint` - 输入提示

### 摘要组件
- `.selected-items-summary` - 已选项摘要
- `.summary-text` - 摘要文本
- `.selected-list` - 已选列表
- `.selected-item` - 已选项

## 响应式设计

### 中等屏幕适配
```css
@media (min-width: 750rpx) {
  .form-card { ... }
  .form-container { ... }
  .button-section, .preview-container { ... }
}
```

## 组件架构分析

### 页面层次结构
```
.page-container
├── .header-section
│   ├── .back-button-wrapper
│   │   └── .back-button (:active)
│   │       ├── .back-icon
│   │       └── .back-text
│   └── .title-area
│       ├── .page-title
│       └── .help-hint
│           └── .hint-text
├── .form-container
│   └── .form-card (::before)
│       ├── .card-header
│       │   ├── .card-icon
│       │   └── .card-title
│       ├── .input-group
│       │   ├── .input-label (.required-mark)
│       │   ├── .form-input/.form-textarea (:focus)
│       │   └── .form-picker (:active, :hover)
│       │       └── .picker-content
│       ├── .complaint-options
│       │   └── .complaint-item (.selected, :active)
│       │       └── .custom-checkbox (.checked)
│       │           └── .check-icon
│       └── .selected-items-summary
│           ├── .summary-text
│           └── .selected-list
│               └── .selected-item
├── .button-section
│   └── .generate-button (::before, :hover, :active, .disabled)
└── .preview-container
    ├── .preview-header (::before)
    │   └── .preview-title
    ├── .document-display
    │   └── .document-text
    └── .action-section
        ├── .copy-button (:active)
        └── .share-button (:active)
```

### 交互设计特点
- **多状态管理**: `:active`, `:hover`, `:focus`, `.selected`, `.disabled` 等多种状态
- **伪元素装饰**: `::before` 用于视觉增强效果
- **自定义组件**: 复选框、选择器等自定义表单组件
- **响应式适配**: 750rpx断点的布局调整

### 设计模式
- **表单向导式**: 分步骤的表单填写体验
- **实时预览**: 生成内容的即时预览功能
- **状态反馈**: 丰富的交互状态和视觉反馈
- **移动优先**: 针对移动端优化的交互设计

## 组件总数统计
- **页面布局**: 3个（主容器、表单容器、预览容器）
- **头部组件**: 8个（头部区域、返回按钮相关、标题区域相关）
- **表单组件**: 12个（表单卡片、输入组件、标签等）
- **选择器组件**: 8个（选择器及其各种状态）
- **按钮组件**: 10个（生成按钮、操作按钮及其状态）
- **预览组件**: 5个（预览相关组件）
- **选项组件**: 8个（投诉选项、复选框组件）
- **内容组件**: 8个（区域标识、摘要组件）
- **响应式规则**: 1个媒体查询
- **总计**: 62个样式组件 + 1个响应式规则

## 设计特色
- **复杂表单系统**: 支持多种输入类型和验证
- **实时交互反馈**: 丰富的状态变化和动画效果
- **自定义UI组件**: 完整的自定义表单组件库
- **文档生成流程**: 从表单填写到文档预览的完整流程