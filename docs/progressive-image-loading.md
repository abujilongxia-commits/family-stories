# 漸進式圖片載入（LQIP）指南

**實現日期：** 2026-03-17  
**技術：** LQIP (Low Quality Image Placeholder) + Blur-up Effect

---

## 🎯 問題

**原始狀況：**
- 每張照片 7-8MB
- 第二集 35 張 = **約 280MB**
- 首次載入極慢（30 秒 - 2 分鐘）
- 用戶體驗差

---

## ✅ 解決方案

**漸進式載入流程：**

```
1. 頁面載入 → 立即顯示低畫質縮圖（模糊）
2. 用戶滾動 → 懶載入觸發
3. 高畫質圖片載入 → 漸變清晰（blur-up 效果）
4. 完成 → 顯示載入進度
```

**性能提升：**
- 縮圖大小：20-200KB（原圖的 2-10%）
- 首次載入：從 ~280MB 降至 **~6MB**（95% 減少）
- 可交互時間：從 30-60 秒 降至 **2-5 秒**

---

## 🛠️ 工具與腳本

### 1. 生成縮圖

```bash
cd /Users/mac/.openclaw/workspace/github-family-website

# 為指定集數生成縮圖
node scripts/generate-thumbnails.js episode2
node scripts/generate-thumbnails.js episode3
```

**參數：**
- `QUALITY`: 60%（可調整）
- `WIDTH`: 400px（可調整）

### 2. 應用漸進式載入

```bash
# 方法 1：自動轉換現有 HTML
python3 scripts/enable-progressive-loading.py episode2

# 方法 2：添加樣式和腳本
python3 scripts/add-progressive-styles.py dev/episode2/story.html
```

### 3. 使用模板（新集數）

```
templates/story-progressive.html
```

此模板已包含：
- ✅ 漸進式載入 CSS
- ✅ 載入進度條
- ✅ 狀態提示
- ✅ Intersection Observer 懶載入

---

## 📁 文件結構

```
dev/episode2/
├── story.html              # 主故事頁面（已更新）
├── thumbnails/             # 低畫質縮圖目錄
│   ├── 01_家門集合.jpg    # ~178KB (原圖 7.2MB)
│   ├── 02_鎮瀾宮前.jpg    # ~182KB (原圖 7.7MB)
│   └── ...
└── 01_家門集合.jpg         # 原始高畫質圖片
```

---

## 🔧 HTML 變更

**原始：**
```html
<img src="01_家門集合.jpg" alt="家門集合">
```

**更新後：**
```html
<img src="thumbnails/01_家門集合.jpg" 
     data-src="01_家門集合.jpg" 
     alt="家門集合">
```

**說明：**
- `src`: 初始載入低畫質縮圖
- `data-src`: 高畫質原圖路徑（懶載入使用）

---

## 🎨 CSS 效果

### Blur-up 動畫

```css
/* 低畫質縮圖（模糊） */
.scene-image img[data-src] {
    filter: blur(10px);
    transform: scale(1.05);
}

/* 高畫質已載入（清晰） */
.scene-image img.loaded {
    filter: blur(0);
    transform: scale(1);
}
```

### 載入進度條

- 位置：頁面頂部
- 顏色：漸變色（與主題一致）
- 動畫：平滑過渡

### 狀態提示

- 位置：右下角
- 顯示：`載入中 X/Y`
- 自動隱藏：完成後 0.5 秒

---

## 📊 性能對比

| 指標 | 原始 | 漸進式 | 改善 |
|------|------|--------|------|
| **首次載入大小** | ~280MB | ~6MB | -95% |
| **可交互時間** | 30-60 秒 | 2-5 秒 | -90% |
| **縮圖總大小** | N/A | ~6MB | - |
| **用戶感知速度** | 極慢 | 快速 | ✅ |

---

## 🚀 批量處理所有集數

```bash
#!/bin/bash
# batch-generate-all.sh

for ep in episode1 episode2 episode3 episode4 episode5 episode6 episode7 episode8 episode9; do
    echo "處理 $ep..."
    node scripts/generate-thumbnails.js $ep
    python3 scripts/enable-progressive-loading.py $ep
done
```

---

## ⚙️ 自定義配置

### 調整縮圖品質

編輯 `scripts/generate-thumbnails.js`:

```javascript
const QUALITY = 60; // 改為 50-80（越高越清晰，文件越大）
const WIDTH = 400;  // 改為 300-600（越小越快）
```

### 調整模糊強度

編輯 HTML 中的 CSS:

```css
.scene-image img[data-src] {
    filter: blur(10px); /* 改為 5-20px */
}
```

### 調整懶載入預載距離

編輯 JavaScript:

```javascript
rootMargin: '100px 0px'  // 改為 50-300px
```

---

## 🧪 測試

### 1. 本地測試

```bash
cd dev/episode2
python3 -m http.server 8080
```

訪問：http://localhost:8080/story.html

### 2. 網絡測試

訪問 GitHub Pages:
https://abujilongxia-commits.github.io/family-stories/dev/episode2/story.html

### 3. 檢查項目

- [ ] 縮圖是否正常顯示（模糊）
- [ ] 滾動時是否漸變清晰
- [ ] 進度條是否正確更新
- [ ] 狀態提示是否顯示/隱藏
- [ ] 移動設備是否正常

---

## 📝 注意事項

1. **縮圖目錄不要刪除** - 包含所有低畫質版本
2. **提交時包含縮圖** - 確保 GitHub Pages 能訪問
3. **測試移動設備** - 確保觸控滾動正常
4. **監控文件大小** - 避免縮圖過大

---

## 🔮 未來優化

- [ ] WebP 格式（進一步減少 30% 大小）
- [ ] CDN 加速
- [ ] 預載關鍵圖片
- [ ] 適配器模式（根據網絡速度調整）

---

**相關文件：**
- `scripts/generate-thumbnails.js`
- `scripts/enable-progressive-loading.py`
- `scripts/add-progressive-styles.py`
- `templates/story-progressive.html`
