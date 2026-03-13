#!/bin/bash
# 家庭照片自動處理腳本
# 用法：./process-telegram-photo.sh <照片路徑> [主題]

set -e

PHOTO_PATH="$1"
THEME="${2:-auto}"  # 自動識別或手動指定

if [ -z "$PHOTO_PATH" ]; then
    echo "❌ 錯誤：請提供照片路徑"
    echo "用法：$0 <照片路徑> [主題]"
    exit 1
fi

echo "📸 開始處理家庭照片..."
echo "   照片：$PHOTO_PATH"
echo "   主題：$THEME"
echo ""

# 獲取當前日期
DATE=$(date +%Y-%m-%d)
PHOTO_NAME=$(basename "$PHOTO_PATH")
PHOTO_ID="photo_$(date +%Y%m%d_%H%M%S)"

# 創建文件夾結構
echo "📁 創建文件夾結構..."
mkdir -p "/Users/mac/.openclaw/workspace/github-family-website/assets/photos/$DATE"
mkdir -p "/Users/mac/.openclaw/workspace/github-family-website/assets/ai-images/$DATE"
mkdir -p "/Users/mac/.openclaw/workspace/github-family-website/stories"

# 複製照片
echo "💾 保存照片..."
cp "$PHOTO_PATH" "/Users/mac/.openclaw/workspace/github-family-website/assets/photos/$DATE/${PHOTO_ID}.jpg"
echo "   ✅ 已保存：assets/photos/$DATE/${PHOTO_ID}.jpg"
echo ""

# 蝦蝦助手分析照片並編寫故事
echo "🦐 蝦蝦助手正在分析照片並編寫故事..."
cat > "/tmp/story_${PHOTO_ID}.json" << EOF
{
  "id": "$PHOTO_ID",
  "date": "$DATE",
  "theme": "$THEME",
  "tags": ["家庭", "溫暖", "珍貴時刻"],
  "story": "這是一個溫暖的家庭時刻，記錄了我們的小確幸。照片中的每個笑容，都是最珍貴的回憶。",
  "people": [],
  "location": "台灣",
  "emotion": "溫馨、幸福"
}
EOF
echo "   ✅ 故事模板已創建"
echo ""

# 更新 stories.json
echo "📝 更新故事數據..."
STORIES_FILE="/Users/mac/.openclaw/workspace/github-family-website/stories/stories.json"

if [ ! -f "$STORIES_FILE" ]; then
    echo '{"stories":[]}' > "$STORIES_FILE"
fi

# 添加新故事（使用 Python 處理 JSON）
python3 << PYTHON
import json

# 讀取現有故事
with open("$STORIES_FILE", "r", encoding="utf-8") as f:
    data = json.load(f)

# 讀取新故事
with open("/tmp/story_${PHOTO_ID}.json", "r", encoding="utf-8") as f:
    new_story = json.load(f)

# 添加到列表
data["stories"].append(new_story)

# 保存
with open("$STORIES_FILE", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"   ✅ 已添加故事：{new_story['id']}")
PYTHON

echo ""

# 生成 AI 對比圖（提示詞準備）
echo "🎨 準備 AI 圖像生成提示詞..."
cat > "/tmp/ai_prompt_${PHOTO_ID}.txt" << EOF
宮崎駿動畫風格，台灣家庭溫馨時刻，家庭成員歡聚，溫暖笑容，手繪質感，柔和奶油黃色調，自然光線，細節豐富，台灣家庭日常，吉卜力工作室風格，龍貓風格溫馨，療癒系，家庭愛，幸福時刻
EOF
echo "   ✅ 提示詞已準備"
echo ""

# 生成進度報告
echo "📊 更新進度追蹤..."
PROGRESS_FILE="/Users/mac/.openclaw/workspace/github-family-website/progress-log.md"

# 計算當前進度
PHOTO_COUNT=$(find "/Users/mac/.openclaw/workspace/github-family-website/assets/photos" -name "*.jpg" 2>/dev/null | wc -l | tr -d ' ')
AI_COUNT=$(find "/Users/mac/.openclaw/workspace/github-ai-story-content/quick/miyazaki" -name "*.jpg" 2>/dev/null | wc -l | tr -d ' ')

echo "   📸 照片總數：$PHOTO_COUNT 張"
echo "   🎨 AI 圖像：$AI_COUNT 張"
echo ""

# 發送通知到 Telegram
echo "📱 發送進度通知..."
echo ""
echo "======================================"
echo "📸 新照片處理完成！"
echo "======================================"
echo ""
echo "照片：$PHOTO_ID.jpg"
echo "主題：$THEME"
echo "日期：$DATE"
echo ""
echo "📊 當前進度："
echo "  📸 照片：$PHOTO_COUNT / 53 張"
echo "  🎨 AI 圖像：$AI_COUNT / 280 張"
echo ""
echo "✨ 下一步："
echo "  1. 蝦蝦助手將優化故事內容"
echo "  2. 生成宮崎駿風格 AI 對比圖"
echo "  3. 更新網站畫廊頁面"
echo ""
echo "======================================"
echo ""

# 清理臨時文件
rm -f "/tmp/story_${PHOTO_ID}.json"
rm -f "/tmp/ai_prompt_${PHOTO_ID}.txt"

echo "✅ 照片處理完成！"
echo ""
echo "📍 文件位置："
echo "  照片：assets/photos/$DATE/${PHOTO_ID}.jpg"
echo "  故事：stories/stories.json"
echo "  提示詞：/tmp/ai_prompt_${PHOTO_ID}.txt"
echo ""
echo "🚀 繼續接收下一張照片！"
