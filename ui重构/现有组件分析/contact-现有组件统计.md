# contact.wxss 现有组件统计

## 引用关系
- `@import "../../styles/index.wxss"` - 引入全局样式系统

## 设计系统特点
**使用CSS变量系统** - 该页面大量使用CSS变量（如`var(--spacing-lg)`、`var(--color-bg-primary)`等），表明有完整的设计令牌系统

## 介绍内容组件

### 介绍区域
- `.intro-content` - 介绍内容容器（纵向弹性布局，大间距）
- `.intro-item` - 介绍项（弹性布局，大内边距，主背景色，大圆角，过渡动画）
- `.intro-item:active` - 介绍项激活状态（背景变为#F5F2E6，缩放0.98）
- `.intro-icon` - 介绍图标（超大字体，大右边距，小上边距）
- `.intro-text` - 介绍文本容器（弹性1，纵向布局）
- `.intro-title` - 介绍标题（大字体，半粗，主文字色，小底边距）
- `.intro-desc` - 介绍描述（基础字体，三级文字色，松散行高）

## 特色功能组件

### 功能网格
- `.features-grid` - 特色功能网格（网格布局，2列，大间距）
- `.feature-item` - 功能项（次级背景，边框，大圆角，超大内边距，居中，过渡）
- `.feature-item:active` - 功能项激活状态（上移2rpx，大阴影）
- `.feature-icon` - 功能图标（超大字体，中等底边距，独占一行）
- `.feature-name` - 功能名称（中等字体，半粗，主文字色，小底边距）
- `.feature-desc` - 功能描述（小字体，三级文字色，独占一行）

## 反馈组件

### 反馈表单
- `.feedback-content` - 反馈内容（纵向弹性布局）
- `.feedback-textarea` - 反馈文本域（全宽，最小200rpx高，大内边距，次级边框，大圆角，次级背景，聚焦态）
- `.feedback-textarea:focus` - 文本域聚焦状态（主文字色边框，rgba阴影）
- `.textarea-footer` - 文本域页脚（弹性布局，右对齐，小上边距，大下边距）
- `.char-count` - 字符计数（小字体，四级文字色）

## FAQ组件

### 问答列表
- `.faq-list` - FAQ列表（纵向弹性布局，中等间距）
- `.faq-item` - FAQ项（主背景色，大圆角，隐藏溢出，过渡）
- `.faq-question` - FAQ问题（弹性布局，两端对齐，大内边距，指针光标，过渡）
- `.faq-question:active` - 问题激活状态（背景#F5F2E6）
- `.faq-q` - 问题文本（中等字体，中等字重，主文字色，弹性1，大右内边距）
- `.faq-arrow` - FAQ箭头（小字体，三级文字色，变换过渡）
- `.faq-answer` - FAQ答案（内边距，下滑动画）
- `@keyframes slideDown` - 下滑动画（透明度和位移变化）
- `.faq-a` - 答案文本（基础字体，三级文字色，松散行高）

## 页脚组件

### 页脚区域
- `.footer-section` - 页脚区域（居中，大内边距）
- `.footer-text` - 页脚文本（大字体，次级文字色，小底边距，中等字重）
- `.footer-desc` - 页脚描述（基础字体，四级文字色，独占一行）

## 响应式设计

### 小屏幕适配 (max-width: 375px)
```css
@media (max-width: 375px) {
  .features-grid { grid-template-columns: 1fr; gap: var(--spacing-md); }
  .feature-item { padding: var(--spacing-lg); }
  .intro-item { padding: var(--spacing-md); }
  .intro-icon { font-size: var(--font-size-xl); margin-right: var(--spacing-md); }
}
```

### 中大屏幕适配 (min-width: 750px)
```css
@media (min-width: 750px) {
  .features-grid { grid-template-columns: repeat(4, 1fr); gap: var(--spacing-xl); }
  .intro-content { gap: var(--spacing-xl); }
}
```

## 组件架构分析

### 页面层次结构
```
页面容器
├── .intro-content
│   └── .intro-item (多个) (:active)
│       ├── .intro-icon
│       └── .intro-text
│           ├── .intro-title
│           └── .intro-desc
├── .features-grid (:active适配)
│   └── .feature-item (多个) (:active)
│       ├── .feature-icon
│       ├── .feature-name
│       └── .feature-desc
├── .feedback-content
│   ├── .feedback-textarea (:focus)
│   └── .textarea-footer
│       └── .char-count
├── .faq-list
│   └── .faq-item (多个)
│       ├── .faq-question (:active)
│       │   ├── .faq-q
│       │   └── .faq-arrow
│       └── .faq-answer (slideDown动画)
│           └── .faq-a
└── .footer-section
    ├── .footer-text
    └── .footer-desc
```

### 设计特征

#### CSS变量系统
- **间距系统**: `--spacing-xs/sm/md/lg/xl/2xl/3xl/4xl/5xl`
- **颜色系统**: `--color-bg-primary/secondary`、`--color-text-primary/secondary/tertiary/quaternary`、`--color-border-secondary/tertiary`
- **字体系统**: `--font-size-sm/base/md/lg/xl/2xl/3xl`、`--font-weight-medium/semibold`、`--font-family-base`
- **其他**: `--radius-lg`、`--transition-normal`、`--shadow-lg`、`--line-height-relaxed`

#### 交互设计
- **统一反馈**: `:active`状态的缩放、背景色变化
- **平滑动画**: slideDown关键帧动画
- **聚焦状态**: 输入框的边框和阴影变化
- **响应式网格**: 2列→1列→4列的自适应

#### 现代设计模式
- **设计令牌**: 完整的CSS变量设计系统
- **组件化**: 高度模块化的组件结构
- **可访问性**: 光标、聚焦状态等细节考虑
- **多端适配**: 移动端优先的响应式设计

## 组件总数统计
- **介绍组件**: 7个（内容、项目、状态、图标、文本、标题、描述）
- **功能组件**: 6个（网格、项目、状态、图标、名称、描述）
- **反馈组件**: 5个（内容、文本域、聚焦态、页脚、计数）
- **FAQ组件**: 8个（列表、项目、问题、状态、文本、箭头、答案、动画）
- **页脚组件**: 3个（区域、文本、描述）
- **响应式规则**: 2个媒体查询
- **总计**: 29个样式组件 + 2个响应式规则 + 1个关键帧动画

## 设计特色
- **完整设计令牌系统**: CSS变量驱动的统一设计语言
- **现代交互体验**: 平滑动画和细致的状态反馈
- **优秀响应式设计**: 三个断点的完整适配
- **组件化架构**: 高度解耦的模块化设计