# 沟通文本库 (Text Library)

本功能模块为用户提供在不同职场阶段（求职、在职、离职）可能会用到的沟通话术和文本模板。

## 代码结构

本模块的所有页面和逻辑都包含在 `pages/text-library/textpack/` 文件夹内。

```
textpack/
├── list/                   # 话术列表与详情页面
│   ├── list.js
│   ├── list.json
│   ├── list.wxml
│   └── list.wxss
│
├── textpack.js             # 场景选择页 - 逻辑
├── textpack.json           # 场景选择页 - 配置
├── textpack.wxml           # 场景选择页 - 结构
└── textpack.wxss           # 场景选择页 - 样式
```

## 逻辑流程 (组件结构)

功能的整体流程被拆分为两个页面，实现了从大类到具体内容的选择和交互。

1.  **场景选择页 (`textpack.js/.wxml`)**
    *   **功能**: 作为模块的入口页面，展示“求职阶段”、“在职阶段”、“离职阶段”三个大的分类供用户选择。
    *   **交互**: 用户点击任意一个分类卡片，会触发 `navigateToList` 事件。
    *   **跳转**: `navigateToList` 函数通过 `wx.navigateTo` 跳转到 `list` 页面，并通过 URL 参数 `category` 将用户选择的场景（如 `jobSeeking`）传递过去。

2.  **话术列表页 (`list.js/.wxml`)**
    *   **功能**:
        *   接收 `category` 参数，并从 `data/text-pack/phrases.js` 中加载对应分类的话术数据。
        *   以列表形式展示所有话术的标题。
        *   实现点击标题展开/折叠，显示详细的话术模板和使用提示。
        *   提供“复制”按钮，方便用户一键复制话术内容。
    *   **交互**:
        *   `toggleExpand`: 控制话术详情的展开与折叠。
        *   `copyText`: 将指定话术内容通过 `wx.setClipboardData` 复制到用户剪贴板。

## 样式说明 (WXSS)

模块的样式被拆分在两个文件中，分别对应两个页面。

1.  **场景选择页 (`textpack.wxss`)**
    *   `.container`: 页面主容器，设置了整体的背景色和边距。
    *   `.header`: 顶部的标题和副标题区域。
    *   `.category-list`: 卡片列表的 flex 容器。
    *   `.category-card`: 每个场景选择卡片的样式，包括背景、圆角、阴影等。
    *   `.card-icon`, `.card-content`, `.card-title`, `.card-desc`: 卡片内部元素的样式。

2.  **话术列表页 (`list.wxss`)**
    *   `.phrase-item`: 每个话术列表项的容器。
    *   `.phrase-header`: 话术的标题栏，包含标题和可点击的箭头。
    *   `.phrase-content`: 展开后显示详细内容的区域，默认隐藏。
    *   `.template`: 每个话术模板（如“礼貌版”）的样式。
    *   `.copy-btn`: “复制”按钮的样式。
    *   `.tips`: “使用提示”区域的样式。