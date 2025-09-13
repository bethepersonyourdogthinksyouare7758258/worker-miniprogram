# app.wxss 统一设计系统

基于淡黄色主题的纯色按钮设计，统一docgen等页面的基础组件。

## 🎨 CSS设计令牌系统

```css
/* === 全局页面样式 === */
page {
  background-color: #FDF8E1;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}

/* === CSS设计令牌变量 === */
:root {
  /* 颜色系统 */
  --color-bg-primary: #FDF8E1;      /* 主背景色 */
  --color-bg-secondary: #FFFFFF;     /* 卡片背景色 */
  --color-bg-tertiary: #F8F9FA;      /* 次级背景色 */

  --color-text-primary: #333333;     /* 主文字色 */
  --color-text-secondary: #666666;   /* 次级文字色 */
  --color-text-tertiary: #999999;    /* 三级文字色（提示） */
  --color-text-placeholder: #CCCCCC; /* 占位符文字色 */

  --color-border-primary: #E0E0E0;   /* 主边框色 */
  --color-border-secondary: #F0F0F0; /* 次级边框色 */

  /* 按钮颜色（纯色，无渐变） */
  --color-primary: #74b9ff;          /* 主要按钮色（蓝色） */
  --color-primary-hover: #0984e3;    /* 主要按钮悬停色 */
  --color-success: #00b894;          /* 成功按钮色（绿色） */
  --color-success-hover: #00a085;    /* 成功按钮悬停色 */
  --color-accent: #ff7675;           /* 强调按钮色（红色） */
  --color-accent-hover: #e17055;     /* 强调按钮悬停色 */
  --color-disabled: #E8E8E8;         /* 禁用按钮色 */

  /* 尺寸系统 */
  --input-height: 80rpx;             /* 统一输入框高度 */
  --textarea-min-height: 200rpx;     /* 统一文本域最小高度 */
  --button-height: 80rpx;            /* 统一按钮高度 */
  --card-radius: 20rpx;              /* 统一卡片圆角 */
  --input-radius: 12rpx;             /* 统一输入框圆角 */
  --button-radius: 40rpx;            /* 统一按钮圆角 */

  /* 间距系统 */
  --spacing-xs: 10rpx;               /* 超小间距 */
  --spacing-sm: 20rpx;               /* 小间距 */
  --spacing-md: 30rpx;               /* 中等间距 */
  --spacing-lg: 40rpx;               /* 大间距 */
  --spacing-xl: 60rpx;               /* 超大间距 */

  /* 字体系统 */
  --font-size-title: 48rpx;          /* 页面标题 */
  --font-size-subtitle: 32rpx;       /* 副标题 */
  --font-size-label: 28rpx;          /* 表单标签 */
  --font-size-input: 28rpx;          /* 输入框文字 */
  --font-size-button: 30rpx;         /* 按钮文字 */
  --font-size-hint: 24rpx;           /* 提示文字 */
  --font-size-small: 22rpx;          /* 小号文字 */

  --font-weight-normal: 400;         /* 正常字重 */
  --font-weight-medium: 500;         /* 中等字重 */
  --font-weight-bold: 600;           /* 粗体字重 */

  /* 阴影系统 */
  --shadow-card: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);      /* 卡片阴影 */
  --shadow-button: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);      /* 按钮阴影 */
  --shadow-input-focus: 0 0 10rpx rgba(116, 185, 255, 0.2);  /* 输入框聚焦阴影 */

  /* 动画时长 */
  --duration-fast: 0.2s;            /* 快速动画 */
  --duration-normal: 0.3s;          /* 正常动画 */
}

/* === 布局容器组件 === */
.container {
  padding: var(--spacing-md);
  background-color: var(--color-bg-primary);
  min-height: 100vh;
  box-sizing: border-box;
}

.page-container {
  padding: var(--spacing-sm);
  background-color: var(--color-bg-primary);
  min-height: 100vh;
}

.header-section {
  text-align: center;
  padding: var(--spacing-lg) var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.page-title {
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  display: block;
}

.page-subtitle {
  font-size: var(--font-size-label);
  color: var(--color-text-secondary);
  display: block;
  line-height: 1.5;
}

/* === 卡片组件 === */
.card {
  background: var(--color-bg-secondary);
  border-radius: var(--card-radius);
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.card-content {
  padding: var(--spacing-md);
}

.form-card {
  background: var(--color-bg-secondary);
  border-radius: var(--card-radius);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.form-card::before {
  content: '';
  display: block;
  height: 6rpx;
  background: var(--color-primary);
}

/* === 表单组件 === */
.form-container {
  padding: 0 var(--spacing-sm);
}

.input-group {
  margin-bottom: var(--spacing-md);
}

.input-label {
  display: block;
  font-size: var(--font-size-label);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
  font-weight: var(--font-weight-medium);
}

.required-mark {
  color: var(--color-accent);
  margin-left: 4rpx;
}

.form-input,
.form-textarea {
  width: 100%;
  height: var(--input-height);
  border: 2rpx solid var(--color-border-primary);
  border-radius: var(--input-radius);
  padding: 0 var(--spacing-sm);
  font-size: var(--font-size-input);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  box-sizing: border-box;
  transition: border-color var(--duration-normal), box-shadow var(--duration-normal);
}

.form-textarea {
  height: auto;
  min-height: var(--textarea-min-height);
  padding: var(--spacing-sm);
  resize: none;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-input-focus);
  outline: none;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--color-text-placeholder);
}

.form-picker {
  width: 100%;
  height: var(--input-height);
  border: 2rpx solid var(--color-border-primary);
  border-radius: var(--input-radius);
  padding: 0 var(--spacing-sm);
  font-size: var(--font-size-input);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  transition: border-color var(--duration-normal);
}

.form-picker:active {
  border-color: var(--color-primary);
}

.input-hint {
  font-size: var(--font-size-hint);
  color: var(--color-text-tertiary);
  margin-top: var(--spacing-xs);
  display: block;
}

/* === 复选框组件 === */
.selectable-options {
  margin-bottom: var(--spacing-lg);
}

.option-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
  background: var(--color-bg-secondary);
  border-radius: var(--input-radius);
  border: 2rpx solid var(--color-border-secondary);
  transition: all var(--duration-normal);
}

.option-item.selected {
  border-color: var(--color-primary);
  background: rgba(116, 185, 255, 0.05);
}

.option-item:active {
  transform: scale(0.98);
}

.custom-checkbox {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid var(--color-border-primary);
  border-radius: 8rpx;
  margin-right: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  transition: all var(--duration-normal);
}

.custom-checkbox.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.check-icon {
  color: white;
  font-size: 24rpx;
  font-weight: var(--font-weight-bold);
}

.option-label {
  flex: 1;
  font-size: var(--font-size-label);
  color: var(--color-text-primary);
  line-height: 1.4;
}

/* === 按钮组件（纯色设计） === */
.btn {
  height: var(--button-height);
  border-radius: var(--button-radius);
  font-size: var(--font-size-button);
  font-weight: var(--font-weight-medium);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-normal);
  cursor: pointer;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-success {
  background: var(--color-success);
  color: white;
}

.btn-success:hover {
  background: var(--color-success-hover);
}

.btn-success:active {
  transform: scale(0.98);
}

.btn-accent {
  background: var(--color-accent);
  color: white;
}

.btn-accent:hover {
  background: var(--color-accent-hover);
}

.btn-accent:active {
  transform: scale(0.98);
}

.btn-disabled {
  background: var(--color-disabled);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}

.btn-disabled:active {
  transform: none;
}

/* 具体按钮类型 */
.generate-button {
  width: 100%;
  margin: var(--spacing-lg) 0;
}

.copy-button,
.share-button {
  flex: 1;
  margin: 0 var(--spacing-xs);
}

/* === 动态表单区域 === */
.dynamic-form-section {
  margin-top: var(--spacing-md);
}

.field-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1rpx solid var(--color-border-secondary);
  margin-bottom: var(--spacing-sm);
}

.section-title {
  font-size: var(--font-size-subtitle);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.section-subtitle {
  font-size: var(--font-size-hint);
  color: var(--color-text-tertiary);
  margin-top: var(--spacing-xs);
}

/* === 预览区域 === */
.preview-container {
  margin-top: var(--spacing-lg);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-tertiary);
  border-radius: var(--card-radius) var(--card-radius) 0 0;
}

.preview-title {
  font-size: var(--font-size-subtitle);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.document-display {
  background: var(--color-bg-secondary);
  padding: var(--spacing-lg);
  border-radius: 0 0 var(--card-radius) var(--card-radius);
  border: 1rpx solid var(--color-border-secondary);
  border-top: none;
}

.document-text {
  font-size: var(--font-size-label);
  color: var(--color-text-primary);
  line-height: 1.8;
  white-space: pre-wrap;
}

/* === 提示信息组件 === */
.tips-section {
  background: rgba(116, 185, 255, 0.1);
  padding: var(--spacing-sm);
  border-radius: var(--input-radius);
  border-left: 6rpx solid var(--color-primary);
  margin: var(--spacing-md) 0;
}

.tips-label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
  display: block;
}

.tips-content {
  font-size: var(--font-size-hint);
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.help-hint {
  display: block;
  font-size: var(--font-size-hint);
  color: var(--color-text-tertiary);
  text-align: center;
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  background: rgba(153, 153, 153, 0.05);
  border-radius: var(--input-radius);
}

/* === 操作区域 === */
.action-section {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) 0;
}

.button-section {
  text-align: center;
  padding: var(--spacing-lg) var(--spacing-md);
}

/* === 响应式设计 === */
@media (max-width: 375px) {
  .page-title {
    font-size: 42rpx;
  }

  .container,
  .page-container {
    padding: var(--spacing-sm);
  }

  .form-card {
    margin-bottom: var(--spacing-sm);
  }

  .btn {
    height: 70rpx;
    font-size: 26rpx;
  }
}

/* === 通用交互效果 === */
.card:active,
.option-item:active {
  transform: scale(0.98);
  transition: transform var(--duration-fast);
}

/* === 加载和空状态 === */
.loading {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-label);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
}

.empty-text {
  font-size: var(--font-size-subtitle);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-sm);
}

.empty-hint {
  font-size: var(--font-size-hint);
  color: var(--color-text-placeholder);
  line-height: 1.4;
}
```

## 🎯 使用示例

### 基础按钮使用
```html
<!-- 主要按钮（蓝色） -->
<button class="btn btn-primary generate-button">生成文书</button>

<!-- 成功按钮（绿色） -->
<button class="btn btn-success copy-button">复制内容</button>

<!-- 强调按钮（红色） -->
<button class="btn btn-accent share-button">分享文档</button>

<!-- 禁用按钮 -->
<button class="btn btn-disabled" disabled>暂不可用</button>
```

### 表单组件使用
```html
<view class="input-group">
  <text class="input-label">投诉人姓名<text class="required-mark">*</text></text>
  <input class="form-input" placeholder="请输入您的真实姓名" />
  <text class="input-hint">请填写身份证上的真实姓名</text>
</view>
```

### 复选框使用
```html
<view class="option-item {{checked ? 'selected' : ''}}" bindtap="handleSelect">
  <view class="custom-checkbox {{checked ? 'checked' : ''}}">
    <text class="check-icon" wx:if="{{checked}}">✓</text>
  </view>
  <text class="option-label">制定的内部劳动保障规章违反劳动法律法规</text>
</view>
```

这套设计系统保持了你的淡黄色主题，使用纯色按钮，并且完全统一了所有基础组件的样式。你觉得这个方向对吗？