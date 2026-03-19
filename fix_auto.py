#!/usr/bin/env python3
import re

def fix_episode_auto(episode_num, img_mapping):
    """Fix episode by extracting scene texts from file and mapping to images"""
    path = f'/Users/mac/.openclaw/workspace/github-family-website/reader/episode{episode_num}/story.html'
    
    with open(path, 'rb') as f:
        content = f.read()
    
    # Extract all scene texts from file
    scenes = re.findall(b'<div class="placeholder">\xf0\x9f\x93\xb7 ([^<]+)</div>', content)
    print(f"Episode {episode_num}: Found {len(scenes)} scenes in file")
    
    replaced = 0
    for i, scene_bytes in enumerate(scenes, 1):
        scene_text = scene_bytes.decode('utf-8')
        # Find matching image from mapping
        img_file = img_mapping.get(i)
        if img_file:
            old_pattern = b'<div class="placeholder">\xf0\x9f\x93\xb7 ' + scene_bytes + b'</div>'
            new_html = b'<img src="images/' + img_file.encode('utf-8') + b'" alt="scene">'
            if old_pattern in content:
                content = content.replace(old_pattern, new_html)
                replaced += 1
                print(f"  {i}: {scene_text[:30]}... -> {img_file}")
            else:
                print(f"  {i}: NOT FOUND in content - {scene_text[:30]}...")
        else:
            print(f"  {i}: NO IMAGE MAPPING - {scene_text[:30]}...")
    
    with open(path, 'wb') as f:
        f.write(content)
    
    print(f"Episode {episode_num}: Total replaced: {replaced}/{len(scenes)}\n")

# Episode 4: scene number -> image file
ep4_imgs = {
    1: "03_出發前的準備.jpg",
    2: "05_上車出發.jpg",
    3: "06_高速公路上.jpg",
    4: "09_抵達露營區.jpg",
    5: "10_搭帳篷.jpg",
    6: "13_清晨的杉林.jpg",
    7: "14_早餐時光.jpg",
    8: "15_探索營區.jpg",
    9: "16_吊橋合影.jpg",
    10: "20_戲水區.jpg",
    11: "22_烤肉時間.jpg",
    12: "24_夜晚的星空.jpg",
    13: "26_最後的早晨.jpg",
    14: "27_收拾行李.jpg",
    15: "29_離開營區.jpg",
    16: "33_結語.jpg",
}

# Episode 7
ep7_imgs = {
    1: "01_弟弟的提議.jpg", 2: "02_爸爸的反應.jpg", 3: "03_弟弟的期待.jpg",
    4: "04_哥哥的疑問.jpg", 5: "05_爸爸的解釋.jpg", 6: "06_弟弟的緊張.jpg",
    7: "07_爸爸的鼓勵.jpg", 8: "08_哥哥的建議.jpg", 9: "09_弟弟的決心.jpg",
    10: "10_爸爸的準備.jpg", 11: "11_弟弟的練習.jpg", 12: "12_第一次嘗試.jpg",
    13: "13_弟弟的挫折.jpg", 14: "14_爸爸的鼓勵.jpg", 15: "15_哥哥的示範.jpg",
    16: "16_弟弟的學習.jpg", 17: "17_再次嘗試.jpg", 18: "18_成功上車.jpg",
    19: "19_哥哥的讚美.jpg", 20: "20_弟弟的興奮.jpg", 21: "21_繼續練習.jpg",
    22: "22_爸爸的肯定.jpg", 23: "23_哥哥的鼓勵.jpg", 24: "24_弟弟的成長.jpg",
    25: "25_媽媽的驕傲.jpg", 26: "26_全家合影.jpg", 27: "27_結語.jpg",
}

# Episode 8
ep8_imgs = {
    1: "01_弟弟的提議.jpg", 2: "02_爸爸的反應.jpg", 3: "03_哥哥的疑問.jpg",
    4: "04_弟弟的解釋.jpg", 5: "05_爸爸的考慮.jpg", 6: "06_哥哥的建議.jpg",
    7: "07_弟弟的期待.jpg", 8: "08_第一次嘗試.jpg", 9: "09_弟弟的挫折.jpg",
    10: "10_爸爸的鼓勵.jpg", 11: "11_哥哥的示範.jpg", 12: "12_弟弟的學習.jpg",
    13: "13_再次嘗試.jpg", 14: "14_弟弟的興奮.jpg", 15: "15_爸爸的肯定.jpg",
    16: "16_哥哥的讚美.jpg", 17: "17_媽媽的反應.jpg", 18: "18_弟弟的成長.jpg",
    19: "19_全家開心.jpg", 20: "20_媽媽的驕傲.jpg", 21: "21_結語.jpg",
}

# Episode 9
ep9_imgs = {
    1: "01_弟弟的提議.jpg", 2: "02_爸爸的反應.jpg", 3: "03_哥哥的疑問.jpg",
    4: "04_弟弟的解釋.jpg", 5: "05_爸爸的考慮.jpg", 6: "06_哥哥的建議.jpg",
    7: "07_弟弟的期待.jpg", 8: "08_第一次嘗試.jpg", 9: "09_弟弟的挫折.jpg",
    10: "10_爸爸的鼓勵.jpg", 11: "11_哥哥的示範.jpg", 12: "12_弟弟的學習.jpg",
    13: "13_再次嘗試.jpg", 14: "14_弟弟的興奮.jpg", 15: "15_爸爸的肯定.jpg",
    16: "16_哥哥的讚美.jpg", 17: "17_媽媽的反應.jpg", 18: "18_弟弟的成長.jpg",
    19: "19_全家開心.jpg", 20: "20_媽媽的驕傲.jpg", 21: "21_結語.jpg",
}

print("=== Fixing Episode 4 ===")
fix_episode_auto(4, ep4_imgs)

print("=== Fixing Episode 7 ===")
fix_episode_auto(7, ep7_imgs)

print("=== Fixing Episode 8 ===")
fix_episode_auto(8, ep8_imgs)

print("=== Fixing Episode 9 ===")
fix_episode_auto(9, ep9_imgs)

print("=== All Done ===")
