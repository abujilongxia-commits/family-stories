#!/bin/bash
# 批量上傳照片腳本

SOURCE_DIR="/Users/mac/.openclaw/workspace/github-ai-story-content/reference-photos/2026-03-13"
TARGET_DIR="/Users/mac/.openclaw/workspace/github-family-website/assets/photos"
INDEX_FILE="$TARGET_DIR/photo-index.json"

echo "📸 開始上傳照片..."
echo "======================================"

# 創建目標目錄
mkdir -p "$TARGET_DIR"

# 初始化計數
count=0
photos=()

# 遍歷所有照片
find "$SOURCE_DIR" -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" \) | sort | while read photo; do
    filename=$(basename "$photo")
    
    # 複製照片（如果不存在）
    if [ ! -f "$TARGET_DIR/$filename" ]; then
        cp "$photo" "$TARGET_DIR/$filename"
        echo "✅ 上傳：$filename"
    else
        echo "⏭️  跳過：$filename (已存在)"
    fi
    
    ((count++))
done

# 統計總數
total=$(find "$TARGET_DIR" -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" \) | wc -l)

echo ""
echo "======================================"
echo "✅ 照片上傳完成！"
echo "📊 總計：$total 張"
echo "📁 位置：$TARGET_DIR"

# 生成索引文件
echo ""
echo "📝 生成照片索引..."

cat > "$INDEX_FILE" << 'JSONHEADER'
{
  "version": "1.0",
  "created": "TIMESTAMP",
  "total": TOTAL_COUNT,
  "photos": [
JSONHEADER

# 替換時間戳和總數
sed -i '' "s/TIMESTAMP/$(date -Iseconds)/" "$INDEX_FILE"
sed -i '' "s/TOTAL_COUNT/$total/" "$INDEX_FILE"

# 添加照片列表（簡化版）
first=true
find "$TARGET_DIR" -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" \) | sort | while read photo; do
    filename=$(basename "$photo")
    if [ "$first" = true ]; then
        echo "    {\"filename\": \"$filename\"}" >> "$INDEX_FILE"
        first=false
    else
        echo "    ,{\"filename\": \"$filename\"}" >> "$INDEX_FILE"
    fi
done

# 關閉 JSON
echo "  ]" >> "$INDEX_FILE"
echo "}" >> "$INDEX_FILE"

echo "✅ 索引文件已生成：$INDEX_FILE"
