### AI 生成微信小程序代码的工作法则

以下是为 AI 设计的一套“小程序工作法则”，旨在指导 AI 在生成微信小程序代码时，确保代码结构清晰、可维护、高效，并符合微信小程序的官方规范和最佳实践。这些法则基于软件工程原则（如模块化、组件化）和小程序的特性（如分包、性能优化）。AI 在编写代码时，必须严格遵守这些法则，以避免常见问题（如包体积过大、代码冗余、加载慢）。

#### 法则概述
- **目的**：这些法则帮助 AI 生成高质量代码，确保小程序易扩展、易调试，并优化用户体验。
- **适用范围**：适用于微信小程序开发，包括页面、组件、API 等。
- **核心原则**：模块化、复用性、性能优先、规范一致。

#### 详细法则（AI 必须逐条遵守）
1. **结构清晰原则**：
   - 始终使用嵌套文件夹表示逻辑层级。例如，相关页面放入同一模块文件夹（如 `pages/home/index` 和 `pages/home/detail`），避免所有文件平铺。
   - 静态资源（如图片）统一放到 `assets` 或 `static` 目录下，不混入页面文件夹。
   - 添加独立目录：`utils`（工具函数）、`services`（API 服务）、`components`（自定义组件）、`stores`（状态管理，如果需要）。

2. **模块化和组件化原则**：
   - 将代码拆分成小模块，每个文件单一职责（SRP）。例如，API 请求封装在 `services/api.js` 中，使用 Promise 或 async/await 处理。
   - 优先使用自定义组件封装 UI 和逻辑，支持复用（如按钮组件在 `components/button/index`）。
   - 如果项目复杂，引入 Behavior 或外部库（如 MobX）共享状态，避免全局变量滥用。

3. **性能优化原则**：
   - 使用分包（subpackages）拆分非核心模块，按需加载。主包体积控制在 2MB 内，总包不超过 16MB。
   - 合并 `setData` 调用，使用节流/防抖优化事件。图片使用懒加载（`lazy-load`）。
   - 启用代码压缩和懒加载组件（`"lazyCodeLoading": "requiredComponents"`）。

4. **代码规范原则**：
   - 遵循 ES6+ 语法，使用 let/const，避免 var。函数命名使用 camelCase，文件名为小写。
   - 每个页面/组件必须有 `.js`、`.wxml`（必需），`.json` 和 `.wxss`（可选）。在 `.json` 中配置导航栏、背景等。
   - 添加注释：每个文件开头说明功能，关键函数添加 JSDoc 风格注释。
   - 处理错误：使用 try-catch 包裹异步操作，显示友好提示。

5. **路由和交互原则**：
   - 使用 `wx.navigateTo`、`wx.redirectTo` 等 API 管理跳转。子页面从父页面传递参数（如 `url: '../detail/detail?id=1'`）。
   - 事件处理使用 bindtap/bindinput，支持自定义数据（如 `data-id="{{item.id}}"`）。
   - 支持生命周期钩子：优先用 `onLoad` 初始化数据，`onShow` 刷新状态。

6. **测试和调试原则**：
   - 生成代码时，包含 console.log 或 wx.showToast 用于调试。
   - 确保兼容性：测试 iOS/Android 差异，使用条件编译（//#ifdef）。
   - 集成云开发或 mock 数据，避免真实 API 依赖。

7. **扩展性原则**：
   - 如果用户指定框架（如 Taro），适配 React/Vue 风格代码。
   - 保持代码开源友好：避免硬编码敏感信息，使用 config.js 配置。

AI 在生成代码时，应先规划结构（输出目录树），然后逐文件编写，最后验证执行方式。违反法则时，必须自检并修正。

#### 代码文件执行方式汇总
微信小程序的执行是事件驱动的，基于 JavaScript 单线程模型。以下是文件类型及其执行方式的总结，使用表格便于参考。执行顺序：全局 > 页面/组件 > 事件。

| 文件类型 | 描述 | 执行时机与方式 | 示例与注意 |
|----------|------|----------------|------------|
| **app.js** | 全局脚本，定义 App() 实例。 | 小程序启动时执行一次。初始化 globalData、onLaunch 钩子（如登录）。 | `App({ onLaunch() { wx.login() } })`。所有页面共享其数据。 |
| **app.json** | 全局配置（如页面路径、分包）。 | 编译时解析，非运行时执行。影响路由和 UI（如 tabBar）。 | 配置 `"pages": ["pages/index/index"]`。修改需重启开发者工具。 |
| **app.wxss** | 全局样式。 | 启动时加载，应用于所有页面。 | 定义 body 样式。优先级低于页面 wxss。 |
| **page.js** | 页面脚本，定义 Page() 实例。 | 页面加载时执行 onLoad/onReady。卸载时 onUnload。 | `Page({ data: {}, onLoad(options) { this.setData({ id: options.id }) } })`。支持生命周期钩子（如 onPullDownRefresh）。 |
| **page.wxml** | 页面模板。 | 渲染时解析，与 page.js data 绑定。动态渲染列表用 wx:for。 | `<view>{{title}}</view>`。执行依赖 setData 更新。 |
| **page.json** | 页面配置（如标题）。 | 加载时应用，覆盖 app.json。 | `"navigationBarTitleText": "首页"`。 |
| **page.wxss** | 页面样式。 | 加载时应用，作用域限于本页。 | `.container { color: red; }`。 |
| **component.js** | 组件脚本，定义 Component()。 | 组件使用时执行 attached/ready。 | `Component({ properties: {}, methods: {} })`。支持 observers 观察属性变化。 |
| **utils/*.js** | 工具函数。 | 按需 import 执行（如 `const util = require('../../utils/util.js')`）。 | 导出函数，如日期格式化。无自动执行。 |
| **services/*.js** | 服务模块（如 API）。 | import 后调用执行。 | 使用 wx.request 发送请求，返回 Promise。 |

**总体执行流程**：
1. 小程序启动：执行 app.js 的 onLaunch。
2. 进入页面：解析 app.json 路由 → 执行 page.js onLoad → 渲染 wxml/wxss。
3. 交互：事件触发 page.js 方法 → setData 更新视图。
4. 退出：onUnload 清理。

这些汇总基于微信官方文档，确保 AI 生成代码时考虑执行顺序（如数据初始化在 onLoad）。如果需要示例代码或进一步调整法则，请提供更多细节！