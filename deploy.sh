#!/bin/bash
# 家庭小確幸網站 - 快速部署腳本

echo "🏠 開始部署家庭小確幸網站到 GitHub Pages..."
echo ""

# 檢查是否在正確的目錄
if [ ! -f "index.html" ]; then
    echo "❌ 錯誤：請在網站根目錄運行此腳本"
    exit 1
fi

# 檢查 Git 是否安裝
if ! command -v git &> /dev/null; then
    echo "❌ 錯誤：Git 未安裝，請先安裝 Git"
    exit 1
fi

# 初始化 Git 倉庫（如果還沒有）
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 倉庫..."
    git init
fi

# 添加所有文件
echo "📝 添加文件..."
git add .

# 提交
echo "💾 提交更改..."
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S') - 家庭小確幸網站更新"

# 檢查是否有遠程倉庫
if ! git remote | grep -q "origin"; then
    echo ""
    echo "⚠️  尚未配置遠程倉庫"
    echo ""
    echo "請執行以下命令創建 GitHub 倉庫並推送："
    echo ""
    echo "1. 前往 https://github.com/new 創建新倉庫"
    echo "   倉庫名稱建議：family-stories"
    echo "   設為 Public（公開）"
    echo ""
    echo "2. 然後執行："
    echo "   git remote add origin https://github.com/YOUR_USERNAME/family-stories.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "3. 啟用 GitHub Pages："
    echo "   Settings → Pages → Source → 選擇 'main' branch → Save"
    echo ""
    exit 0
fi

# 推送到 GitHub
echo "🚀 推送到 GitHub..."
git push origin main

echo ""
echo "✅ 部署完成！"
echo ""
echo "📍 下一步："
echo "1. 前往 GitHub 倉庫啟用 Pages"
echo "2. Settings → Pages → Source → 選擇 'main' branch"
echo "3. 等待幾分鐘，網站將在上線"
echo ""
echo "🌐 網站網址將是："
echo "https://YOUR_USERNAME.github.io/family-stories/"
echo ""
