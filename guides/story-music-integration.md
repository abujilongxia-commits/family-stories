# 🎵 故事與音樂整合指南

**目標：** 每個故事搭配一首鋼琴/水晶音樂  
**創建時間：** 2026-03-14 05:26 AM

---

## 🎯 音樂選擇原則

### 1️⃣ 情感匹配

| 故事情感 | 音樂類型 | 推薦藝術家 |
|----------|----------|-----------|
| **溫暖家庭愛** | 溫柔鋼琴 | Yiruma、林海 |
| **浪漫愛情** | 抒情鋼琴 | Yiruma、Pachelbel |
| **親子時光** | 輕快鋼琴 | 久石讓 |
| **家族團聚** | 溫暖鋼琴 | 久石讓、George Winston |
| **新生兒** | 水晶音樂 | Bandari |
| **成長記錄** | 懷念鋼琴 | 林海、久石讓 |
| **日常陪伴** | 簡約鋼琴 | Yann Tiersen |

---

### 2️⃣ 音樂來源

**主要平台：**
- 🎵 **YouTube** - 免費、易嵌入
- 🎧 **Spotify** - 高品質、播放清單
- 🍎 **Apple Music** - 高品質（可選）

**推薦頻道：**
- [Relaxing Piano Music](https://youtube.com)
- [Studio Ghibli Piano](https://youtube.com)
- [Yiruma Official](https://youtube.com)

---

### 3️⃣ 網站整合

**HTML 嵌入方式：**

```html
<div class="story-card">
    <!-- 照片和故事 -->
    <div class="story-content">
        <h3>家庭冰淇淋聚會 🍦</h3>
        <p>一個溫暖的週末下午...</p>
    </div>
    
    <!-- 音樂播放器 -->
    <div class="music-player">
        <h4>🎵 背景音樂</h4>
        <p><strong>Kiss the Rain</strong> - Yiruma</p>
        <iframe 
            src="https://www.youtube.com/embed/SOjdGcXeMYg" 
            frameborder="0" 
            allow="autoplay; encrypted-media" 
            allowfullscreen>
        </iframe>
    </div>
</div>
```

**CSS 樣式：**
```css
.music-player {
    background: linear-gradient(135deg, rgba(143, 188, 143, 0.1) 0%, rgba(221, 160, 221, 0.1) 100%);
    padding: 1.5rem;
    border-radius: 15px;
    margin-top: 1.5rem;
}

.music-player iframe {
    width: 100%;
    height: 200px;
    border-radius: 10px;
}
```

---

### 4️⃣ 播放清單

**已創建：** `config/story-music-playlist.json`

**包含：**
- 15 首鋼琴/水晶音樂
- YouTube 和 Spotify 連結
- 情感標籤
- 時長資訊

---

### 5️⃣ 蝦蝦助手任務

**請蝦蝦助手：**

1. **審視音樂選擇** - 是否符合故事情感？
2. **調整配對** - 需要更換的音樂？
3. **補充連結** - 添加更多音樂來源？
4. **創建播放清單** - Spotify/Apple Music 公開播放清單？

---

## 📊 音樂清單總覽

| # | 主題 | 音樂 | 藝術家 | 類型 |
|---|------|------|--------|------|
| 1 | 家庭冰淇淋聚會 | Kiss the Rain | Yiruma | 鋼琴 |
| 2 | 夫妻餐廳約會 | River Flows in You | Yiruma | 鋼琴 |
| 3 | 父子電影時光 | 父亲 | 林海 | 鋼琴 |
| 4 | Moomin 主題樂園 | Summer | 久石讓 | 鋼琴 |
| 5 | 鬱金香花園 | Spring | 久石讓 | 鋼琴 |
| 6 | 夫妻用餐時光 | Comptine d'un autre été | Yann Tiersen | 鋼琴 |
| 7 | 父子遊戲時光 | The Rain | 久石讓 | 鋼琴 |
| 8 | 家族團聚 | One Summer's Day | 久石讓 | 鋼琴 |
| 9 | 新手爸爸 | 水晶音樂 - 新生 | Bandari | 水晶 |
| 10 | 新手媽媽 | Lullaby | Brahms | 鋼琴 |
| 11 | 夫妻恩愛 | Canon in D | Pachelbel | 鋼琴 |
| 12 | 大家庭沙發照 | Home | Michael Bublé | 鋼琴 |
| 13 | 家庭聚會 | Family | 久石讓 | 鋼琴 |
| 14 | 家族大合照 | Memory | Bandari | 水晶 |
| 15 | 家庭聚餐 | Thanksgiving | George Winston | 鋼琴 |

---

## 🎯 下一步

1. **蝦蝦助手審視** - 音樂選擇是否合適？
2. **調整配對** - 需要更換的音樂？
3. **網站整合** - 添加音樂播放器到畫廊頁面
4. **創建公開播放清單** - Spotify/Apple Music

---

**讓每個故事都有適合的背景音樂！** 🎵✨
