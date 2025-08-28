# 法条数据 API 文档

## 📋 概述

基于 FastAPI + Pandas 的劳动法法条数据 RESTful API 服务，提供完整的法条数据访问接口。

**服务地址**: `http://localhost:8001`  
**API 文档**: `http://localhost:8001/docs`  
**数据源**: `assets/core-laws/fatiao.csv` (31条法条数据)

## 🚀 快速开始

### 安装依赖
```bash
cd backend
pip install -r requirements.txt
```

### 启动服务
```bash
# 开发模式（热重载）
uvicorn main:app --reload --host 0.0.0.0 --port 8001

# 生产模式
uvicorn main:app --host 0.0.0.0 --port 8001
```

### 健康检查
```bash
curl http://localhost:8001/health
```

## 📊 数据结构

### 法条数据模型 (LawItemResponse)
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

### 数据字段说明
| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 法条序号 |
| stage | string | 阶段：入职阶段/在职阶段/离职阶段 |
| tag | string | 类型标签 |
| title | string | 问题标题 |
| summary | string | 简明结论 |
| legal_basis | string | 法条依据 |
| tool_link | string | 工具链接 |
| provider | string | 内容提供者 |
| reviewer | string | 审核者 |

## 🔌 API 接口

### 1. 基础接口

#### GET / - 服务状态
```bash
curl http://localhost:8001/
```

**响应**:
```json
{
  "message": "法条数据 API 服务",
  "status": "running"
}
```

#### GET /health - 健康检查
```bash
curl http://localhost:8001/health
```

**响应**:
```json
{
  "status": "healthy",
  "data_loaded": true,
  "total_laws": 31
}
```

### 2. 法条数据接口

#### GET /api/laws - 获取所有法条
```bash
# 获取所有法条
curl "http://localhost:8001/api/laws"

# 按阶段筛选
curl "http://localhost:8001/api/laws?stage=入职阶段"

# 按标签筛选  
curl "http://localhost:8001/api/laws?tag=试用期"

# 分页查询
curl "http://localhost:8001/api/laws?limit=5&offset=10"
```

**查询参数**:
| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| stage | string | 按阶段筛选 | `入职阶段`、`在职阶段`、`离职阶段` |
| tag | string | 按标签筛选 | `试用期`、`劳动合同`、`加班` |
| limit | integer | 返回数量限制 | `10` |
| offset | integer | 偏移量（分页） | `0` |

**响应**: 法条对象数组

#### GET /api/laws/{law_id} - 根据ID获取法条
```bash
curl "http://localhost:8001/api/laws/1"
```

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| law_id | integer | 法条ID (1-31) |

**响应**: 单个法条对象

#### GET /api/laws/search - 搜索法条
```bash
# 搜索包含"试用期"的法条（需要URL编码）
curl "http://localhost:8001/api/laws/search?q=%E8%AF%95%E7%94%A8%E6%9C%9F"

# 限制返回数量
curl "http://localhost:8001/api/laws/search?q=%E5%B7%A5%E8%B5%84&limit=5"
```

**查询参数**:
| 参数 | 类型 | 说明 | 必填 |
|------|------|------|------|
| q | string | 搜索关键词 | 是 |
| limit | integer | 返回数量限制 | 否（默认10） |

**搜索范围**: 问题标题、简明结论、类型标签、法条依据

**响应**: 匹配的法条对象数组

### 3. 元数据接口

#### GET /api/stages - 获取所有阶段
```bash
curl http://localhost:8001/api/stages
```

**响应**:
```json
{
  "stages": ["入职阶段", "在职阶段", "离职阶段"]
}
```

#### GET /api/tags - 获取所有标签
```bash
curl http://localhost:8001/api/tags
```

**响应**:
```json
{
  "tags": ["试用期", "劳动合同", "社保缴纳", "加班", "工资", ...]
}
```

#### GET /api/stats - 获取统计信息
```bash
curl http://localhost:8001/api/stats
```

**响应**:
```json
{
  "total": 31,
  "stages": {
    "在职阶段": 13,
    "离职阶段": 10, 
    "入职阶段": 8
  },
  "tags": {
    "辞职": 3,
    "离职手续": 3,
    "补偿": 2,
    "竞业": 2,
    "休假": 2,
    "工伤": 2,
    "劳动合同": 2,
    "试用期": 1,
    "社保缴纳": 1,
    "加班": 1,
    "工资": 1,
    "调岗调薪": 1,
    "解除合同": 1,
    "竞业限制": 1,
    "仲裁": 1,
    "逆向派遣": 1,
    "管辖权问题": 1,
    "医疗期": 1,
    "孕产假": 1,
    "婚丧假": 1,
    "体检": 1
  }
}
```

## 🎯 使用示例

### JavaScript 前端集成

```javascript
// 获取所有法条
async function getAllLaws() {
  const response = await fetch('http://localhost:8001/api/laws');
  return await response.json();
}

// 按阶段获取法条
async function getLawsByStage(stage) {
  const response = await fetch(
    `http://localhost:8001/api/laws?stage=${encodeURIComponent(stage)}`
  );
  return await response.json();
}

// 搜索法条
async function searchLaws(keyword, limit = 10) {
  const response = await fetch(
    `http://localhost:8001/api/laws/search?q=${encodeURIComponent(keyword)}&limit=${limit}`
  );
  return await response.json();
}

// 获取单个法条
async function getLawById(id) {
  const response = await fetch(`http://localhost:8001/api/laws/${id}`);
  return await response.json();
}

// 获取统计信息
async function getStats() {
  const response = await fetch('http://localhost:8001/api/stats');
  return await response.json();
}
```

### 微信小程序集成

```javascript
// 在小程序中使用
Page({
  data: {
    laws: [],
    searchResults: []
  },
  
  onLoad() {
    this.loadLaws();
  },
  
  // 加载所有法条
  loadLaws() {
    wx.request({
      url: 'http://localhost:8001/api/laws',
      success: (res) => {
        this.setData({ laws: res.data });
      }
    });
  },
  
  // 搜索法条
  searchLaws(keyword) {
    wx.request({
      url: `http://localhost:8001/api/laws/search?q=${encodeURIComponent(keyword)}`,
      success: (res) => {
        this.setData({ searchResults: res.data });
      }
    });
  },
  
  // 按阶段筛选
  filterByStage(stage) {
    wx.request({
      url: `http://localhost:8001/api/laws?stage=${encodeURIComponent(stage)}`,
      success: (res) => {
        this.setData({ laws: res.data });
      }
    });
  }
});
```

### Python 客户端示例

```python
import requests

class LawAPIClient:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
    
    def get_all_laws(self, stage=None, tag=None, limit=None, offset=0):
        params = {}
        if stage: params['stage'] = stage
        if tag: params['tag'] = tag
        if limit: params['limit'] = limit
        if offset: params['offset'] = offset
        
        response = requests.get(f"{self.base_url}/api/laws", params=params)
        return response.json()
    
    def search_laws(self, query, limit=10):
        response = requests.get(
            f"{self.base_url}/api/laws/search", 
            params={"q": query, "limit": limit}
        )
        return response.json()
    
    def get_law_by_id(self, law_id):
        response = requests.get(f"{self.base_url}/api/laws/{law_id}")
        return response.json()
    
    def get_stats(self):
        response = requests.get(f"{self.base_url}/api/stats")
        return response.json()

# 使用示例
client = LawAPIClient()
laws = client.get_all_laws(stage="入职阶段")
search_results = client.search_laws("试用期")
stats = client.get_stats()
```

## 🔧 开发说明

### 项目结构
```
backend/
├── main.py              # FastAPI 主应用
├── fatiao.csv          # 法条数据文件 (UTF-8编码)
├── requirements.txt    # Python 依赖
├── start.sh           # 启动脚本
├── README.md          # 项目说明
└── API_DOCUMENTATION.md # API文档
```

### 数据加载流程
1. 应用启动时自动加载 `fatiao.csv` 文件
2. 使用 Pandas 进行数据清洗和处理
3. 数据存储在内存中，支持快速查询
4. 支持 UTF-8 编码，正确处理中文

### 错误处理
API 返回标准 HTTP 状态码：
- `200` - 成功
- `400` - 请求参数错误
- `404` - 资源不存在
- `422` - 数据验证错误
- `500` - 服务器内部错误

## 🚀 部署建议

### 生产环境配置
```bash
# 使用 Gunicorn + Uvicorn 部署
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app

# 使用 Docker 部署
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 环境变量配置
```bash
# 可选环境变量
export FASTAPI_ENV=production
export DATABASE_URL=postgresql://user:pass@localhost/dbname
export CORS_ORIGINS=https://yourdomain.com
```

## 📊 数据统计

当前法条数据统计：
- **总法条数**: 31 条
- **入职阶段**: 8 条
- **在职阶段**: 13 条  
- **离职阶段**: 10 条

主要标签分布：
- 辞职 (3)
- 离职手续 (3) 
- 补偿 (2)
- 竞业 (2)
- 休假 (2)
- 工伤 (2)
- 劳动合同 (2)

## 📝 更新日志

### v1.0.0 (2025-08-27)
- ✅ 初始版本发布
- ✅ 完整的 RESTful API 接口
- ✅ 支持法条搜索、筛选、分页
- ✅ 自动生成 API 文档
- ✅ CORS 跨域支持
- ✅ 健康检查端点

## 🆘 故障排除

### 常见问题

1. **端口占用**
   ```bash
   # 查找占用端口的进程
   lsof -i :8001
   # 杀死进程
   kill -9 <PID>
   ```

2. **数据加载失败**
   - 检查 CSV 文件路径
   - 确认文件编码为 UTF-8
   - 检查文件权限

3. **中文搜索问题**
   - 确保使用 URL 编码
   - 检查客户端编码设置

### 获取帮助

- 查看自动文档: http://localhost:8001/docs
- 检查服务日志: 控制台输出
- 健康检查: http://localhost:8001/health

---

**📞 技术支持**: 如有问题，请检查服务日志或查看自动生成的 API 文档。