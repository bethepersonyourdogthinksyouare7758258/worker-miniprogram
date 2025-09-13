# text-library-textpack.wxss 现有组件统计

## 布局组件

### 容器组件
- `.scrollarea` - 滚动区域容器
- `.container` - 主容器
- `.header` - 头部区域
- `.footer` - 页脚区域

### 文本组件
- `.title` - 主标题
- `.subtitle` - 副标题
- `.footer-text` - 页脚文本

## 列表组件

### 分类列表
- `.category-list` - 分类列表容器
- `.category-card` - 分类卡片基础样式

### 卡片交互效果
- `.category-card::before` - 卡片伪元素（可能用于背景或装饰）
- `.category-card:active` - 卡片激活状态
- `.category-card:active::before` - 激活时伪元素状态

## 卡片内容组件

### 卡片结构
- `.card-icon` - 卡片图标
- `.card-content` - 卡片内容区域
- `.card-title` - 卡片标题
- `.card-desc` - 卡片描述
- `.card-arrow` - 卡片箭头

### 卡片交互
- `.category-card:active .card-arrow` - 激活时箭头状态

## 组件架构分析

### 布局层次
```
.scrollarea
  └── .container
      ├── .header
      │   ├── .title
      │   └── .subtitle
      ├── .category-list
      │   └── .category-card (多个)
      │       ├── .card-icon
      │       ├── .card-content
      │       │   ├── .card-title
      │       │   └── .card-desc
      │       └── .card-arrow
      └── .footer
          └── .footer-text
```

### 交互设计特点
- **伪元素设计**: 使用 `::before` 实现复杂视觉效果
- **状态管理**: `:active` 状态的多层级响应
- **嵌套交互**: 激活时影响子元素（箭头）的样式

### 设计模式
- **卡片式布局**: 标准的卡片列表模式
- **内容分层**: 图标-内容-操作的三段式结构
- **视觉反馈**: 完整的交互状态设计

## 组件总数统计
- **布局组件**: 4个（滚动区域、容器、头部、页脚）
- **文本组件**: 3个（主标题、副标题、页脚文本）
- **列表组件**: 2个（列表容器、卡片基础）
- **卡片组件**: 5个（图标、内容、标题、描述、箭头）
- **交互状态**: 3个（伪元素、激活态、箭头激活态）
- **总计**: 17个样式组件

## 设计特色
- **完整的交互反馈系统**
- **伪元素装饰效果**
- **多层级状态管理**
- **清晰的信息层次结构**