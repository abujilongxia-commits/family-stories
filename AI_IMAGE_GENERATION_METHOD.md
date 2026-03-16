# 🎨 家庭網站 AI 圖像生成方法 - 最終決策

**更新日期：** 2026-03-16 10:57 AM  
**決策者：** 恩齊

---

## ❌ 已淘汰方法：LoRA + Stable Diffusion 1.5

### 淘汰原因

| 問題 | 說明 |
|------|------|
| **解析度過低** | 512x768，無法滿足現代網站需求 |
| **角色一致性不足** | 依賴訓練品質，效果不穩定 |
| **提示詞遵循度中等** | 需要複雜的提示詞工程 |
| **設定複雜** | 需要訓練 LoRA 模型（2-3 小時） |
| **背景細節一般** | 缺乏豐富度和深度 |
| **技術老舊** | SD 1.5 是 2022 年的模型 |

### 已生成內容

- 弟弟 LoRA：13 張測試圖
- 哥哥 LoRA：5 張測試圖
- **總計：18 張**（已存檔，不再使用）

### 模型存檔

```
/Users/mac/.openclaw/workspace/lora-training/outputs/
├── younger_son_lora.safetensors  # 已存檔
├── older_son_lora.safetensors    # 已存檔
└── test_*.jpg                     # 測試圖（參考用）
```

---

## ✅ 現用方法：Gemini 3 Pro Image (Nano Banana Pro)

### 優勢

| 優勢 | 說明 |
|------|------|
| **高解析度** | 2048x2048 (2K)，可升級 4K |
| **角色一致性優秀** | 原生理解人物特徵 |
| **提示詞遵循優秀** | 準確理解複雜描述 |
| **使用簡單** | 無需訓練，直接使用 |
| **背景細節豐富** | 吉卜力風格原生支援 |
| **技術最新** | 2026 年 Gemini 3 Pro |
| **成本合理** | $0.03/張（2K） |

### 技能配置

**位置：**
```
/Users/mac/.openclaw/workspace/skills/family-website-image-gen/
```

**文件：**
- `SKILL.md` - 完整技能文檔
- `README.md` - 使用指南
- `scripts/generate.py` - 單張生成
- `scripts/batch_generate.py` - 批量生成

### API 配置

```bash
# ~/.openclaw/.env
GEMINI_IMAGE_API_KEY=sk-5XyiTHMibQgPQ0iaho639nNHUIY0kS5LOGOs7T8shyXVSXC9
GEMINI_IMAGE_BASE_URL=https://newapi.pockgo.com/
GEMINI_IMAGE_MODEL=gemini-3-pro-image-preview-2k
```

---

## 📊 方法對比

| 特性 | SD 1.5 + LoRA ❌ | Gemini 3 Pro ✅ |
|------|----------------|----------------|
| **解析度** | 512x768 | **2048x2048 (2K)** |
| **角色一致性** | 中等 | **優秀** |
| **提示詞遵循** | 中等 | **優秀** |
| **背景細節** | 一般 | **豐富** |
| **使用難度** | 高（需訓練） | **低（直接使用）** |
| **生成速度** | 40-60 秒 | 60 秒 |
| **成本** | 免費 | $0.03/張 |
| **技術年份** | 2022 | **2026** |
| **推薦度** | ❌ 已淘汰 | ✅ **現用標準** |

---

## 🎯 家庭網站專案目標

### 最終目標

- **故事數量：** 53 篇
- **AI 圖像目標：** 280 張
- **解析度標準：** 2K (2048x2048)
- **風格：** 宮崎駿動畫風格（吉卜力工作室）

### 生成計劃

| 批次 | 角色 | 數量 | 解析度 | 成本 | 狀態 |
|------|------|------|--------|------|------|
| **第 1 批** | 弟弟 | 50 張 | 2K | $1.50 | 待生成 |
| **第 2 批** | 哥哥 | 50 張 | 2K | $1.50 | 待生成 |
| **第 3 批** | 混合 | 180 張 | 2K | $5.40 | 待生成 |
| **總計** | - | **280 張** | 2K | **$8.40** | - |

### 執行命令

#### 第 1 批：弟弟 50 張
```bash
uv run /Users/mac/.openclaw/workspace/skills/family-website-image-gen/scripts/batch_generate.py \
  --character younger_son \
  --count 50 \
  --resolution 2K \
  --output-dir /Users/mac/.openclaw/workspace/github-family-website/assets/ai-images
```

#### 第 2 批：哥哥 50 張
```bash
uv run /Users/mac/.openclaw/workspace/skills/family-website-image-gen/scripts/batch_generate.py \
  --character older_son \
  --count 50 \
  --resolution 2K \
  --output-dir /Users/mac/.openclaw/workspace/github-family-website/assets/ai-images
```

#### 第 3 批：混合 180 張
```bash
# 分多次執行，每次 50 張
uv run /Users/mac/.openclaw/workspace/skills/family-website-image-gen/scripts/batch_generate.py \
  --character younger_son \
  --count 50 \
  --resolution 2K

uv run /Users/mac/.openclaw/workspace/skills/family-website-image-gen/scripts/batch_generate.py \
  --character older_son \
  --count 50 \
  --resolution 2K

# ... 重複直到達到目標數量
```

---

## 📁 輸出管理

### 輸出目錄

```
/Users/mac/.openclaw/workspace/github-family-website/assets/ai-images/
```

### 文件命名格式

```
{timestamp}-{character}-{scene}-{index}-{resolution}.jpg

範例：
2026-03-16-10-53-48-younger-公園-001-2K.jpg
2026-03-16-11-00-00-older-海灘-002-2K.jpg
```

### 品質檢查

```bash
# 查看生成的圖片
ls -lh /Users/mac/.openclaw/workspace/github-family-website/assets/ai-images/*.jpg | tail -20

# 檢查文件大小（應在 2-5MB 之間）
# 檢查解析度（應為 2048x2048）
```

---

## 💰 成本監控

### API 使用追蹤

| 日期 | 數量 | 解析度 | 成本 | 備註 |
|------|------|--------|------|------|
| 2026-03-16 | 1 張 | 2K | $0.03 | 測試生成（公園） |
| **總計** | **1 張** | - | **$0.03** | - |

### 預算上限

- **每日上限：** 100 張（$3.00）
- **專案總預算：** $10.00（含緩衝）
- **實際預估：** $8.40

---

## 📖 相關文檔

- **技能文檔：** `/Users/mac/.openclaw/workspace/skills/family-website-image-gen/SKILL.md`
- **使用指南：** `/Users/mac/.openclaw/workspace/skills/family-website-image-gen/README.md`
- **進度追蹤：** `/Users/mac/.openclaw/workspace/github-family-website/progress/`
- **整合狀態：** `/Users/mac/.openclaw/workspace/github-family-website/AI_IMAGE_INTEGRATION_STATUS.md`

---

## ✅ 決策確認

**確認人：** 恩齊  
**確認時間：** 2026-03-16 10:57 AM  
**決策：** 全面使用 Gemini 3 Pro Image，淘汰 SD 1.5 + LoRA 方法

**此方法將作為家庭網站專案的標準生成流程！** 🎨✨
