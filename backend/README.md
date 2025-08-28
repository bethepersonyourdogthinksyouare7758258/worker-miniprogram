# 法条数据 API 服务

基于 FastAPI + Pandas 的劳动法法条数据 RESTful API 服务。

## 功能特性

- 📊 基于 CSV 文件的法条数据管理
- 🔍 支持法条搜索、筛选和分页
- 📋 提供阶段、标签分类功能
- 🌐 RESTful API 设计
- 📚 自动生成 API 文档
- 🔄 支持 CORS 跨域访问

## 快速开始

### 1. 安装依赖

```bash
# 安装 Python 依赖
pip install -r requirements.txt
```

### 2. 启动服务

```bash
# 使用启动脚本（推荐）
./start.sh

# 或直接启动
python main.py
```

### 3. 访问服务

- API 服务地址: http://localhost:8000
- API 文档 (Swagger): http://localhost:8000/docs
- 替代文档 (ReDoc): http://localhost:8000/redoc

## API 接口

### 基础接口

- `GET /` - 根路径，返回服务状态
- `GET /health` - 健康检查

### 法条数据接口

- `GET /api/laws` - 获取所有法条（支持筛选和分页）
- `GET /api/laws/{law_id}` - 根据ID获取单个法条
- `GET /api/laws/search?q={keyword}` - 搜索法条

### 元数据接口

- `GET /api/stages` - 获取所有阶段列表
- `GET /api/tags` - 获取所有标签列表
- `GET /api/stats` - 获取统计信息

## 查询参数

### 获取法条列表 (/api/laws)

- `stage` - 按阶段筛选：入职阶段、在职阶段、离职阶段
- `tag` - 按标签筛选
- `limit` - 限制返回数量
- `offset` - 偏移量（分页）

### 搜索法条 (/api/laws/search)

- `q` - 搜索关键词（必填）
- `limit` - 限制返回数量（默认10）

## 数据格式

### 法条数据结构

```json
{
  "id": 1,
  "stage": "入职阶段",
  "tag": "试用期",
  "title": "试用期最长多久？",
  "summary": "合同3个月以上不满1年的，试用期≤1个月...",
  "legal_basis": "《劳动合同法》第十九条...",
  "tool_link": "无",
  "provider": "睡睡",
  "reviewer": "暂未审核"
}
```

## 使用示例

### 获取所有法条

```bash
curl http://localhost:8000/api/laws
```

### 按阶段筛选

```bash
curl "http://localhost:8000/api/laws?stage=入职阶段"
```

### 搜索法条

```bash
curl "http://localhost:8000/api/laws/search?q=试用期"
```

### 获取统计信息

```bash
curl http://localhost:8000/api/stats
```

## 前端集成

### JavaScript 示例

```javascript
// 获取所有法条
async function getLaws() {
  const response = await fetch('http://localhost:8000/api/laws');
  const laws = await response.json();
  return laws;
}

// 搜索法条
async function searchLaws(keyword) {
  const response = await fetch(`http://localhost:8000/api/laws/search?q=${encodeURIComponent(keyword)}`);
  const results = await response.json();
  return results;
}

// 按阶段获取法条
async function getLawsByStage(stage) {
  const response = await fetch(`http://localhost:8000/api/laws?stage=${encodeURIComponent(stage)}`);
  const laws = await response.json();
  return laws;
}
```

### 微信小程序示例

```javascript
// 在小程序中使用
wx.request({
  url: 'http://localhost:8000/api/laws',
  method: 'GET',
  success: function(res) {
    console.log('法条数据:', res.data);
  }
});
```

## 技术栈

- **FastAPI** - 现代化的 Python Web 框架
- **Pandas** - 数据处理和分析
- **Pydantic** - 数据验证和序列化
- **Uvicorn** - ASGI 服务器

## 项目结构

```
backend/
├── main.py              # 主应用文件
├── fatiao.csv          # 法条数据文件
├── requirements.txt    # Python 依赖
├── start.sh           # 启动脚本
└── README.md          # 文档
```

## 开发说明

### 添加新的 API 接口

在 `main.py` 中添加新的路由函数：

```python
@app.get("/api/new-endpoint")
async def new_endpoint():
    return {"message": "新接口"}
```

### 修改数据结构

如需修改返回的数据结构，请更新 `LawItemResponse` 模型：

```python
class LawItemResponse(BaseModel):
    # 添加新字段
    new_field: Optional[str] = None
```

## 部署建议

### 生产环境部署

1. 使用 Docker 容器化部署
2. 配置反向代理（Nginx）
3. 使用 Gunicorn 作为 WSGI 服务器
4. 设置环境变量和配置文件

### 安全考虑

1. 限制 CORS 允许的域名
2. 添加 API 限流
3. 实施身份验证和授权
4. 使用 HTTPS

## 故障排除

### 常见问题

1. **端口占用**: 修改 `main.py` 中的端口号
2. **CSV 编码问题**: 确保 CSV 文件使用 UTF-8 编码
3. **依赖安装失败**: 尝试使用虚拟环境

### 日志调试

启动时会显示数据加载状态，如有问题检查控制台输出。