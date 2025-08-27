# UI 重构计划与信息整理

## 📋 项目概述
当前小程序包含多个功能模块，样式存在重复和不一致问题。本计划旨在建立统一的UI设计系统，提高代码复用性和维护性。

## 🎨 现有样式分析

### 当前颜色系统
- **背景色**: `#FDF8E1` (米黄色)
- **主色调**: `#FFCC66` (橙色)
- **文字色**: `#333` (主要文字), `#888` (次要文字)
- **边框色**: `#F0E6CC`, `#FFF1C1`
- **强调色**: `#FF6B6B` (红色按钮)

### 现有组件模式
1. **卡片式布局**: 圆角12px，阴影效果，渐变背景
2. **网格菜单**: 主页的8宫格布局
3. **列表项**: 可展开的详情卡片
4. **表单元素**: 输入框、选择器等

## 🏗️ 组件分类策略

### 通用组件 (提取到 `components/common/`)
```
common/
├── layout/
│   ├── Container.wxml    # 页面容器
│   ├── Header.wxml       # 页面标题
│   └── Card.wxml         # 通用卡片
├── navigation/
│   ├── GridMenu.wxml     # 网格菜单
│   └── CategoryCard.wxml # 分类卡片
├── form/
│   ├── Input.wxml        # 输入框
│   ├── Select.wxml       # 选择器
│   └── Button.wxml       # 按钮
└── feedback/
    ├── Loading.wxml      # 加载状态
    └── Error.wxml        # 错误提示
```

### 业务组件 (保留在各自页面目录)
- 城市对比相关组件
- 计算器特定表单
- 文书生成器组件
- 法条展示组件

## 🎯 样式规范制定

### 创建全局样式变量文件 `styles/variables.wxss`
```css
/* 颜色变量 */
:root {
  --color-background: #FDF8E1;
  --color-primary: #FFCC66;
  --color-secondary: #FF6B6B;
  --color-text-primary: #333333;
  --color-text-secondary: #888888;
  --color-border: #F0E6CC;
  --color-card-bg: linear-gradient(to right, #FFFFFF, #FFF9E6);
}

/* 间距变量 */
:root {
  --spacing-xs: 8rpx;
  --spacing-sm: 16rpx;
  --spacing-md: 24rpx;
  --spacing-lg: 32rpx;
  --spacing-xl: 48rpx;
}

/* 圆角变量 */
:root {
  --border-radius-sm: 8rpx;
  --border-radius-md: 12rpx;
  --border-radius-lg: 16rpx;
}

/* 阴影变量 */
:root {
  --shadow-sm: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
}
```

### 通用样式类 `styles/utilities.wxss`
```css
/* 文本工具类 */
.text-primary { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
.text-center { text-align: center; }

/* 间距工具类 */
.mt-sm { margin-top: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.p-md { padding: var(--spacing-md); }

/* 布局工具类 */
.flex { display: flex; }
.flex-column { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
```

## 🔄 重构实施步骤

### 第一阶段：基础架构搭建
1. [ ] 创建 `styles/` 目录和变量文件
2. [ ] 建立 `components/common/` 通用组件目录
3. [ ] 统一导入全局样式到 `app.wxss`

### 第二阶段：通用组件提取
1. [ ] 提取基础布局组件 (Container, Header, Card)
2. [ ] 提取导航组件 (GridMenu, CategoryCard)
3. [ ] 提取表单基础组件
4. [ ] 提取反馈组件

### 第三阶段：页面样式重构
1. [ ] 重构主页 (home) 样式
2. [ ] 重构计算器页面样式
3. [ ] 重构城市对比页面样式
4. [ ] 重构文本库页面样式

### 第四阶段：测试与优化
1. [ ] 全面测试各页面显示效果
2. [ ] 优化组件性能
3. [ ] 编写组件使用文档

## 📊 页面组件映射表

| 页面 | 通用组件 | 业务组件 | 状态 |
|------|----------|----------|------|
| 主页 | GridMenu, Card | - | ✅ |
| 计算器 | CategoryCard, Card | 计算表单 | ⏳ |
| 城市对比 | Input, Select | 城市组件 | ⏳ |
| 文本库 | Card, Button | 文本项 | ⏳ |
| 法条 | Card | 法条详情 | ⏳ |

## 🎨 设计原则

1. **一致性**: 所有页面遵循相同的设计语言
2. **复用性**: 最大程度复用现有组件
3. **可维护性**: 清晰的组件结构和文档
4. **扩展性**: 易于添加新功能和页面

## 📝 后续优化方向

1. 暗色主题支持
2. 国际化样式适配
3. 响应式布局优化
4. 动画效果统一

---

**最后更新**: 2025-08-25
**负责人**: UI重构小组