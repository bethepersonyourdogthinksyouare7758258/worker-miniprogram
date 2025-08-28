#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FastAPI 法条数据服务
提供 RESTful API 接口来访问法条数据
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import pandas as pd
import os
from pydantic import BaseModel

app = FastAPI(
    title="法条数据 API",
    description="提供劳动法法条数据的 RESTful API 服务",
    version="1.0.0"
)

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据模型
class LawItem(BaseModel):
    序号: int
    阶段: str
    类型标签: str
    问题标题: str
    简明结论: str
    法条依据: str
    工具链接: str
    内容提供者: str
    审核者: str

class LawItemResponse(BaseModel):
    id: int
    stage: str
    tag: str
    title: str
    summary: str
    legal_basis: str
    legal_tag: str
    tool_link: str
    provider: str
    reviewer: str

# 全局变量存储数据
laws_data = None

def load_csv_data():
    """加载 CSV 数据"""
    global laws_data
    csv_path = os.path.join(os.path.dirname(__file__), "fatiao.csv")
    
    try:
        # 读取 CSV 文件，处理编码和分隔符
        laws_data = pd.read_csv(csv_path, encoding='utf-8-sig')
        
        # 清理数据：移除空行和无效数据
        laws_data = laws_data.dropna(subset=['序号', '问题标题'])
        
        # 确保序号是数字类型
        laws_data['序号'] = pd.to_numeric(laws_data['序号'], errors='coerce')
        laws_data = laws_data.dropna(subset=['序号'])
        
        print(f"成功加载 {len(laws_data)} 条法条数据")
        return True
    except Exception as e:
        print(f"加载 CSV 数据失败: {e}")
        return False

@app.on_event("startup")
async def startup_event():
    """应用启动时加载数据"""
    if not load_csv_data():
        print("警告：法条数据加载失败")

@app.get("/", summary="根路径", description="API 根路径，返回欢迎信息")
async def root():
    return {"message": "法条数据 API 服务", "status": "running"}

@app.get("/api/laws", response_model=List[LawItemResponse], summary="获取所有法条", description="获取所有法条数据")
async def get_all_laws(
    stage: Optional[str] = Query(None, description="按阶段筛选：入职阶段、在职阶段、离职阶段"),
    tag: Optional[str] = Query(None, description="按标签筛选"),
    limit: Optional[int] = Query(None, description="限制返回数量"),
    offset: Optional[int] = Query(0, description="偏移量")
):
    """获取所有法条数据，支持筛选和分页"""
    if laws_data is None:
        raise HTTPException(status_code=500, detail="法条数据未加载")
    
    # 筛选数据
    filtered_data = laws_data.copy()
    
    if stage:
        filtered_data = filtered_data[filtered_data['阶段'] == stage]
    
    if tag:
        filtered_data = filtered_data[filtered_data['类型标签'] == tag]
    
    # 分页
    if limit:
        filtered_data = filtered_data.iloc[offset:offset+limit]
    else:
        filtered_data = filtered_data.iloc[offset:]
    
    # 转换为响应格式
    result = []
    for _, row in filtered_data.iterrows():
        result.append(LawItemResponse(
            id=int(row['序号']),
            stage=row['阶段'],
            tag=row['类型标签'],
            title=row['问题标题'],
            summary=row['简明结论'],
            legal_basis=row['法条依据'],
            legal_tag=row['legalTag'] if pd.notna(row['legalTag']) else "",
            tool_link=row['工具链接'] if pd.notna(row['工具链接']) else "",
            provider=row['内容提供者'] if pd.notna(row['内容提供者']) else "",
            reviewer=row['审核者'] if pd.notna(row['审核者']) else ""
        ))
    
    return result

@app.get("/api/laws/search", response_model=List[LawItemResponse], summary="搜索法条", description="根据关键词搜索法条")
async def search_laws(
    q: str = Query(..., description="搜索关键词"),
    limit: Optional[int] = Query(10, description="限制返回数量")
):
    """搜索法条"""
    if laws_data is None:
        raise HTTPException(status_code=500, detail="法条数据未加载")
    
    if not q.strip():
        raise HTTPException(status_code=400, detail="搜索关键词不能为空")
    
    # 在多个字段中搜索
    search_fields = ['问题标题', '简明结论', '类型标签', '法条依据']
    mask = laws_data[search_fields].astype(str).apply(
        lambda x: x.str.contains(q, case=False, na=False)
    ).any(axis=1)
    
    filtered_data = laws_data[mask]
    
    if limit:
        filtered_data = filtered_data.head(limit)
    
    # 转换为响应格式
    result = []
    for _, row in filtered_data.iterrows():
        result.append(LawItemResponse(
            id=int(row['序号']),
            stage=row['阶段'],
            tag=row['类型标签'],
            title=row['问题标题'],
            summary=row['简明结论'],
            legal_basis=row['法条依据'],
            legal_tag=row['legalTag'] if pd.notna(row['legalTag']) else "",
            tool_link=row['工具链接'] if pd.notna(row['工具链接']) else "",
            provider=row['内容提供者'] if pd.notna(row['内容提供者']) else "",
            reviewer=row['审核者'] if pd.notna(row['审核者']) else ""
        ))
    
    return result

@app.get("/api/laws/{law_id}", response_model=LawItemResponse, summary="根据ID获取法条", description="根据法条ID获取单个法条详情")
async def get_law_by_id(law_id: int):
    """根据ID获取单个法条"""
    if laws_data is None:
        raise HTTPException(status_code=500, detail="法条数据未加载")
    
    law = laws_data[laws_data['序号'] == law_id]
    
    if law.empty:
        raise HTTPException(status_code=404, detail="法条不存在")
    
    row = law.iloc[0]
    return LawItemResponse(
        id=int(row['序号']),
        stage=row['阶段'],
        tag=row['类型标签'],
        title=row['问题标题'],
        summary=row['简明结论'],
        legal_basis=row['法条依据'],
        legal_tag=row['legalTag'] if pd.notna(row['legalTag']) else "",
        tool_link=row['工具链接'] if pd.notna(row['工具链接']) else "",
        provider=row['内容提供者'] if pd.notna(row['内容提供者']) else "",
        reviewer=row['审核者'] if pd.notna(row['审核者']) else ""
    )

@app.get("/api/stages", summary="获取所有阶段", description="获取所有法条阶段列表")
async def get_stages():
    """获取所有阶段"""
    if laws_data is None:
        raise HTTPException(status_code=500, detail="法条数据未加载")
    
    stages = laws_data['阶段'].unique().tolist()
    return {"stages": [stage for stage in stages if pd.notna(stage)]}

@app.get("/api/tags", summary="获取所有标签", description="获取所有法条标签列表")
async def get_tags():
    """获取所有标签"""
    if laws_data is None:
        raise HTTPException(status_code=500, detail="法条数据未加载")
    
    tags = laws_data['类型标签'].unique().tolist()
    return {"tags": [tag for tag in tags if pd.notna(tag)]}

@app.get("/api/stats", summary="获取统计信息", description="获取法条数据的统计信息")
async def get_stats():
    """获取统计信息"""
    if laws_data is None:
        raise HTTPException(status_code=500, detail="法条数据未加载")
    
    stage_counts = laws_data['阶段'].value_counts().to_dict()
    tag_counts = laws_data['类型标签'].value_counts().to_dict()
    
    return {
        "total": len(laws_data),
        "stages": stage_counts,
        "tags": tag_counts
    }

@app.get("/health", summary="健康检查", description="API 健康检查端点")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "data_loaded": laws_data is not None,
        "total_laws": len(laws_data) if laws_data is not None else 0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)