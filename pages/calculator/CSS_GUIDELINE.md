# 计算器页面 CSS 重构指南

本文档旨在为计算器模块下所有页面的样式重构提供统一的规范和指导，确保所有页面风格一致，代码可维护性高。

## 核心设计理念

- **温暖、活泼**: 采用暖色调背景，搭配圆角、阴影和渐变，营造亲切、友好的用户体验。
- **模块化**: 将通用样式抽象成可复用的组件，提高开发效率。
- **响应式**: 使用 Flexbox 和 Grid 布局，确保在不同尺寸的屏幕上都有良好的表现。

## 1. 全局样式与文件结构

为了方便管理和复用，我们将通用样式统一放在一个文件中。

- **通用样式文件**: `pages/calculator/calculator-common.wxss`
- **页面专属样式**: 每个页面自己的 `.wxss` 文件 (例如 `index.wxss`)

**使用方法**:
在每个页面的 `.wxss` 文件顶部，首先引入通用样式文件：
```wxss
@import "./calculator-common.wxss";
```

## 2. 基础样式

### 2.1 页面背景

所有计算器页面的 `page` 元素都应设置统一的暖色背景。

**代码**: (`calculator-common.wxss`)
```wxss
page {
  background-color: #FDF8E1;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
```

### 2.2 标题

页面中的主要标题（例如 “热门计算器”），可以使用 `.page-title` 类。

**代码**: (`index.wxss` 或其他页面 wxss)
```wxss
.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  padding-left: 5px; /* 可选，用于微调对齐 */
}
```

## 3.核心组件样式

### 3.1 分类卡片 (`.category-card`)

用于展示“热门”或“推荐”的计算器，是页面的核心视觉元素。

**WXML 结构**:
```wxml
<view class="category-card">
  <view class="card-icon">
    <!-- 图标 -->
  </view>
  <view class="card-content">
    <view class="card-title">卡片标题</view>
    <view class="card-description">卡片描述</view>
  </view>
</view>
```

**WXSS 样式**: (已在 `calculator-common.wxss` 中定义)
- **布局**: 使用 `display: flex` 进行水平布局。
- **背景**: 使用 `linear-gradient` 实现从白到淡黄的渐变。
- **边框与阴影**: `border-radius: 12px` 定义圆角, `box-shadow` 提供悬浮感。
- **图标**: `.card-icon` 有固定的尺寸和背景色。
- **文字**: `.card-title` 加粗，`.card-description` 颜色较浅。

### 3.2 工具网格 (`.tools-grid` 和 `.tool-card`)

用于展示“全部工具”列表，采用双列网格布局。

**WXML 结构**:
```wxml
<view class="tools-grid">
  <block wx:for="{{tools}}" wx:key="name">
    <view class="tool-card" bindtap="navigateToCalculator" data-path="{{item.path}}">
      <view class="card-icon">{{item.icon}}</view>
      <view class="card-title">{{item.name}}</view>
    </view>
  </block>
</view>
```

**WXSS 样式**:
- **网格容器 (`.tools-grid`)**:
  - `display: grid`
  - `grid-template-columns: 1fr 1fr` (创建两列等宽网格)
  - `gap: 15px` (定义网格间距)
- **网格项 (`.tool-card`)**:
  - 结构比 `.category-card` 简单，通常只包含图标和标题。
  - 样式与 `.category-card` 类似，但尺寸更小，内边距更少。

## 4. 重构步骤建议

1. **引入通用样式**: 在目标页面的 `.wxss` 文件顶部添加 `@import "../calculator-common.wxss";`。
2. **修改页面背景**: 确保 `page` 样式生效。如果页面有自定义的容器，请将其背景设置为 `transparent` 或移除。
3. **更新 WXML 结构**:
   - 参照上面的 WXML 结构，将旧的列表结构替换为新的卡片结构。
   - 为不同的区块（如热门工具、全部工具）套上对应的容器 class（如 `.category-list`, `.tools-grid`）。
   - 为列表中的每一项应用 `.category-card` 或 `.tool-card` 类。
4. **调整页面专属样式**:
   - 将只适用于当前页面的样式（如标题、间距等）保留在页面的 `.wxss` 文件中。
   - 移除已在 `calculator-common.wxss` 中定义的重复样式。
5. **检查 JS 数据**: 确保页面的 `.js` 文件为 WXML 提供了所需的数据，特别是图标（`icon`）等新增字段。

遵循以上指南，我们可以逐步、统一地将所有计算器页面重构为新的设计风格。
