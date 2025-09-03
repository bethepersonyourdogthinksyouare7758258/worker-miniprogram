# 全局样式系统使用指南

## 📖 简介

这个全局样式系统是为微信小程序"打工者生存工具包"设计的，目标是：
- **统一样式** - 确保整个应用的视觉一致性
- **提高效率** - 减少重复代码，快速开发页面
- **易于维护** - 集中管理样式，修改一处即可全局生效
- **新手友好** - 提供清晰的命名和使用方法

## 📁 文件结构

```
styles/
├── design-tokens.wxss     # 设计令牌（颜色、字体、间距变量）
├── base.wxss             # 基础样式（页面重置、默认样式）
├── components.wxss       # 通用组件样式（按钮、卡片、表单）
├── utilities.wxss        # 工具类样式（间距、布局、颜色）
└── index.wxss           # 主入口文件（引入所有样式）
```

## 🚀 快速开始

### 第一步：引入样式系统

在你的页面样式文件（如 `home.wxss`）顶部添加：

```css
/* 引入全局样式系统 */
@import "../../styles/index.wxss";

/* 然后在下面写你的页面特有样式 */
.my-special-style {
  /* 你的自定义样式 */
}
```

### 第二步：使用基础容器

在你的 WXML 文件中使用标准容器：

```xml
<!-- 标准页面结构 -->
<view class="page-container">
  <view class="content-container">
    <!-- 你的页面内容 -->
    <text class="title-1">页面标题</text>
    <text class="text-body">正文内容</text>
  </view>
</view>
```

### 第三步：开始使用组件和工具类

```xml
<!-- 使用按钮组件 -->
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-secondary btn--lg">大号次要按钮</button>

<!-- 使用卡片组件 -->
<view class="card">
  <view class="card-header">
    <text class="card-title">卡片标题</text>
  </view>
  <view class="card-body">
    <text class="text-body">卡片内容</text>
  </view>
</view>

<!-- 使用工具类 -->
<view class="d-flex justify-between items-center p-lg mb-md">
  <text class="text-primary">左侧</text>
  <text class="text-secondary">右侧</text>
</view>
```

## 🎨 颜色系统 - 温暖黑白配色方案

### 核心设计理念 🌟

我们采用**温暖黑白配色方案**：
- 🌞 **暖黄背景**: 营造温馨舒适的使用环境
- ⚫ **黑色按钮**: 专业稳重，统一视觉体验  
- 📝 **深炭标题**: 非纯黑色，更温和易读
- 🎯 **清晰层次**: 通过颜色深浅建立信息层级

### 主要颜色变量

```css
/* ✅ 实际使用的颜色系统 */
.my-page {
  background-color: var(--color-bg-primary);     /* 暖黄色背景 #FDF8E1 */
}

.my-button {
  background: #333333;                           /* 统一黑色按钮背景 */
  color: #ffffff;                               /* 白色文字 */
  border-radius: 12rpx;                        /* 圆润圆角 */
  box-shadow: 0 4rpx 12rpx rgba(51, 51, 51, 0.15); /* 柔和阴影 */
}

.my-button-secondary {
  background: #ffffff;                          /* 白色背景（次要按钮）*/
  color: #333333;                              /* 黑色文字 */
  border: 2rpx solid #333333;                 /* 黑色边框 */
}

.my-card {
  background-color: var(--color-bg-secondary);   /* 白色卡片背景 */
  border: 1rpx solid var(--color-border-primary); /* 浅色边框 */
}

.my-title {
  color: var(--color-text-primary);             /* 深炭灰 #2C2C2C */
}

.my-content {
  color: var(--color-text-tertiary);            /* 中等灰色 #666666 */
}
```

### 颜色层级体系

```xml
<!-- 背景色层级 -->
<view class="bg-primary">暖黄色页面背景 #FDF8E1</view>
<view class="bg-secondary">白色卡片背景 #FFFFFF</view>

<!-- 按钮色系（统一黑白风格）-->
<button class="btn">黑色主按钮 #333333</button>
<button class="btn btn-secondary">白色次按钮 + 黑边框</button>

<!-- 文字颜色层级（深浅递减）-->
<text class="text-primary">深炭灰标题 #2C2C2C</text>
<text class="text-secondary">中深灰副标题 #4A4A4A</text>  
<text class="text-tertiary">中等灰正文 #666666</text>
<text class="text-quaternary">浅灰辅助信息 #888888</text>

<!-- 功能色彩（保持原有）-->
<text class="text-success">成功状态 #52C41A</text>
<text class="text-warning">警告状态 #FAAD14</text>
<text class="text-error">错误状态 #FF4D4F</text>
```

## 📝 文字系统

### 标题层级

```xml
<text class="title-1">一级标题（最大）</text>
<text class="title-2">二级标题</text>
<text class="title-3">三级标题</text>
<text class="title-4">四级标题（最小）</text>
```

### 正文文字

```xml
<text class="text-body">正常正文</text>
<text class="text-body-sm">小号正文</text>
<text class="text-caption">说明文字</text>
```

### 文字对齐

```xml
<text class="text-left">左对齐</text>
<text class="text-center">居中对齐</text>
<text class="text-right">右对齐</text>
```

### 文字截断

```xml
<!-- 单行截断 -->
<text class="text-ellipsis">这是一段很长的文字会被截断...</text>

<!-- 多行截断 -->
<text class="text-ellipsis-2">这是一段很长的文字，最多显示两行，超出部分会被截断...</text>
<text class="text-ellipsis-3">这是一段很长的文字，最多显示三行，超出部分会被截断...</text>
```

## 🎛️ 按钮组件

### 基础按钮 - 统一黑白风格 ⚫

```xml
<!-- ✅ 新的统一按钮样式（都是黑底白字）-->
<button class="btn">默认按钮（黑底白字）</button>
<button class="btn btn-primary">主要按钮（黑底白字）</button>
<button class="btn btn-secondary">次要按钮（白底黑字）</button>
<button class="btn btn-success">成功按钮（黑底白字+绿色阴影）</button>
<button class="btn btn-warning">警告按钮（黑底白字+橙色阴影）</button>
```

**重要变更**：
- 🚫 不再使用蓝色渐变背景
- ✅ 统一使用 `#333333` 黑色背景
- ✅ 通过阴影颜色区分按钮类型

### 按钮尺寸

```xml
<button class="btn btn-primary btn--xs">极小按钮</button>
<button class="btn btn-primary btn--sm">小按钮</button>
<button class="btn btn-primary">标准按钮</button>
<button class="btn btn-primary btn--lg">大按钮</button>
<button class="btn btn-primary btn--xl">特大按钮</button>
```

### 按钮形状

```xml
<button class="btn btn-primary btn--rounded">圆角按钮</button>
<button class="btn btn-primary btn--circle">●</button>
<button class="btn btn-primary btn--block">全宽按钮</button>
```

### 按钮状态

```xml
<button class="btn btn-primary disabled">禁用状态</button>
<button class="btn btn-primary loading">加载状态</button>
```

## 🃏 卡片组件

### 基础卡片

```xml
<view class="card">
  <view class="card-header">
    <text class="card-title">卡片标题</text>
    <text class="card-subtitle">卡片副标题</text>
  </view>
  <view class="card-body">
    <text class="text-body">这里是卡片的主要内容</text>
  </view>
  <view class="card-footer">
    <button class="btn btn-primary btn--sm">确定</button>
    <button class="btn btn-outline btn--sm">取消</button>
  </view>
</view>
```

### 列表卡片（用于列表项）

```xml
<view class="list-card clickable" bindtap="onItemTap">
  <view class="list-card-content">
    <text class="list-card-icon">📄</text>
    <view class="list-card-text">
      <text class="list-card-title">列表项标题</text>
      <text class="list-card-desc">列表项描述信息</text>
    </view>
    <text class="list-card-arrow">></text>
  </view>
</view>
```

### 卡片变体

```xml
<view class="card card--bordered">带边框的卡片</view>
<view class="card card--primary">带主题色左边框的卡片</view>
<view class="card card--gradient">渐变背景卡片</view>
```

## 📝 表单组件

### 完整的表单示例

```xml
<view class="form-group">
  <text class="form-label required">用户名</text>
  <input class="form-control" placeholder="请输入用户名" />
  <text class="form-hint">用户名长度为3-20个字符</text>
</view>

<view class="form-group">
  <text class="form-label">密码</text>
  <input class="form-control" type="password" placeholder="请输入密码" />
  <text class="form-error">密码不能少于6位</text>
</view>

<view class="form-group">
  <text class="form-label">个人简介</text>
  <textarea class="form-control form-textarea" placeholder="请输入个人简介"></textarea>
</view>

<view class="form-group">
  <text class="form-label">选择城市</text>
  <picker class="form-control form-picker">
    <view class="form-picker-placeholder">请选择城市</view>
  </picker>
</view>

<button class="btn btn-primary btn--block">提交</button>
```

## 📐 布局工具类

### Flexbox 布局

```xml
<!-- 水平布局 -->
<view class="d-flex">
  <view class="flex-1">左侧内容（占剩余空间）</view>
  <view>右侧内容</view>
</view>

<!-- 垂直布局 -->
<view class="d-flex flex-column">
  <view>顶部内容</view>
  <view>底部内容</view>
</view>

<!-- 居中对齐 -->
<view class="d-flex justify-center items-center">
  <view>水平垂直居中的内容</view>
</view>

<!-- 两端对齐 -->
<view class="d-flex justify-between items-center">
  <view>左侧</view>
  <view>右侧</view>
</view>
```

### 间距工具类

```xml
<!-- 外边距 -->
<view class="m-lg">大外边距</view>
<view class="mt-md mb-lg">上中外边距，下大外边距</view>
<view class="mx-auto">水平居中</view>

<!-- 内边距 -->
<view class="p-xl">大内边距</view>
<view class="pt-md pb-lg px-sm">上中内边距，下大内边距，左右小内边距</view>
```

**间距尺寸对照表：**
- `xs` = 8rpx
- `sm` = 12rpx
- `base` = 16rpx
- `md` = 20rpx
- `lg` = 24rpx
- `xl` = 30rpx
- `2xl` = 40rpx
- `3xl` = 50rpx
- `4xl` = 60rpx
- `5xl` = 80rpx

### 尺寸工具类

```xml
<!-- 宽度 -->
<view class="w-full">全宽</view>
<view class="w-auto">自动宽度</view>

<!-- 高度 -->
<view class="h-base">标准高度 (80rpx)</view>
<view class="h-screen">全屏高度</view>
<view class="min-h-screen">最小全屏高度</view>
```

## 🎨 样式工具类

### 圆角

```xml
<view class="rounded">基础圆角</view>
<view class="rounded-xl">大圆角</view>
<view class="rounded-full">全圆角（胶囊形）</view>
<view class="rounded-circle">圆形</view>
```

### 阴影

```xml
<view class="shadow">基础阴影</view>
<view class="shadow-lg">大阴影</view>
<view class="shadow-primary">主题色阴影</view>
<view class="shadow-none">无阴影</view>
```

### 边框

```xml
<view class="border">基础边框</view>
<view class="border-2 border-primary">粗主题色边框</view>
<view class="border-t">仅上边框</view>
<view class="border-0">无边框</view>
```

## 🏷️ 标签组件

```xml
<text class="tag tag-primary">主要标签</text>
<text class="tag tag-success">成功标签</text>
<text class="tag tag-warning">警告标签</text>
<text class="tag tag-error">错误标签</text>
<text class="tag tag-outline">轮廓标签</text>
```

## 📱 响应式设计

### 断点说明

- **小屏幕**：`max-width: 375px`（iPhone SE等）
- **大屏幕**：`min-width: 750px`（iPad等）

### 响应式工具类

```xml
<!-- 在小屏幕隐藏，大屏幕显示 -->
<view class="d-none d-lg-block">大屏幕才显示</view>

<!-- 在小屏幕显示，大屏幕隐藏 -->
<view class="d-block d-lg-none">小屏幕才显示</view>

<!-- 响应式间距 -->
<view class="p-lg p-sm-md">大屏大内边距，小屏中内边距</view>

<!-- 响应式对齐 -->
<view class="text-left text-sm-center">大屏左对齐，小屏居中</view>
```

## 💡 实际使用示例

### 示例1：计算器页面

```xml
<view class="page-container">
  <view class="content-container">
    <!-- 页面标题 -->
    <text class="title-1 text-center mb-lg">加班费计算器</text>
    
    <!-- 表单区域 -->
    <view class="card mb-xl">
      <view class="card-header">
        <text class="card-title">基本信息</text>
      </view>
      <view class="card-body">
        <!-- 工资输入 -->
        <view class="form-group">
          <text class="form-label required">月基本工资</text>
          <input class="form-control" type="number" placeholder="请输入月基本工资" />
          <text class="form-hint">用于计算加班费基数</text>
        </view>
        
        <!-- 工作时间设置 -->
        <view class="form-group">
          <text class="form-label">标准工作时间</text>
          <view class="d-flex justify-between items-center p-md bg-secondary rounded">
            <text class="text-tertiary">09:00 - 18:00</text>
            <text class="text-primary">修改</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 计算结果 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">计算结果</text>
      </view>
      <view class="card-body">
        <view class="d-flex justify-between items-center mb-md">
          <text class="text-body">工作日加班费</text>
          <text class="text-primary font-bold">￥156.25</text>
        </view>
        <view class="d-flex justify-between items-center mb-md">
          <text class="text-body">周末加班费</text>
          <text class="text-primary font-bold">￥312.50</text>
        </view>
        <view class="border-t pt-md">
          <view class="d-flex justify-between items-center">
            <text class="text-lg font-bold">总计</text>
            <text class="text-2xl text-primary font-bold">￥468.75</text>
          </view>
        </view>
      </view>
      <view class="card-footer">
        <button class="btn btn-outline btn--sm">重新计算</button>
        <button class="btn btn-primary btn--sm">复制结果</button>
      </view>
    </view>
  </view>
</view>
```

### 示例2：功能列表页面

```xml
<view class="page-container">
  <view class="content-container">
    <text class="title-1 text-center mb-xl">工具列表</text>
    
    <!-- 功能列表 -->
    <view class="list-card clickable mb-md" bindtap="goToOvertime">
      <view class="list-card-content">
        <text class="list-card-icon">⏰</text>
        <view class="list-card-text">
          <text class="list-card-title">加班费计算器</text>
          <text class="list-card-desc">计算工作日、周末、节假日加班费</text>
        </view>
        <text class="list-card-arrow">></text>
      </view>
    </view>
    
    <view class="list-card clickable mb-md" bindtap="goToSeverance">
      <view class="list-card-content">
        <text class="list-card-icon">💰</text>
        <view class="list-card-text">
          <text class="list-card-title">补偿金计算器</text>
          <text class="list-card-desc">经济补偿金、赔偿金计算</text>
        </view>
        <text class="list-card-arrow">></text>
      </view>
    </view>
    
    <view class="list-card clickable" bindtap="goToTax">
      <view class="list-card-content">
        <text class="list-card-icon">🧾</text>
        <view class="list-card-text">
          <text class="list-card-title">个税计算器</text>
          <text class="list-card-desc">个人所得税计算与优化</text>
        </view>
        <text class="list-card-arrow">></text>
      </view>
    </view>
  </view>
</view>
```

## 🔧 高级使用技巧

### 1. 组合使用工具类

```xml
<!-- 创建一个卡片式按钮 -->
<view class="bg-secondary p-lg rounded-xl shadow d-flex items-center justify-between clickable">
  <view class="d-flex items-center">
    <text class="mr-md">📄</text>
    <view>
      <text class="text-body font-bold">劳动仲裁申请书</text>
      <text class="text-sm text-secondary">自动生成专业法律文档</text>
    </view>
  </view>
  <text class="text-tertiary">></text>
</view>
```

### 2. 自定义组件扩展

如果全局样式不能满足你的需求，可以基于现有样式进行扩展：

```css
/* 在你的页面样式文件中 */
.my-special-button {
  /* 继承按钮基础样式 */
  composes: btn btn-primary;
  
  /* 添加自定义样式 */
  font-size: var(--font-size-lg);
  padding: var(--spacing-xl) var(--spacing-2xl);
  
  /* 使用设计令牌 */
  background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
}
```

### 3. 主题定制

可以通过重新定义CSS变量来定制主题：

```css
/* 在你的页面样式文件中定制主题色 */
page {
  --color-bg-primary: #F0F8E8;        /* 改为淡绿色背景 */
  --color-text-primary: #2C3E2D;      /* 配套的深绿色标题 */
  /* 按钮颜色建议保持 #333333 统一性 */
}

/* 或者尝试其他暖色调背景 */
page {
  --color-bg-primary: #FFF5E6;        /* 淡橙色背景 */
  --color-text-primary: #3D2914;      /* 配套的深棕色标题 */
}
```

**注意**：建议保持按钮的 `#333333` 黑色，以维持设计一致性。

## ❌ 常见错误和注意事项

### 1. 引入路径错误

```css
/* ❌ 错误：路径不正确 */
@import "../styles/index.wxss";

/* ✅ 正确：确保路径正确 */
@import "../../styles/index.wxss";
```

### 2. 类名组合顺序

```xml
<!-- ❌ 错误：修饰符应该在基础类之后 -->
<button class="btn--lg btn btn-primary">按钮</button>

<!-- ✅ 正确：基础类、变体、修饰符的顺序 -->
<button class="btn btn-primary btn--lg">按钮</button>
```

### 3. 不要修改全局文件

```css
/* ❌ 错误：不要直接修改全局样式文件 */
/* 在 styles/components.wxss 中添加 */
.my-page-specific-style { ... }

/* ✅ 正确：在页面样式文件中添加 */
/* 在 pages/my-page/my-page.wxss 中添加 */
.my-page-specific-style { ... }
```

## 🆘 获取帮助

- 查看 `STYLE-ANALYSIS-REPORT.md` 了解样式分析详情
- 查看各个样式文件的注释了解详细用法
- 遇到问题时，优先查看是否有对应的工具类或组件

## 🎯 总结

使用这个**温暖黑白配色**全局样式系统，你可以：

1. **快速开发** - 用预定义的组件和工具类快速构建页面
2. **保持一致** - 所有页面使用统一的暖黄背景+黑色按钮设计语言
3. **易于维护** - 修改设计令牌即可全局更新样式  
4. **响应式** - 自动适配不同屏幕尺寸
5. **温暖专业** - 暖色背景营造舒适感，黑色按钮体现专业性

### 🎨 设计核心要点
- 🌞 **页面背景**: 统一使用暖黄色 `#FDF8E1` 
- ⚫ **按钮设计**: 统一使用黑底白字 `#333333` + `#FFFFFF`
- 📝 **文字层次**: 深炭灰标题 `#2C2C2C`，避免纯黑色
- 🎯 **大标题**: 必须配emoji图标增加识别度

记住核心原则：**先使用统一的黑白按钮风格和暖色背景，再考虑个性化定制**。这样可以最大程度保持视觉一致性和用户体验的统一性。