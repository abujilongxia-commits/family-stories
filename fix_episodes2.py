#!/usr/bin/env python3
import os
import re

def fix_episode_regex(episode_num, scene_to_img):
    base_path = f"/Users/mac/.openclaw/workspace/github-family-website/reader/episode{episode_num}"
    story_file = f"{base_path}/story.html"
    
    if not os.path.exists(story_file):
        print(f"Episode {episode_num}: story.html not found")
        return
    
    with open(story_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    replaced = 0
    for scene_key, img_file in scene_to_img.items():
        # Pattern to match the placeholder div with the scene text
        pattern = r'<div class="placeholder">📷 ' + re.escape(scene_key) + r'</div>'
        replacement = f'<img src="images/{img_file}" alt="{scene_key}">'
        
        matches = re.findall(pattern, content)
        if matches:
            content = re.sub(pattern, replacement, content)
            replaced += len(matches)
            print(f"Episode {episode_num}: Replaced '{scene_key}' -> '{img_file}' ({len(matches)}x)")
        else:
            print(f"Episode {episode_num}: NOT FOUND '{scene_key}'")
    
    with open(story_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Episode {episode_num}: Total replaced: {replaced}")

# Episode 3 - use exact text from HTML
ep3_map = {
    "場景 1: 客廳 - 爸爸看新聞": "客廳討論.jpg",
    "場景 2: 爸爸的擔心": "爸爸的擔心.jpg",
    "場景 3: 研究電力問題": "研究電力問題.jpg",
    "場景 4: 發現嚴重性": "爸爸解釋問題.jpg",
    "場景 5: 客廳討論": "客廳討論.jpg",
    "場景 6: 爸爸解釋問題": "爸爸解釋問題.jpg",
    "場景 7: 媽媽的反應": "媽媽的回應.jpg",
    "場景 8: 棉花糖的好奇": "棉花糖的好奇.jpg",
    "場景 9: 阿布吉的興趣": "阿布吉的興趣.jpg",
    "場景 10: 決定動工": "材料準備.jpg",
    "場景 11: 材料準備": "材料準備.jpg",
    "場景 12: 爸爸施工中": "爸爸施工中.jpg",
    "場景 13: 棉花糖幫忙": "棉花糖幫忙.jpg",
    "場景 14: 媽媽送水": "媽媽送水.jpg",
    "場景 15: 完成安裝": "完成安裝.jpg",
    "場景 16: APP 演示": "APP 演示.jpg",
    "場景 17: 棉花糖操作": "棉花糖操作.jpg",
    "場景 18: 阿布吉研究": "阿布吉研究.jpg",
    "場景 19: 媽媽的感想": "媽媽感想.jpg",
    "場景 20: 家庭會議": "家庭会議.jpg",
    "場景 21: 結語": "結尾.jpg",
}

print("=== Fixing Episode 3 ===")
fix_episode_regex(3, ep3_map)
