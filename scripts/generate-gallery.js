#!/usr/bin/env node
/**
 * Gallery HTML Generator
 * 從 stories JSON 自動生成正確的 gallery/index.html
 * 確保圖文相符！
 */

const fs = require('fs');
const path = require('path');

// 路徑配置
const STORIES_DIR = path.join(__dirname, '..', 'stories');
const OUTPUT_FILE = path.join(__dirname, '..', 'gallery', 'index.html');
const STORIES_FILE = path.join(STORIES_DIR, 'stories-part1.json');

// 主題分類映射
const THEME_MAPPING = {
  '家庭冰淇淋聚會': '家庭聚會',
  '夫妻餐廳約會': '夫妻情誼',
  '父子電影時光': '親子出遊',
  'Moomin主題樂園': '主題樂園',
  '鬱金香花園': '花園美景',
  '夫妻用餐時光': '夫妻情誼',
  '父子遊戲時光': '親子時光',
  '家族團聚': '家族團聚',
  '新手爸爸': '新生兒紀念',
  '新手媽媽': '新生兒紀念',
  '夫妻恩愛': '夫妻情誼',
  '大家庭沙發照': '家庭聚會',
  '家庭聚會': '家庭聚會',
  '家族大合照': '家族大合照',
  '家庭聚餐': '家庭聚餐'
};

// 主題區塊定義
const THEME_SECTIONS = {
  '家庭聚會': { icon: '🏠', title: '家庭聚會' },
  '夫妻情誼': { icon: '💕', title: '夫妻情誼' },
  '親子出遊': { icon: '👨‍👩‍👧', title: '親子出遊' },
  '主題樂園': { icon: '🎢', title: '主題樂園' },
  '花園美景': { icon: '🌷', title: '花園美景' },
  '家族團聚': { icon: '👨‍👩‍👧‍👦', title: '家族團聚' },
  '新生兒紀念': { icon: '👶', title: '新生兒紀念' },
  '家族大合照': { icon: '📸', title: '家族大合照' },
  '家庭聚餐': { icon: '🍲', title: '家庭聚餐' }
};

// 讀取 stories JSON
function loadStories() {
  try {
    const data = fs.readFileSync(STORIES_FILE, 'utf-8');
    return JSON.parse(data).stories;
  } catch (error) {
    console.error('❌ 無法讀取 stories:', error.message);
    return [];
  }
}

// 按主題分組
function groupByTheme(stories) {
  const groups = {};
  
  for (const story of stories) {
    const theme = THEME_MAPPING[story.theme] || '其他';
    if (!groups[theme]) {
      groups[theme] = [];
    }
    groups[theme].push(story);
  }
  
  return groups;
}

// 生成單張照片卡片 HTML
function generatePhotoCard(story) {
  const tagsHtml = story.tags.map(tag => 
    `<span class="tag">${tag}</span>`
  ).join('\n');
  
  // 截取故事前 80 個字
  const shortStory = story.story.length > 80 
    ? story.story.substring(0, 80) + '...' 
    : story.story;
  
  return `
            <div class="photo-card">
                <img src="https://raw.githubusercontent.com/abujilongxia-commits/family-stories/main/assets/photos/${story.filename}" alt="${story.theme}">
                <div class="photo-info">
                    <h3>${story.theme}</h3>
                    <p>${shortStory}</p>
                    <div class="photo-tags">
                        ${tagsHtml}
                    </div>
                </div>
            </div>`;
}

// 生成主題區塊 HTML
function generateThemeSection(theme, stories) {
  const themeInfo = THEME_SECTIONS[theme] || { icon: '📷', title: theme };
  const cardsHtml = stories.map(generatePhotoCard).join('\n');
  
  return `
    <!-- 主題: ${theme} -->
    <section id="${theme}" class="theme-section">
        <h2>${themeInfo.icon} ${themeInfo.title}</h2>
        <div class="photo-grid">
            ${cardsHtml}
        </div>
    </section>`;
}

// 生成完整 HTML
function generateHTML(stories) {
  const grouped = groupByTheme(stories);
  const sectionsHtml = Object.entries(grouped)
    .map(([theme, themeStories]) => generateThemeSection(theme, themeStories))
    .join('\n');
  
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>故事專輯 - 家庭小確幸</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700&display=swap" rel="stylesheet">
    <style>
        .gallery-header {
            padding: 8rem 2rem 4rem;
            text-align: center;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--background-color) 100%);
        }
        
        .gallery-header h1 {
            font-size: 3rem;
            color: var(--secondary-color);
            margin-bottom: 1rem;
        }
        
        .gallery-header p {
            font-size: 1.3rem;
            color: var(--text-color);
        }
        
        .gallery-nav {
            padding: 2rem;
            background: white;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .gallery-nav a {
            display: inline-block;
            margin: 0.5rem 0.3rem;
            padding: 0.6rem 1.2rem;
            background: var(--background-color);
            color: var(--text-color);
            text-decoration: none;
            border-radius: 50px;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }
        
        .gallery-nav a:hover {
            background: var(--accent-color);
            color: white;
        }
        
        .photo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            padding: 4rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .photo-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .photo-card:hover {
            transform: translateY(-10px);
        }
        
        .photo-card img {
            width: 100%;
            height: 250px;
            object-fit: cover;
        }
        
        .photo-info {
            padding: 1.5rem;
        }
        
        .photo-info h3 {
            color: var(--secondary-color);
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
        }
        
        .photo-info p {
            color: var(--text-color);
            line-height: 1.8;
            font-size: 0.95rem;
        }
        
        .photo-tags {
            margin-top: 1rem;
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .tag {
            background: var(--background-color);
            color: var(--accent-color);
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
        }
        
        .theme-section {
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .theme-section h2 {
            font-size: 2rem;
            color: var(--secondary-color);
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 3px solid var(--accent-color);
        }
        
        @media (max-width: 768px) {
            .gallery-header h1 {
                font-size: 2rem;
            }
            
            .photo-grid {
                grid-template-columns: 1fr;
                padding: 2rem 1rem;
            }
            
            .gallery-nav a {
                display: block;
                margin: 0.5rem 0;
            }
        }
    </style>
</head>
<body>
    <!-- 導航欄 -->
    <nav class="main-nav">
        <div class="nav-container">
            <a href="../index.html" class="nav-logo">🏠 家庭小確幸</a>
            <ul class="nav-menu">
                <li><a href="../index.html">首頁</a></li>
                <li><a href="index.html">故事專輯</a></li>
                <li><a href="../ai-art/index.html">AI 藝術</a></li>
                <li><a href="../about.html">關於我們</a></li>
            </ul>
        </div>
    </nav>

    <!-- 頁面標題 -->
    <header class="gallery-header">
        <h1>📖 故事專輯</h1>
        <p>用照片記錄每一個溫暖的瞬間</p>
    </header>

    <!-- 快速導航 -->
    <nav class="gallery-nav">
        <a href="#家庭聚會">🏠 家庭聚會</a>
        <a href="#夫妻情誼">💕 夫妻情誼</a>
        <a href="#親子出遊">👨‍👩‍👧 親子出遊</a>
        <a href="#家族團聚">👨‍👩‍👧‍👦 家族團聚</a>
        <a href="#新生兒紀念">👶 新生兒紀念</a>
        <a href="#花園美景">🌷 花園美景</a>
        <a href="#主題樂園">🎢 主題樂園</a>
    </nav>

    <!-- 照片專輯 -->
    ${sectionsHtml}

    <!-- 頁腳 -->
    <footer>
        <p>❤️ 用愛編織的家庭故事</p>
        <p>© 2026 家庭小確幸 | 由 AI 協助創作</p>
    </footer>

    <script>
        // 平滑滾動
        document.querySelectorAll('.gallery-nav a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // 載入動畫
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });
        
        document.querySelectorAll('.photo-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            observer.observe(card);
        });
    </script>
</body>
</html>`;
}

// 主程式
function main() {
  console.log('🔄 開始生成 Gallery HTML...');
  
  const stories = loadStories();
  
  if (stories.length === 0) {
    console.log('❌ 沒有找到故事資料');
    process.exit(1);
  }
  
  console.log(`✅ 載入 ${stories.length} 個故事`);
  
  const html = generateHTML(stories);
  
  fs.writeFileSync(OUTPUT_FILE, html, 'utf-8');
  
  console.log(`✅ Gallery HTML 已生成: ${OUTPUT_FILE}`);
  console.log(`📊 共 ${stories.length} 張照片`);
  
  // 顯示分組統計
  const grouped = groupByTheme(stories);
  console.log('\n📁 主題分組:');
  for (const [theme, themeStories] of Object.entries(grouped)) {
    console.log(`   ${theme}: ${themeStories.length} 張`);
  }
}

main();
