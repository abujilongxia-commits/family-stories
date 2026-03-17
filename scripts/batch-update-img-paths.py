#!/usr/bin/env python3
"""
批量更新 story.html 中的圖片路徑，添加縮圖引用
"""

import os
import re
import sys

def update_image_paths(file_path, thumb_dir):
    """更新 HTML 中的圖片路徑"""
    
    if not os.path.exists(file_path):
        print(f"❌ 找不到文件：{file_path}")
        return False
    
    # 檢查縮圖目錄
    if not os.path.exists(thumb_dir):
        print(f"⚠️  縮圖目錄不存在：{thumb_dir}")
        return False
    
    thumb_files = set(f for f in os.listdir(thumb_dir) if f.lower().endswith('.jpg') or f.lower().endswith('.jpeg'))
    
    if not thumb_files:
        print(f"⚠️  縮圖目錄為空：{thumb_dir}")
        return False
    
    print(f"📄 處理：{file_path}")
    print(f"🖼️  找到 {len(thumb_files)} 張縮圖")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找所有圖片標籤
    img_pattern = r'<img\s+src="([^"]+)"\s+alt="([^"]*)"'
    
    updated = 0
    skipped = 0
    
    def replace_img(match):
        nonlocal updated, skipped
        src = match.group(1)
        alt = match.group(2)
        
        # 已經是 data-src 格式，跳過
        if 'data-src=' in match.group(0):
            skipped += 1
            return match.group(0)
        
        # 檢查是否有對應縮圖
        filename = os.path.basename(src)
        if filename in thumb_files:
            thumb_path = os.path.join(thumb_dir, filename)
            # 計算相對路徑
            html_dir = os.path.dirname(file_path)
            rel_thumb_path = os.path.relpath(thumb_path, html_dir)
            
            updated += 1
            return f'<img src="{rel_thumb_path}" data-src="{src}" alt="{alt}"'
        else:
            # 沒有縮圖，保持原樣但添加 data-src
            skipped += 1
            return f'<img src="{src}" data-src="{src}" alt="{alt}"'
    
    new_content = re.sub(img_pattern, replace_img, content)
    
    # 寫回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ 完成：{file_path}")
    print(f"   更新：{updated} 張，跳過：{skipped} 張")
    return True

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # 定義要處理的集數和路徑
    episodes = [
        ('dev/episode1', 'dev/episode1/thumbnails'),
        ('dev/episode2', 'dev/episode2/thumbnails'),
        ('dev/episode3', 'dev/episode3/images/thumbnails'),
        ('episode1', 'episode1'),  # episode1 沒有縮圖目錄，會跳過
        ('episode2', 'episode2'),  # episode2 沒有縮圖目錄，會跳過
    ]
    
    for episode_dir, thumb_dir in episodes:
        story_html = os.path.join(base_dir, episode_dir, 'story.html')
        thumb_path = os.path.join(base_dir, thumb_dir)
        
        print(f"\n{'='*60}")
        update_image_paths(story_html, thumb_path)

if __name__ == '__main__':
    main()
