# core-laws-api 现有组件统计

## 布局组件
- `.container` - 主容器（背景色#FDF8E1，最小高度100vh）
- `.header` - 头部区域（垂直居中布局）
- `.title` - 主标题（48rpx，粗体黑色）

## 服务器状态组件
- `.server-selector-simple` - 服务器选择器容器（右上角绝对定位）
- `.server-status-dot` - 状态指示圆点（12rpx圆形）
  - `.online` - 在线状态（绿色#52c41a + 阴影）
  - `.offline` - 离线状态（红色#ff4d4f + 阴影）
  - `.unknown` - 未知状态（黄色#faad14 + 脉冲动画）
- `.server-picker` - 选择器容器（白色背景，圆角，阴影）
- `.current-server` - 当前服务器文本（22rpx）
- `.picker-arrow` - 下拉箭头（16rpx）

## 搜索组件
- `.search-section` - 搜索区域（网格居中布局）
- `.search-input` - 搜索输入框（180%宽度，40rpx圆角）
- `.search-tip` - 搜索提示文本（24rpx灰色）

## 标签页组件
- `.mode-tabs` - 模式切换容器（白色背景，50rpx圆角）
- `.mode-tab` - 模式标签（弹性布局，30rpx字体）
  - `.active` - 激活状态（蓝色渐变#74b9ff到#0984e3）
- `.filter-tabs` - 筛选标签容器（横向居中布局）
- `.filter-tab` - 筛选标签（固定150rpx×80rpx，30rpx圆角）
  - `.active` - 激活状态（红色渐变#ff7675到#e17055）

## 内容列表组件
- `.content-list` - 内容列表容器
- `.content-item` - 内容项（白色卡片，20rpx圆角，阴影）
- `.item-main` - 项目主体（30rpx内边距）
- `.item-header` - 项目头部（弹性布局，空间分布）
- `.item-title` - 项目标题（32rpx，600字重）
- `.item-indicator` - 指示器容器
- `.expand-icon` / `.navigate-icon` - 展开/导航图标（32rpx×32rpx）
- `.item-tags` - 标签容器（12rpx间距）
- `.item-summary` - 项目摘要（28rpx，#666颜色）

## 展开内容组件
- `.item-expanded` - 展开区域（#fafafa背景，展开动画）
- `.legal-basis-section` - 法律依据区域
- `.tool-link-section` - 工具链接区域
- `.section-header` - 区域头部（弹性布局）
- `.section-title` - 区域标题（28rpx，600字重）
- `.copy-btn` - 复制按钮（蓝色渐变，20rpx圆角）
- `.section-content` - 区域内容
- `.legal-basis-text` / `.tool-link-text` - 文本内容（26rpx，#555颜色）

## 标签组件
- `.tag` - 基础标签（8rpx×16rpx内边距，20rpx圆角）
- `.tag-primary` - 主要标签（红色渐变）
- `.tag-secondary` - 次要标签（绿色渐变）

## 信息组件
- `.provider-info` - 提供者信息（#f8f9fa背景）
- `.provider-label` - 提供者标签（24rpx，#666）
- `.provider-name` - 提供者名称（24rpx，#333，500字重）
- `.reviewer-status` - 审核状态（24rpx，#999）

## 操作组件
- `.item-actions` - 操作区域（居中对齐）
- `.copy-all-btn` - 全部复制按钮（绿色渐变，30rpx圆角）

## 状态组件
- `.loading` - 加载状态（居中，26rpx）
- `.empty-state` - 空状态容器（居中，100rpx内边距）
- `.empty-icon` - 空状态图标（120rpx×120rpx，30%透明度）
- `.empty-text` - 空状态文本（32rpx，#999）
- `.empty-hint` - 空状态提示（26rpx，#ccc）

## 统计组件
- `.stats-info` - 统计信息（居中对齐）
- `.stats-text` - 统计文本（24rpx，#999）

## 动画效果
- `@keyframes pulse` - 脉冲动画
- `@keyframes expandDown` - 展开动画
- 各种`:active`交互效果

## 响应式设计
- `@media (max-width: 375px)` - 小屏幕适配

## 统计总结
- **总组件数**: 约50+个样式组件
- **主要色彩**:
  - 蓝色渐变: #74b9ff → #0984e3
  - 红色渐变: #ff7675 → #e17055
  - 绿色渐变: #00b894 → #00a085
  - 背景色: #FDF8E1
- **交互特性**: 缩放动画、颜色过渡、阴影效果
- **响应式**: 支持小屏幕设备适配
- **功能覆盖**: 完整的法条API页面所有UI功能