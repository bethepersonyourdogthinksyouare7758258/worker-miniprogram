#!/bin/bash

# 法条数据 API 服务启动脚本

echo "正在启动法条数据 API 服务..."

# 检查 Python 环境
if ! command -v python3 &> /dev/null; then
    echo "错误: 未找到 Python3，请先安装 Python3"
    exit 1
fi

# 检查并安装依赖
if [ ! -d "venv" ]; then
    echo "创建虚拟环境..."
    python3 -m venv venv
fi

echo "激活虚拟环境..."
source venv/bin/activate

echo "安装依赖..."
pip install -r requirements.txt

echo "启动 FastAPI 服务..."
echo "API 文档地址: http://localhost:8000/docs"
echo "API 地址: http://localhost:8000/api"
echo "按 Ctrl+C 停止服务"

python main.py