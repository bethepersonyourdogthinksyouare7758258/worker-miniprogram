# app.wxss 全局样式统计

## 全局样式组件

### 页面基础样式
```css
page {
  background-color: #FDF8E1;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}
```

### 通用容器样式
```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
```

## 样式特征分析

### 色彩系统
- **主背景色**: `#FDF8E1` (淡黄色，与core-laws-api保持一致)

### 字体系统
- **字体栈**: 系统字体优先级排列
  - iOS: `-apple-system`
  - Android/Windows: `BlinkMacSystemFont`, `'Segoe UI'`, `Roboto`
  - 备用字体: `'Helvetica Neue'`, `Arial`, `'Noto Sans'`, `sans-serif`
  - 表情字体: `'Apple Color Emoji'`, `'Segoe UI Emoji'`, `'Segoe UI Symbol'`, `'Noto Color Emoji'`

### 布局系统
- **容器布局**: Flexbox垂直布局
- **对齐方式**: 水平居中，垂直两端分布
- **内边距**: 上下200rpx，左右0
- **盒模型**: border-box

## 设计规范
- **跨平台兼容**: 字体系统适配iOS/Android/Windows
- **色彩一致性**: 与各页面保持#FDF8E1主题色
- **布局标准**: Flexbox现代布局方案
- **响应式基础**: rpx单位适配不同屏幕

## 全局组件总数
- **基础组件**: 2个 (`page`, `.container`)
- **设计原则**: 简洁、一致、跨平台