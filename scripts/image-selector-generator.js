#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 圖片選擇工具後端服務
// 掃描所有集數的圖片目錄並提供 API

const episodes = [
  // scanPath：Node 讀檔用（以 scripts/ 為基準）
  // publicPath：HTML 用（image-selector.html 在 dev/，所以用 ./episodeX/...）
  { id: 'episode1', scanPath: '../dev/episode1/', publicPath: './episode1/', hasImagesFolder: false },
  { id: 'episode2', scanPath: '../dev/episode2/', publicPath: './episode2/', hasImagesFolder: false },
  { id: 'episode3', scanPath: '../dev/episode3/images/', publicPath: './episode3/images/', hasImagesFolder: true },
  { id: 'episode4', scanPath: '../dev/episode4/images/', publicPath: './episode4/images/', hasImagesFolder: true },
  { id: 'episode5', scanPath: '../dev/episode5/images/', publicPath: './episode5/images/', hasImagesFolder: true },
  { id: 'episode6', scanPath: '../dev/episode6/images/', publicPath: './episode6/images/', hasImagesFolder: true },
  { id: 'episode7', scanPath: '../dev/episode7/images/', publicPath: './episode7/images/', hasImagesFolder: true },
  { id: 'episode8', scanPath: '../dev/episode8/images/', publicPath: './episode8/images/', hasImagesFolder: true },
  { id: 'episode9', scanPath: '../dev/episode9/images/', publicPath: './episode9/images/', hasImagesFolder: true }
];

// 獲取所有圖片
function getAllImages() {
  const result = {};
  
  episodes.forEach(episode => {
    const images = [];
    const basePath = path.join(__dirname, episode.scanPath);
    
    try {
      if (fs.existsSync(basePath)) {
        const files = fs.readdirSync(basePath);
        
        files.forEach(file => {
          if (file.match(/\.(jpg|jpeg|png|gif|webp)$/i) && 
              !file.includes('thumbnail')) {
            images.push({
              name: file,
              path: episode.publicPath + file,
              hasThumbnailsFolder: episode.hasImagesFolder
            });
          }
        });
        
        // 按檔名排序
        images.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant-TW'));
      }
    } catch (error) {
      console.error(`讀取 ${episode.id} 圖片時發生錯誤:`, error.message);
    }
    
    result[episode.id] = images;
  });
  
  return result;
}

// 生成 HTML 頁面
function generateHTML() {
  const allImages = getAllImages();
  
  let html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>家庭故事集 - 圖片選擇工具</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8f9fa;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        h1 {
            color: #2c3e50;
            text-align: center;
            font-size: 2.2em;
            margin-bottom: 10px;
        }
        
        .subtitle {
            text-align: center;
            color: #7f8c8d;
            margin-bottom: 30px;
            font-size: 1.1em;
        }
        
        .episode-section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            background: white;
        }
        
        .episode-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
        }
        
        .episode-title {
            font-size: 1.3em;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .image-count {
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .image-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            position: relative;
            cursor: pointer;
            border: 3px solid transparent;
        }
        
        .image-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        
        .image-card.selected {
            border-color: #e74c3c;
            background: #fff5f5;
        }
        
        .image-container {
            width: 100%;
            height: 150px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
        }
        
        .image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .image-info {
            padding: 10px;
            font-size: 0.85em;
        }
        
        .image-name {
            font-weight: 600;
            color: #2c3e50;
            word-break: break-all;
            margin-bottom: 3px;
        }
        
        .image-checkbox {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 24px;
            height: 24px;
            accent-color: #e74c3c;
            z-index: 10;
        }
        
        .controls {
            margin-top: 20px;
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .control-btn {
            padding: 12px 24px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1em;
            font-weight: 500;
            transition: background 0.3s ease;
        }
        
        .select-all {
            background: #3498db;
            color: white;
        }
        
        .select-all:hover {
            background: #2980b9;
        }
        
        .clear-selection {
            background: #95a5a6;
            color: white;
        }
        
        .clear-selection:hover {
            background: #7f8c8d;
        }
        
        .export {
            background: #2ecc71;
            color: white;
        }
        
        .export:hover {
            background: #27ae60;
        }
        
        .selected-count {
            margin-top: 15px;
            padding: 15px;
            background: #e8f4fd;
            border-radius: 5px;
            text-align: center;
            font-weight: 600;
            color: #2980b9;
            font-size: 1.1em;
        }

        .toolbar {
            position: sticky;
            top: 0;
            z-index: 50;
            background: rgba(248, 249, 250, 0.95);
            backdrop-filter: blur(8px);
            border: 1px solid #e9ecef;
            border-radius: 12px;
            padding: 12px;
            margin: 15px 0 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }

        .toolbar-row {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
        }

        .toolbar-left, .toolbar-right {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
        }

        .search {
            min-width: 260px;
            flex: 1;
            max-width: 520px;
        }

        .search input {
            width: 100%;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid #dfe6e9;
            font-size: 0.95em;
        }

        .pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border: 1px solid #dfe6e9;
            border-radius: 999px;
            background: white;
            font-size: 0.9em;
            cursor: pointer;
            user-select: none;
        }

        .pill input { cursor: pointer; }

        .hint {
            color: #7f8c8d;
            font-size: 0.85em;
        }

        .episode-section.collapsed .image-grid,
        .episode-section.collapsed .episode-actions,
        .episode-section.collapsed .selected-count {
            display: none;
        }

        .episode-title button {
            all: unset;
            cursor: pointer;
        }

        .copy-snippet {
            background: #8e44ad;
            color: white;
        }

        .copy-snippet:hover {
            background: #7d3c98;
        }

        .apply-episode {
            background: #16a085;
            color: white;
        }

        .apply-episode:hover {
            background: #138a72;
        }

        .apply-all {
            background: #0b7285;
            color: white;
        }

        .apply-all:hover {
            background: #095c6b;
        }
        
        .status-message {
            margin-top: 15px;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            font-weight: 500;
        }
        
        .status-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .status-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        @media (max-width: 768px) {
            .image-grid {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 10px;
            }
            
            h1 {
                font-size: 1.8em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🖼️ 家庭故事集 - 圖片選擇工具</h1>
        <div class="subtitle">為每一集選擇要在讀者版中顯示的圖片</div>
        
        <div class="toolbar">
            <div class="toolbar-row">
                <div class="toolbar-left" style="flex: 1;">
                    <div class="search">
                        <input id="searchInput" type="search" placeholder="快速搜尋檔名（例如：結尾、媽媽、07_、畢業…）">
                    </div>
                    <label class="pill" title="只顯示已選圖片">
                        <input id="selectedOnly" type="checkbox">
                        只看已選
                    </label>
                </div>
                <div class="toolbar-right">
                    <button class="control-btn export" onclick="exportConfiguration()">📤 匯出（reader/config.json）</button>
                    <button class="control-btn apply-all" onclick="applyAllToReader()">✅ 套用全部到讀者版</button>
                    <button class="control-btn clear-selection" onclick="clearAllSelections()">🗑️ 全部清除</button>
                </div>
            </div>
            <div class="hint" style="margin-top: 8px;">
                小技巧：Shift+點選可連選區間；在搜尋框按 ESC 可清空搜尋。
            </div>
        </div>
        
        <div class="selected-count" id="totalSelected">
            總共已選擇 <span id="totalCount">0</span> 張圖片
        </div>
        
        <div id="episodesContainer">
`;

  // 為每一集生成 HTML
  episodes.forEach(episode => {
    const images = allImages[episode.id] || [];
    const episodeNum = episode.id.replace('episode', '');
    const episodeTitle = getEpisodeTitle(episodeNum);
    
    html += `
            <div class="episode-section" id="section-${episode.id}">
                <div class="episode-header">
                    <div class="episode-title">
                        <button type="button" onclick="toggleCollapse('${episode.id}')" title="點擊可折疊/展開">
                            第 ${episodeNum} 集：${episodeTitle}
                        </button>
                    </div>
                    <div class="image-count">共 ${images.length} 張圖片</div>
                </div>
                <div class="selected-count" id="count-${episode.id}">
                    已選擇 <span id="count-num-${episode.id}">0</span> 張圖片
                </div>
                <div class="image-grid" id="grid-${episode.id}">
`;
    
    // 添加圖片卡片
    images.forEach((img, index) => {
      const thumbnailPath = img.hasThumbnailsFolder ? `${img.path.replace(/\/([^\/]+)$/, '/thumbnails/$1')}` : img.path;
      html += `
                    <div class="image-card" data-episode="${episode.id}" data-path="${img.path}" data-name="${img.name}" data-index="${index}" onclick="toggleImage(this, event)">
                        <div class="image-container">
                            <img src="${thumbnailPath}" data-full="${img.path}" alt="${img.name}" loading="lazy" decoding="async" onerror="if(this.dataset.full && this.src!==this.dataset.full){this.src=this.dataset.full;return;} this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'%23f8f9fa\\'/><text x=\\'50\\' y=\\'50\\' font-family=\\'Arial\\' font-size=\\'12\\' fill=\\'%2395a5a6\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>圖片<br>載入失敗</text></svg>';">
                        </div>
                        <div class="image-info">
                            <div class="image-name">${img.name}</div>
                        </div>
                        <input type="checkbox" class="image-checkbox" onclick="event.stopPropagation(); toggleImage(this.parentElement, event)">
                    </div>
`;
    });
    
    html += `
                </div>
                <div class="episode-actions" style="margin-top: 15px;">
                    <button class="control-btn select-all" onclick="selectAll('${episode.id}')">全選本集</button>
                    <button class="control-btn clear-selection" onclick="clearSelection('${episode.id}')">清除本集</button>
                    <button class="control-btn copy-snippet" onclick="copyEpisodeSnippet('${episode.id}')">📋 複製本集圖片區塊</button>
                    <button class="control-btn apply-episode" onclick="applyEpisodeToReader('${episode.id}')">✅ 套用到本集</button>
                </div>
            </div>
`;
  });
  
  html += `
        </div>
        
        <div id="statusMessage" class="status-message" style="display: none;"></div>
    </div>

    <script>
        // 存儲選定圖片的配置
        let selectedImages = {
            episode1: [],
            episode2: [],
            episode3: [],
            episode4: [],
            episode5: [],
            episode6: [],
            episode7: [],
            episode8: [],
            episode9: []
        };

        let selectedOnly = false;
        let searchQuery = '';
        const lastClickedIndexByEpisode = {};
        
        function saveConfiguration() {
            try {
                localStorage.setItem('familyStoriesImageConfig', JSON.stringify({ selectedImages }));
            } catch (error) {
                console.warn('保存配置時發生錯誤:', error);
            }
        }

        function loadConfiguration() {
            try {
                const saved = localStorage.getItem('familyStoriesImageConfig');
                if (!saved) return;
                const parsed = JSON.parse(saved);
                if (parsed?.selectedImages) {
                    selectedImages = parsed.selectedImages;
                    showStatus('已載入先前保存的配置', 'success');
                }
            } catch (error) {
                console.warn('載入配置時發生錯誤:', error);
            }
        }

        function normalizeForReader(path) {
            // dev/image-selector.html 匯出給 reader/ 使用：把 ./episodeX/... 轉成 ../episodeX/...
            if (typeof path !== 'string') return path;
            if (path.startsWith('./')) return '../' + path.slice(2);
            return path;
        }

        function buildEpisodeImageHTML(episode) {
            const paths = (selectedImages[episode] || []).map(normalizeForReader);
            if (!paths.length) {
                return '<div class="no-images">此集數尚未選定圖片</div>';
            }

            let html = '<div class="image-container">';
            paths.forEach(p => {
                html += '<div class="image-item"><img src="' + p + '" alt="選定圖片" onerror="this.parentElement.style.display=\\'none\\'"></div>';
            });
            html += '</div>';
            return html;
        }

        async function copyToClipboard(text) {
            // Clipboard API on file:// can be finicky; provide fallback.
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return;
            }
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', 'readonly');
            ta.style.position = 'fixed';
            ta.style.top = '-1000px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }

        async function copyEpisodeSnippet(episode) {
            try {
                const snippet = buildEpisodeImageHTML(episode);
                await copyToClipboard(snippet);
                showStatus('已複製：請貼到 reader 版該集內容最上方（或你想顯示的位置）', 'success');
            } catch (error) {
                console.error('複製失敗:', error);
                showStatus('複製失敗：' + error.message, 'error');
            }
        }

        async function applyEpisodeToReader(episode) {
            try {
                const images = (selectedImages[episode] || []).map(normalizeForReader);
                const resp = await fetch('http://127.0.0.1:18790/sync/episode/' + episode, {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ images })
                });
                const data = await resp.json().catch(() => ({}));
                if (!resp.ok || !data.ok) {
                    throw new Error(data.error || ('HTTP ' + resp.status));
                }
                showStatus('已套用到讀者版：' + episode + '（' + images.length + ' 張）', 'success');
            } catch (error) {
                console.error('套用失敗:', error);
                showStatus('套用失敗：請先在終端機執行 node scripts/selector-sync-server.js。' , 'error');
            }
        }

        async function applyAllToReader() {
            try {
                const exportSelectedImages = {};
                Object.entries(selectedImages).forEach(([episode, paths]) => {
                    exportSelectedImages[episode] = (paths || []).map(normalizeForReader);
                });
                const payload = {
                    selectedImages: exportSelectedImages,
                    exportedAt: new Date().toISOString(),
                    totalSelected: Object.values(exportSelectedImages)
                        .reduce((total, arr) => total + (Array.isArray(arr) ? arr.length : 0), 0)
                };

                const resp = await fetch('http://127.0.0.1:18790/sync/all', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await resp.json().catch(() => ({}));
                if (!resp.ok || !data.ok) {
                    throw new Error(data.error || ('HTTP ' + resp.status));
                }
                showStatus('已套用全部到讀者版（更新 reader/config.json）', 'success');
            } catch (error) {
                console.error('套用失敗:', error);
                showStatus('套用失敗：請先在終端機執行 node scripts/selector-sync-server.js。' , 'error');
            }
        }

        function applyFilters() {
            const q = (searchQuery || '').trim().toLowerCase();
            for (let i = 1; i <= 9; i++) {
                const episode = 'episode' + i;
                const cards = document.querySelectorAll('#grid-' + episode + ' .image-card');
                cards.forEach(card => {
                    const name = (card.dataset.name || '').toLowerCase();
                    const isSel = card.classList.contains('selected');
                    const passSel = !selectedOnly || isSel;
                    const passSearch = !q || name.includes(q);
                    card.style.display = (passSel && passSearch) ? '' : 'none';
                });
            }
        }

        function toggleCollapse(episode) {
            const section = document.getElementById('section-' + episode);
            if (!section) return;
            section.classList.toggle('collapsed');
        }

        function restoreSelectionUI() {
            for (let i = 1; i <= 9; i++) {
                const episode = 'episode' + i;
                const paths = selectedImages[episode] || [];
                const cards = document.querySelectorAll('#grid-' + episode + ' .image-card');
                cards.forEach(card => {
                    const p = card.dataset.path;
                    const shouldSelect = Array.isArray(paths) && paths.includes(p);
                    const checkbox = card.querySelector('input[type="checkbox"]');
                    card.classList.toggle('selected', shouldSelect);
                    checkbox.checked = shouldSelect;
                });
                updateSelectionCount(episode);
            }
            updateTotalCount();
            applyFilters();
        }
        
        // 切換圖片選擇狀態
        function toggleImage(card, evt) {
            const episode = card.dataset.episode;
            const imagePath = card.dataset.path;
            const index = Number(card.dataset.index || '-1');
            
            if (!selectedImages[episode]) {
                selectedImages[episode] = [];
            }
            
            const checkbox = card.querySelector('input[type="checkbox"]');
            const isSelected = card.classList.contains('selected');
            
            const setSelected = (targetCard, value) => {
                const ep = targetCard.dataset.episode;
                const p = targetCard.dataset.path;
                const cb = targetCard.querySelector('input[type="checkbox"]');
                if (!selectedImages[ep]) selectedImages[ep] = [];
                const already = selectedImages[ep].includes(p);
                if (value && !already) selectedImages[ep].push(p);
                if (!value && already) selectedImages[ep] = selectedImages[ep].filter(x => x !== p);
                targetCard.classList.toggle('selected', value);
                cb.checked = value;
            };

            // Shift 連選：以本次點擊的「目標狀態」為準，對區間全部套用
            if (evt?.shiftKey && Number.isFinite(index) && lastClickedIndexByEpisode[episode] != null) {
                const start = Math.min(lastClickedIndexByEpisode[episode], index);
                const end = Math.max(lastClickedIndexByEpisode[episode], index);
                const targetValue = !isSelected;
                const cards = document.querySelectorAll('#grid-' + episode + ' .image-card');
                for (let i = start; i <= end; i++) {
                    const c = cards[i];
                    if (c) setSelected(c, targetValue);
                }
            } else {
                setSelected(card, !isSelected);
            }
            
            if (Number.isFinite(index) && index >= 0) {
                lastClickedIndexByEpisode[episode] = index;
            }
            
            updateSelectionCount(episode);
            updateTotalCount();
            saveConfiguration();
            applyFilters();
        }
        
        // 更新選擇計數
        function updateSelectionCount(episode) {
            const count = selectedImages[episode] ? selectedImages[episode].length : 0;
            document.getElementById('count-num-' + episode).textContent = count;
        }
        
        // 更新總計數
        function updateTotalCount() {
            const total = Object.values(selectedImages)
                .reduce((sum, arr) => sum + arr.length, 0);
            document.getElementById('totalCount').textContent = total;
        }
        
        // 全選某集圖片
        function selectAll(episode) {
            const cards = document.querySelectorAll('#grid-' + episode + ' .image-card');
            cards.forEach(card => {
                if (!card.classList.contains('selected')) {
                    toggleImage(card);
                }
            });
        }
        
        // 清除某集選擇
        function clearSelection(episode) {
            const cards = document.querySelectorAll('#grid-' + episode + ' .image-card');
            cards.forEach(card => {
                if (card.classList.contains('selected')) {
                    toggleImage(card);
                }
            });
        }
        
        // 清除全部選擇
        function clearAllSelections() {
            if (confirm('確定要清除所有集數的圖片選擇嗎？此操作無法復原。')) {
                for (let i = 1; i <= 9; i++) {
                    const episode = 'episode' + i;
                    clearSelection(episode);
                }
                showStatus('已清除所有圖片選擇！', 'success');
            }
        }
        
        // 匯出配置
        function exportConfiguration() {
            try {
                const exportSelectedImages = {};
                Object.entries(selectedImages).forEach(([episode, paths]) => {
                    exportSelectedImages[episode] = (paths || []).map(normalizeForReader);
                });

                const config = {
                    selectedImages: exportSelectedImages,
                    exportedAt: new Date().toISOString(),
                    totalSelected: Object.values(exportSelectedImages)
                        .reduce((total, arr) => total + arr.length, 0)
                };
                
                // 創建並下載配置文件
                const dataStr = "data:text/json;charset=utf-8," + 
                    encodeURIComponent(JSON.stringify(config, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "config.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
                
                showStatus('已匯出 config.json：請放到 reader/config.json（覆蓋原本的）', 'success');
            } catch (error) {
                console.error('匯出配置時發生錯誤:', error);
                showStatus('匯出配置時發生錯誤：' + error.message, 'error');
            }
        }
        
        // 顯示狀態消息
        function showStatus(message, type) {
            const statusEl = document.getElementById('statusMessage');
            statusEl.textContent = message;
            statusEl.className = 'status-message status-' + type;
            statusEl.style.display = 'block';
            
            setTimeout(() => {
                statusEl.style.display = 'none';
            }, 5000);
        }
        
        // 初始化
        document.addEventListener('DOMContentLoaded', function() {
            loadConfiguration();
            restoreSelectionUI();

            const input = document.getElementById('searchInput');
            const selOnly = document.getElementById('selectedOnly');

            input.addEventListener('input', () => {
                searchQuery = input.value || '';
                applyFilters();
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    input.value = '';
                    searchQuery = '';
                    applyFilters();
                }
            });
            selOnly.addEventListener('change', () => {
                selectedOnly = !!selOnly.checked;
                applyFilters();
            });
        });
    </script>
</body>
</html>
`;
  
  return html;
}

// 獲取集數標題
function getEpisodeTitle(episodeNum) {
  const titles = {
    1: '說走就走？先問媽媽！',
    2: '媽祖婆，我們來了！',
    3: '守護家人的智慧生活',
    4: '兒童節的特別約定',
    5: '媽媽的生日驚喜',
    6: '哥哥的大學畢業',
    7: '弟弟的校運會',
    8: '家庭電影夜',
    9: '年度回顧與新年願景'
  };
  return titles[episodeNum] || `第 ${episodeNum} 集`;
}

// 主函數
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('使用方法：');
    console.log('  node image-selector-generator.js          - 生成 HTML 選擇工具');
    console.log('  node image-selector-generator.js --list   - 列出所有圖片');
    console.log('  node image-selector-generator.js --help   - 顯示幫助');
    return;
  }
  
  if (args.includes('--list')) {
    const allImages = getAllImages();
    console.log('\n=== 家庭故事集圖片列表 ===\n');
    
    Object.entries(allImages).forEach(([episode, images]) => {
      console.log(`${episode}: ${images.length} 張圖片`);
      images.slice(0, 5).forEach(img => {
        console.log(`  - ${img.name}`);
      });
      if (images.length > 5) {
        console.log(`  ... 還有 ${images.length - 5} 張`);
      }
      console.log('');
    });
    return;
  }
  
  // 預設生成 HTML
  const html = generateHTML();
  const outputPath = path.join(__dirname, '../dev/image-selector.html');
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`✅ 圖片選擇工具已生成：${outputPath}`);
  console.log(`📂 請在瀏覽器中打開此檔案來選擇圖片`);
}

main();