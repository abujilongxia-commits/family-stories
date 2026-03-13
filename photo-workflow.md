# 📸 家庭照片自動處理流程

## 🎯 目標

自動接收 Telegram 傳送的家庭照片，並：
1. 📸 保存照片到指定文件夾
2. 📝 自動編寫溫暖故事（50-100 字）
3. 🏷️ 自動分類標籤（15 大主題）
4. 🎨 生成宮崎駿風格 AI 對比圖
5. 🌐 自動更新網站內容

---

## 🔄 自動化流程

### 流程圖
```
用戶傳送照片到 Telegram
        ↓
蝦蝦助手接收照片
        ↓
分析照片內容（人物、場景、情感）
        ↓
編寫溫暖故事（50-100 字）
        ↓
分類到 15 大主題
        ↓
保存到 assets/photos/
        ↓
生成 AI 對比圖
        ↓
更新網站內容
        ↓
回報進度給恩齊
```

---

## 📁 照片保存結構

```
assets/photos/
├── 2026-03-13/
│   ├── photo001.jpg
│   ├── photo002.jpg
│   └── stories.json
├── 2026-03-14/
└── ...
```

---

## 📝 故事模板

### 故事結構
```json
{
  "id": "photo001",
  "date": "2026-03-13",
  "theme": "家庭聚會",
  "tags": ["冰淇淋", "客廳", "歡笑"],
  "story": "紅色木沙發上，全家圍坐一起享用杜老爺冰淇淋，孩子們比著 YA 手勢，茶幾上滿滿零食，溫暖的歡笑聲充滿客廳。",
  "people": ["爸爸", "媽媽", "哥哥 1", "哥哥 2"],
  "location": "家中客廳",
  "emotion": "歡樂、溫馨"
}
```

---

## 🏷️ 15 大主題分類

| 主題 | 關鍵詞 | 場景 |
|------|--------|------|
| **家庭聚會** | 客廳、沙發、聚餐 | 室內 |
| **夫妻情誼** | 夫妻、用餐、恩愛 | 餐廳 |
| **親子出遊** | 電影、景點、親子 | 室外 |
| **春節傳統** | 紅包、春聯、團聚 | 室內/室外 |
| **家庭遊戲** | 撲克牌、遊戲、互動 | 室內 |
| **家族團聚** | 四代同堂、合照 | 室內/室外 |
| **逛街購物** | 市場、購物、逛街 | 室外 |
| **節慶市場** | 燈籠、市場、節慶 | 室內 |
| **美食甜品** | 甜品、餐廳、美食 | 室內 |
| **休閒運動** | 高爾夫、草坪、運動 | 室外 |
| **兒童運動** | 保齡球、棒球、運動 | 室內 |
| **景點打卡** | Moomin、景點、打卡 | 室外 |
| **花園漫步** | 花園、鬱金香、漫步 | 室外 |
| **成長記錄** | 學校、日常、成長 | 室內/室外 |
| **多代同堂** | 爺爺奶奶、多代 | 室內 |

---

## 🤖 蝦蝦助手職責

### 1️⃣ 照片接收
- 監聽 Telegram 消息
- 識別照片附件
- 保存原始文件

### 2️⃣ 內容分析
```python
# 分析要素
- 人物識別（爸爸、媽媽、孩子們）
- 場景識別（客廳、餐廳、景點）
- 情感識別（歡樂、溫馨、感動）
- 活動識別（用餐、遊戲、出遊）
```

### 3️⃣ 故事編寫
```
故事要素：
- 時間：照片拍攝時間
- 地點：場景識別結果
- 人物：家庭成員識別
- 活動：正在進行的活動
- 情感：溫暖、歡樂、感動
- 細節：具體的溫暖細節
```

### 4️⃣ 主題分類
- 自動匹配 15 大主題
- 添加標籤（3-5 個）
- 記錄人物和地點

### 5️⃣ AI 圖像生成
- 使用宮崎駿風格提示詞
- 生成對比圖像
- 保存到 `assets/ai-images/`

### 6️⃣ 網站更新
- 更新 `stories/stories.json`
- 添加到畫廊頁面
- 生成預覽縮圖

---

## 📋 自動化腳本

### 照片處理腳本
```bash
#!/bin/bash
# process-family-photo.sh

PHOTO_PATH="$1"
PHOTO_NAME=$(basename "$PHOTO_PATH")
DATE=$(date +%Y-%m-%d)
THEME="$2"  # 可選，自動識別

# 創建日期文件夾
mkdir -p "assets/photos/$DATE"

# 複製照片
cp "$PHOTO_PATH" "assets/photos/$DATE/$PHOTO_NAME"

# 編寫故事（蝦蝦助手）
python3 scripts/generate-story.py \
  --photo "assets/photos/$DATE/$PHOTO_NAME" \
  --theme "$THEME"

# 生成 AI 對比圖
python3 scripts/generate-ai-comparison.py \
  --photo "assets/photos/$DATE/$PHOTO_NAME" \
  --style "miyazaki"

# 更新網站
python3 scripts/update-website.py \
  --date "$DATE" \
  --photo "$PHOTO_NAME"

echo "✅ 照片處理完成：$PHOTO_NAME"
```

### 故事生成腳本
```python
#!/usr/bin/env python3
# generate-story.py

import sys
import json
from datetime import datetime

def generate_story(photo_path, theme=None):
    """
    蝦蝦助手自動編寫溫暖故事
    """
    # TODO: 整合蝦蝦助手的分析能力
    story = {
        "id": f"photo{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "date": datetime.now().strftime('%Y-%m-%d'),
        "theme": theme or "家庭聚會",
        "tags": [],
        "story": "",  # 蝦蝦助手填寫
        "people": [],
        "location": "",
        "emotion": ""
    }
    return story

if __name__ == "__main__":
    photo_path = sys.argv[1]
    theme = sys.argv[2] if len(sys.argv) > 2 else None
    
    story = generate_story(photo_path, theme)
    
    # 保存到 stories.json
    with open("stories/stories.json", "a", encoding="utf-8") as f:
        json.dump(story, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 故事生成完成：{story['id']}")
```

---

## 🎨 AI 對比圖生成

### 提示詞模板
```
宮崎駿動畫風格，台灣家庭 [場景]，[人物描述]，[活動描述]，[情感氛圍]，手繪質感，柔和 [色調]，自然光線，細節豐富，台灣家庭日常，吉卜力工作室風格，龍貓風格溫馨，療癒系，家庭愛
```

### 生成參數
- **風格：** 宮崎駿/吉卜力
- **色調：** 溫暖、柔和
- **質感：** 手繪動畫
- **氛圍：** 溫馨、療癒

---

## 📊 進度追蹤

### 統計儀表板
```
📸 照片處理進度
================================
📥 已接收：X 張
📝 已編寫故事：X 篇
🏷️ 已分類主題：X 個
🎨 已生成 AI：X 張
🌐 已更新網站：X 次
```

### 自動化報告
每處理一張照片，自動回報：
```
📸 新照片處理完成！

照片：photo001.jpg
主題：家庭聚會
故事：紅色木沙發上，全家...
AI 對比：✅ 已生成
網站：✅ 已更新

進度：1/53 張（2%）
```

---

## 🚀 實施步驟

### 第 1 階段：基礎設置
- [x] 創建文件夾結構
- [x] 設置蝦蝦助手監聽
- [x] 創建故事模板
- [ ] 測試照片接收

### 第 2 階段：自動化
- [ ] 整合照片分析
- [ ] 自動化故事編寫
- [ ] 自動主題分類
- [ ] 自動 AI 生成

### 第 3 階段：網站整合
- [ ] 自動更新 stories.json
- [ ] 自動更新畫廊頁面
- [ ] 自動生成縮圖
- [ ] 自動部署

---

## 💡 蝦蝦助手進化

### 學習機制
1. 記錄每張照片的分析結果
2. 收集恩齊的反饋（如有）
3. 優化故事編寫風格
4. 改進主題分類準確度

### 經驗教訓
- 記錄成功的故事模式
- 記錄主題分類規則
- 記錄用戶偏好
- 持續改進處理流程

---

## 📍 文件位置

```
/Users/mac/.openclaw/workspace/
├── github-family-website/
│   ├── assets/
│   │   ├── photos/           # 真實照片
│   │   └── ai-images/        # AI 對比圖
│   └── stories/
│       └── stories.json      # 故事數據
└── scripts/
    ├── process-family-photo.sh
    ├── generate-story.py
    ├── generate-ai-comparison.py
    └── update-website.py
```

---

**準備就緒！開始接收家庭照片！** 📸❤️🚀
