#!/bin/bash
# 統一圖片解析度為 16:9 橫向 (1920x1080)

EPISODE_DIR="/Users/mac/.openclaw/workspace/github-family-website/episode1"
BACKUP_DIR="$EPISODE_DIR/original-backup"

# 創建備份目錄
mkdir -p "$BACKUP_DIR"

echo "🖼️ 開始統一圖片解析度..."
echo "======================================"

# 處理所有 jpg 文件
for img in "$EPISODE_DIR"/*.jpg; do
    filename=$(basename "$img")
    
    # 跳過已經是 16:9 比例的圖片（大約 1.77 比例）
    width=$(sips -g pixelWidth "$img" | grep pixelWidth | awk '{print $2}')
    height=$(sips -g pixelHeight "$img" | grep pixelHeight | awk '{print $2}')
    
    if [ -n "$width" ] && [ -n "$height" ]; then
        ratio=$(echo "scale=2; $width / $height" | bc)
        
        # 如果比例接近 1.77 (16:9)，跳過
        if (( $(echo "$ratio > 1.7 && $ratio < 1.8" | bc -l) )); then
            echo "⏭️  跳過 $filename (已是 16:9 比例: ${width}x${height})"
            continue
        fi
        
        echo "🔄 處理 $filename (${width}x${height}, 比例: $ratio)"
        
        # 備份原圖
        cp "$img" "$BACKUP_DIR/$filename"
        
        # 使用 sips 調整為 1920x1080 (16:9)，保持比例並裁剪
        sips -z 1080 1920 "$img" --out "$img" 2>/dev/null || echo "⚠️  sips 失敗: $filename"
    fi
done

echo ""
echo "======================================"
echo "✅ 處理完成！"
echo "📁 原圖備份在: $BACKUP_DIR"
