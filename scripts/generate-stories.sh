#!/bin/bash
# 故事生成腳本 - 蝦蝦助手專用
# 為每張照片生成 50-100 字溫暖故事

PHOTOS_DIR="/Users/mac/.openclaw/workspace/github-family-website/assets/photos"
STORIES_DIR="/Users/mac/.openclaw/workspace/github-family-website/stories"
OUTPUT_FILE="$STORIES_DIR/stories.json"

echo "📖 開始生成家庭故事..."
echo "======================================"

# 創建故事目錄
mkdir -p "$STORIES_DIR"

# 照片清單
photos=(
    "photo1.jpg:家庭冰淇淋聚會:客廳"
    "photo2.jpg:夫妻用餐時光:餐廳"
    "photo3.jpg:親子電影時光:電影院"
    "photo4.jpg:Moomin 主題公園:戶外"
    "photo5.jpg:鬱金香花園:花園"
    # ... 更多照片
)

# 故事模板（蝦蝦助手可以擴充）
generate_story() {
    local photo="$1"
    local theme="$2"
    local location="$3"
    
    cat << EOF
{
    "filename": "$photo",
    "theme": "$theme",
    "location": "$location",
    "story": "這是一個溫暖的家庭時刻。在$location，家人們一起分享$theme的美好時光。笑容、擁抱、和無盡的愛，構成了這個家最珍貴的回憶。",
    "tags": ["家庭", "$theme", "溫暖"],
    "date": "$(date +%Y-%m-%d)"
}
EOF
}

echo "✅ 故事模板已準備就緒"
echo "📝 蝦蝦助手請編輯此腳本，為每張照片填寫專屬故事"
echo ""
echo "使用方式："
echo "1. 編輯此腳本，填充 photos 陣列"
echo "2. 為每張照片編寫獨特的故事（50-100 字）"
echo "3. 運行腳本生成 stories.json"
echo ""
echo "✨ 故事風格建議："
echo "- 溫暖療癒系"
echo "- 真實情感流露"
echo "- 加入具體細節（時間、地點、人物）"
echo "- 引用家庭成員的對話或感言"
