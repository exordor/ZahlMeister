#!/bin/bash

# 德语数字练习网站开发环境设置脚本

echo "🚀 设置德语数字练习网站开发环境..."

# 检查Node.js版本
echo "📦 检查Node.js版本..."
node_version=$(node --version)
echo "当前Node.js版本: $node_version"

# 安装依赖
echo "📥 安装项目依赖..."
npm run install:all

# 检查依赖安装
if [ $? -eq 0 ]; then
    echo "✅ 依赖安装成功！"
else
    echo "❌ 依赖安装失败！"
    exit 1
fi

# 启动开发服务器
echo "🎯 启动开发服务器..."
echo "后端服务器将在 http://localhost:3001 启动"
echo "前端应用将在 http://localhost:3000 启动"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev
