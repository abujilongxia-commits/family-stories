#!/usr/bin/env python3
"""
為 story.html 添加漸進式圖片載入的 CSS 和 JavaScript
"""

import os
import re

def add_progressive_styles(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 檢查是否已添加
    if 'progress-bar' in content:
        print("✅ 已包含漸進式載入樣式")
        return False
    
    # 在 </style> 前添加 CSS
    css_additions = '''
        /* 漸進式圖片載入 */
        .scene-image {
            position: relative;
            background: #f0f0f0;
        }
        
        .scene-image img {
            width: 100%;
            height: auto;
            display: block;
            transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out, transform 0.5s ease-in-out;
        }
        
        .scene-image img[data-src] {
            filter: blur(10px);
            transform: scale(1.05);
        }
        
        .scene-image img.loaded {
            filter: blur(0);
            transform: scale(1);
        }
        
        .scene-image .loading-placeholder {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            z-index: 1;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        .scene-image.loaded .loading-placeholder {
            display: none;
        }
        
        /* 載入進度指示器 */
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(0,0,0,0.1);
            z-index: 9999;
        }
        
        .progress-bar .progress {
            height: 100%;
            background: linear-gradient(90deg, #ff6b6b, #ffa500);
            width: 0%;
            transition: width 0.3s ease;
        }
        
        .progress-bar.hidden {
            display: none;
        }
        
        /* 載入狀態提示 */
        .loading-status {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 12px 20px;
            border-radius: 30px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            font-size: 0.9em;
            z-index: 9998;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .loading-status .spinner {
            width: 20px;
            height: 20px;
            border: 3px solid #f0f0f0;
            border-top-color: #ffa500;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .loading-status.hidden {
            display: none;
        }
        
        @media (max-width: 768px) {
            .loading-status { bottom: 10px; right: 10px; padding: 10px 15px; font-size: 0.8em; }
        }
'''
    
    # 找到 </style> 並插入 CSS
    content = re.sub(r'</style>', css_additions + '\n    </style>', content)
    
    # 在 </body> 前添加 HTML 和 JavaScript
    html_and_js = '''
    <!-- 載入進度條 -->
    <div class="progress-bar" id="progressBar">
        <div class="progress" id="progress"></div>
    </div>
    
    <!-- 載入狀態提示 -->
    <div class="loading-status" id="loadingStatus">
        <div class="spinner"></div>
        <span id="loadingText">載入中 0/0</span>
    </div>
    
    <script>
        // 漸進式圖片載入
        document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('img[data-src]');
            const total = images.length;
            let loaded = 0;
            
            const progressBar = document.getElementById('progressBar');
            const progress = document.getElementById('progress');
            const loadingStatus = document.getElementById('loadingStatus');
            const loadingText = document.getElementById('loadingText');
            
            function updateProgress() {
                loaded++;
                const percent = (loaded / total) * 100;
                progress.style.width = percent + '%';
                loadingText.textContent = '載入中 ' + loaded + '/' + total;
                
                if (loaded === total) {
                    setTimeout(() => {
                        progressBar.classList.add('hidden');
                        loadingStatus.classList.add('hidden');
                    }, 500);
                }
            }
            
            // 使用 Intersection Observer 實現懶載入
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const highResSrc = img.getAttribute('data-src');
                        
                        const tempImg = new Image();
                        tempImg.onload = function() {
                            img.src = highResSrc;
                            img.classList.add('loaded');
                            img.parentElement.classList.add('loaded');
                            updateProgress();
                            observer.unobserve(img);
                        };
                        tempImg.onerror = function() {
                            img.classList.add('loaded');
                            img.parentElement.classList.add('loaded');
                            updateProgress();
                            observer.unobserve(img);
                        };
                        tempImg.src = highResSrc;
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.01
            });
            
            images.forEach(img => imageObserver.observe(img));
            
            if (total === 0) {
                progressBar.classList.add('hidden');
                loadingStatus.classList.add('hidden');
            }
        });
    </script>
'''
    
    content = re.sub(r'</body>', html_and_js + '\n</body>', content)
    
    # 寫回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ 已添加漸進式載入功能：{file_path}")
    return True

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print("用法：python3 add-progressive-styles.py <file.html>")
        sys.exit(1)
    
    add_progressive_styles(sys.argv[1])
