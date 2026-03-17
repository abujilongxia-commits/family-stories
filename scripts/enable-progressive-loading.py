#!/usr/bin/env python3
"""
將現有 story.html 轉換為漸進式圖片載入版本
- 添加縮圖路徑（data-src 指向原圖）
- 添加載入進度指示器
- 添加 blur-up 效果
"""

import os
import re
import sys

def convert_to_progressive(episodes_dir, episode):
    """轉換指定集數的 story.html"""
    
    story_html = os.path.join(episodes_dir, episode, 'story.html')
    
    if not os.path.exists(story_html):
        print(f"❌ 找不到文件：{story_html}")
        return False
    
    # 檢查縮圖目錄是否存在
    thumb_dir = os.path.join(episodes_dir, episode, 'thumbnails')
    has_thumbnails = os.path.exists(thumb_dir) and os.listdir(thumb_dir)
    
    print(f"📄 處理：{story_html}")
    print(f"🖼️  縮圖：{'✅ 已找到' if has_thumbnails else '❌ 未找到'}")
    
    # 讀取原始文件
    with open(story_html, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找所有圖片標籤
    img_pattern = r'<img\s+src="([^"]+)"\s+alt="([^"]*)">'
    
    def replace_img(match):
        src = match.group(1)
        alt = match.group(2)
        
        # 如果有縮圖，使用縮圖作為初始載入
        if has_thumbnails:
            thumb_path = os.path.join('thumbnails', src)
            return f'<img src="{thumb_path}" data-src="{src}" alt="{alt}">'
        else:
            # 沒有縮圖，保持原樣（會直接載入原圖）
            return f'<img src="{src}" data-src="{src}" alt="{alt}">'
    
    # 替換所有圖片標籤
    new_content = re.sub(img_pattern, replace_img, content)
    
    # 檢查是否已包含進度條樣式
    if 'progress-bar' not in new_content:
        print("⚠️  警告：模板中缺少進度條樣式，請使用 story-progressive.html 模板")
    
    # 寫回文件
    with open(story_html, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ 完成：{story_html}")
    return True

def main():
    if len(sys.argv) < 2:
        print("用法：python3 enable-progressive-loading.py <episode>")
        print("例如：python3 enable-progressive-loading.py episode2")
        sys.exit(1)
    
    episode = sys.argv[1]
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    episodes_dir = os.path.join(base_dir, 'dev')
    
    convert_to_progressive(episodes_dir, episode)

if __name__ == '__main__':
    main()
