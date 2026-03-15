#!/bin/bash
# 使用 Nano Banana Pro 生成基於角色的家庭場景 AI 圖像
# 基於角色畫廊 v2 的 6 位家庭成員特徵

OUTPUT_DIR="/Users/mac/.openclaw/workspace/github-family-website/assets/ai-images/character-scenes"
mkdir -p "$OUTPUT_DIR"

echo "🎨 開始生成基於角色的家庭場景 AI 圖像..."
echo "======================================"

# 角色特徵摘要
# 爸爸：40-45 歲，金屬細框眼鏡，灰色上衣，燦爛笑容
# 媽媽：40-45 歲，棕色中長髮，紅色毛衣，溫柔笑容
# 哥哥：12-15 歲，細框圓眼鏡，灰色毛衣，比 YA 手勢
# 弟弟：6-9 歲，圓臉大眼睛，藍色連帽外套，可愛笑容
# 爺爺：70-75 歲，白髮，慈祥笑容，淺藍色襯衫
# 奶奶：65-70 歲，灰白短髮，溫柔表情，米色針織衫

# 場景 1：家庭冰淇淋聚會（對應 photo1）
echo "📸 生成場景 1：家庭冰淇淋聚會..."
uv run ~/.codex/skills/nano-banana-pro/scripts/generate_image.py \
  --prompt "Studio Ghibli style, Miyazaki animation, Taiwanese family gathering in living room, father (40s, metal glasses, gray sweater, warm smile), mother (40s, brown hair, red sweater, gentle), two sons (teenage with glasses, young boy cute), all holding ice cream cones, happy expressions, red wooden sofa, snacks on table, warm afternoon sunlight through window, soft watercolor texture, pastel colors, healing atmosphere, 2K quality" \
  --filename "scene1-family-ice-cream-final.png" \
  --resolution 2K

# 場景 2：夫妻用餐時光（對應 photo2）
echo "📸 生成場景 2：夫妻用餐時光..."
uv run ~/.codex/skills/nano-banana-pro/scripts/generate_image.py \
  --prompt "Studio Ghibli style, Miyazaki animation, Taiwanese couple dining at restaurant, father (40s, metal glasses, gray sweater) and mother (40s, brown hair, red sweater with flower brooch), two bowls of noodles on table, warm restaurant lighting, romantic atmosphere, both smiling with thumbs up, soft watercolor texture, pastel colors, healing and heartwarming, 2K quality" \
  --filename "scene2-couple-dining-final.png" \
  --resolution 2K

# 場景 3：親子電影時光（對應 photo3）
echo "📸 生成場景 3：親子電影時光..."
uv run ~/.codex/skills/nano-banana-pro/scripts/generate_image.py \
  --prompt "Studio Ghibli style, Miyazaki animation, Taiwanese family at movie theater, father (40s, metal glasses) with arm around older son (teenage, glasses), younger son (young boy) excited, movie screen in background, popcorn and drinks, warm cinema lighting, family bonding moment, soft watercolor texture, pastel colors, healing atmosphere, 2K quality" \
  --filename "scene3-family-cinema-final.png" \
  --resolution 2K

echo ""
echo "======================================"
echo "✅ 前三個場景生成完成！"
echo "📁 保存位置：$OUTPUT_DIR"
ls -la "$OUTPUT_DIR"
