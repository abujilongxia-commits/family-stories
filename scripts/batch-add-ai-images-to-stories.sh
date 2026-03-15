#!/bin/bash
# 批量為故事文件添加 AI 圖像（macOS 相容版本）

STORIES_DIR="/Users/mac/.openclaw/workspace/github-family-website/stories"
AI_IMAGES_DIR="/Users/mac/.openclaw/workspace/github-family-website/assets/ai-images"

# 獲取所有 AI 圖像列表
AI_IMAGES=($(ls "$AI_IMAGES_DIR"/*.jpg 2>/dev/null))
IMAGE_COUNT=${#AI_IMAGES[@]}

echo "🎨 開始為故事添加 AI 圖像..."
echo "======================================"
echo "找到 $IMAGE_COUNT 張 AI 圖像"

# 處理 photo4-53
for i in {4..53}; do
    STORY_FILE="$STORIES_DIR/photo${i}-story.md"
    
    if [ ! -f "$STORY_FILE" ]; then
        echo "⚠️  跳過 photo$i（文件不存在）"
        continue
    fi
    
    # 檢查是否已添加 AI 圖像
    if grep -q "AI 圖像" "$STORY_FILE"; then
        echo "⏭️  跳過 photo$i（已添加 AI 圖像）"
        continue
    fi
    
    # 循環使用 AI 圖像
    IMAGE_INDEX=$(( (i - 4) % IMAGE_COUNT ))
    AI_IMAGE="${AI_IMAGES[$IMAGE_INDEX]}"
    
    if [ -n "$AI_IMAGE" ] && [ -f "$AI_IMAGE" ]; then
        AI_IMAGE_BASENAME=$(basename "$AI_IMAGE")
        
        # 在照片行後添加 AI 圖像行
        sed -i.bak "s/\*\*照片：\*\* photo${i}\.jpg/\*\*照片：\*\* photo${i}.jpg\n**AI 圖像：**\n![照片${i} AI 版](..\/assets\/ai-images\/${AI_IMAGE_BASENAME})/" "$STORY_FILE"
        
        echo "✅ photo$i - 添加 AI 圖像：$AI_IMAGE_BASENAME"
    else
        echo "⚠️  photo$i - 未找到 AI 圖像"
    fi
done

# 清理備份文件
find "$STORIES_DIR" -name "*.bak" -delete 2>/dev/null

echo ""
echo "======================================"
echo "✅ 批量添加完成！"

# 統計
TOTAL=$(grep -l "AI 圖像" "$STORIES_DIR"/photo*-story.md 2>/dev/null | wc -l | tr -d ' ')
echo "📊 已添加 AI 圖像的故事數：$TOTAL / 53 篇"
