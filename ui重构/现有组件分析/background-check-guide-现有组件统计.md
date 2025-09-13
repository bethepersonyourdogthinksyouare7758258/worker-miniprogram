# background-check-guide.wxss 现有组件统计

## 引用关系
- `@import "../../styles/index.wxss"` - 引入全局样式系统

## 布局组件

### 基础容器
- `.container` - 主容器（20rpx内边距，#FDF8E1背景，最小高度100vh）
- `.header` - 头部区域（居中对齐，40rpx×20rpx内边距，30rpx底边距）
- `.content` - 内容区域（0×10rpx内边距）

### 标题组件
- `.title` - 主标题（48rpx，粗体，黑色，独占一行，20rpx底边距）
- `.subtitle` - 副标题（28rpx，#333颜色，独占一行，1.5行高）

## 内容区域组件

### 区域结构
- `.section` - 内容区域（白色背景，30rpx底边距，16rpx圆角，30rpx内边距，阴影）
- `.section-header` - 区域头部（20rpx底边距）
- `.section-title` - 区域标题（32rpx，粗体，#2c3e50颜色，1.4行高）
- `.section-content` - 区域内容（1.6行高）
- `.description` - 描述文本（28rpx，#34495e颜色，20rpx底边距，1.6行高）

## 提示组件

### 提示框类型
- `.tip` - 提示框（#FFFACD背景，20rpx内边距，12rpx圆角，20rpx上边距，左侧金色6rpx边框）
- `.tip-text` - 提示文本（26rpx，#333颜色，500字重）

- `.warning` - 警告框（#ffeaa7背景，20rpx内边距，12rpx圆角，20rpx上边距，左侧橙色6rpx边框）
- `.warning-text` - 警告文本（26rpx，#e17055颜色，500字重）

- `.note` - 注意框（#d1f2eb背景，20rpx内边距，12rpx圆角，20rpx上边距，左侧绿色6rpx边框）
- `.note-text` - 注意文本（26rpx，#00a085颜色，500字重）

## 链接组件

### 链接框
- `.link-box` - 链接容器（#e8f4f8背景，20rpx内边距，12rpx圆角，左侧蓝色6rpx边框，弹性布局）
- `.link-text` - 链接文本（24rpx，#2980b9颜色，等宽字体，自动换行，1.4行高）
- `.copy-link-btn` - 复制链接按钮（蓝色渐变，白色文字，20rpx圆角，60rpx高度）
- `.copy-link-btn:active` - 按钮激活状态（缩放0.95，透明度0.8）

## 摘要组件

### 摘要区域
- `.summary` - 摘要容器（40rpx内边距，40rpx上下边距，居中对齐）
- `.summary-header` - 摘要头部（20rpx底边距）
- `.summary-title` - 摘要标题（36rpx，粗体，黑色，独占一行）
- `.summary-content` - 摘要内容（1.6行高）
- `.summary-text` - 摘要文本（28rpx，#333颜色，1.6行高）

## 操作组件

### 操作按钮
- `.actions` - 操作区域（弹性布局，两端分布，20rpx间距，40rpx上边距）
- `.copy-btn, .share-btn` - 按钮通用样式（弹性1，80rpx高度，40rpx圆角，30rpx字体）
- `.copy-btn` - 复制按钮（蓝色渐变背景）
- `.share-btn` - 分享按钮（粉色渐变背景）
- `.copy-btn:active, .share-btn:active` - 按钮激活状态（缩放0.98）

## 响应式设计

### 小屏幕适配
```css
@media (max-width: 375px) {
  .title { font-size: 42rpx; }
  .section-title { font-size: 28rpx; }
  .description { font-size: 26rpx; }
}
```

## 组件架构分析

### 页面层次结构
```
.container
├── .header
│   ├── .title
│   └── .subtitle
├── .content
│   └── .section (多个)
│       ├── .section-header
│       │   └── .section-title
│       └── .section-content
│           ├── .description
│           ├── .tip
│           │   └── .tip-text
│           ├── .warning
│           │   └── .warning-text
│           ├── .note
│           │   └── .note-text
│           └── .link-box
│               ├── .link-text
│               └── .copy-link-btn (:active)
├── .summary
│   ├── .summary-header
│   │   └── .summary-title
│   └── .summary-content
│       └── .summary-text
└── .actions
    ├── .copy-btn (:active)
    └── .share-btn (:active)
```

### 设计特征

#### 色彩系统
- **背景色**: #FDF8E1（主背景）、白色（卡片背景）
- **文字色**: #000（标题）、#333（正文）、#2c3e50（区域标题）、#34495e（描述）
- **提示色**:
  - 提示：#FFFACD背景 + #FFD700边框
  - 警告：#ffeaa7背景 + #fdcb6e边框 + #e17055文字
  - 注意：#d1f2eb背景 + #00b894边框 + #00a085文字
- **按钮渐变**:
  - 蓝色：#74b9ff → #0984e3
  - 粉色：#fd79a8 → #e84393
  - 链接蓝：#3498db → #2980b9

#### 布局系统
- **卡片式设计**: 白色背景 + 圆角 + 阴影
- **左边框强调**: 不同类型提示框的彩色左边框
- **弹性布局**: 操作按钮和链接框的响应式布局

#### 交互设计
- **按钮反馈**: 点击缩放效果
- **响应式**: 375px断点的字体大小调整

## 组件总数统计
- **布局组件**: 5个（容器、头部、内容、标题组件）
- **内容组件**: 5个（区域结构相关）
- **提示组件**: 6个（三种提示框及其文本）
- **链接组件**: 4个（链接框、文本、按钮及状态）
- **摘要组件**: 5个（摘要相关组件）
- **操作组件**: 5个（操作区域和按钮）
- **响应式规则**: 1个媒体查询
- **总计**: 30个样式组件 + 1个响应式规则

## 设计特色
- **信息分层系统**: 通过不同颜色和样式区分信息重要性
- **提示框体系**: 完整的提示/警告/注意信息展示
- **渐变按钮设计**: 现代化的渐变色彩搭配
- **卡片化布局**: 清晰的内容分区和视觉层次