#!/usr/bin/env python3

def fix_episode(episode_num, scene_to_img):
    path = f'/Users/mac/.openclaw/workspace/github-family-website/reader/episode{episode_num}/story.html'
    
    with open(path, 'rb') as f:
        content = f.read()
    
    replaced = 0
    for scene_text, img_file in scene_to_img.items():
        old_pattern = b'<div class="placeholder">\xf0\x9f\x93\xb7 ' + scene_text.encode('utf-8') + b'</div>'
        new_html = b'<img src="images/' + img_file.encode('utf-8') + b'" alt="scene">'
        if old_pattern in content:
            content = content.replace(old_pattern, new_html)
            replaced += 1
            print(f"Ep{episode_num}: {scene_text[:30]}... -> {img_file}")
        else:
            print(f"Ep{episode_num}: NOT FOUND - {scene_text[:30]}...")
    
    with open(path, 'wb') as f:
        f.write(content)
    
    print(f"Ep{episode_num}: Total replaced: {replaced}/{len(scene_to_img)}\n")

# Episode 4 mapping
ep4_map = {
    "場景 1: 出發前的準備": "03_出發前的準備.jpg",
    "場景 2: 上車出發": "05_上車出發.jpg",
    "場景 3: 高速公路上": "06_高速公路上.jpg",
    "場景 4: 抵達露營區": "09_抵達露營區.jpg",
    "場景 5: 搭帳篷": "10_搭帳篷.jpg",
    "場景 6: 清晨的杉林": "13_清晨的杉林.jpg",
    "場景 7: 早餐時光": "14_早餐時光.jpg",
    "場景 8: 探索營區": "15_探索營區.jpg",
    "場景 9: 吊橋合影": "16_吊橋合影.jpg",
    "場景 10: 溯溪玩水": "20_戲水區.jpg",
    "場景 11: 烤肉時間": "22_烤肉時間.jpg",
    "場景 12: 夜晚的星空": "24_夜晚的星空.jpg",
    "場景 13: 最後的早晨": "26_最後的早晨.jpg",
    "場景 14: 收拾行李": "27_收拾行李.jpg",
    "場景 15: 離開營區": "29_離開營區.jpg",
    "場景 16: 結語": "33_結語.jpg",
}

# Episode 7 mapping
ep7_map = {
    "場景 1: 弟弟的提議": "01_弟弟的提議.jpg",
    "場景 2: 爸爸的反應": "02_爸爸的反應.jpg",
    "場景 3: 弟弟的期待": "03_弟弟的期待.jpg",
    "場景 4: 哥哥的疑問": "04_哥哥的疑問.jpg",
    "場景 5: 爸爸的解釋": "05_爸爸的解釋.jpg",
    "場景 6: 弟弟的緊張": "06_弟弟的緊張.jpg",
    "場景 7: 爸爸的鼓勵": "07_爸爸的鼓勵.jpg",
    "場景 8: 哥哥的建議": "08_哥哥的建議.jpg",
    "場景 9: 弟弟的決心": "09_弟弟的決心.jpg",
    "場景 10: 爸爸的準備": "10_爸爸的準備.jpg",
    "場景 11: 弟弟的練習": "11_弟弟的練習.jpg",
    "場景 12: 第一次嘗試": "12_第一次嘗試.jpg",
    "場景 13: 弟弟的挫折": "13_弟弟的挫折.jpg",
    "場景 14: 爸爸的鼓勵": "14_爸爸的鼓勵.jpg",
    "場景 15: 哥哥的示範": "15_哥哥的示範.jpg",
    "場景 16: 弟弟的學習": "16_弟弟的學習.jpg",
    "場景 17: 再次嘗試": "17_再次嘗試.jpg",
    "場景 18: 成功上車": "18_成功上車.jpg",
    "場景 19: 哥哥的讚美": "19_哥哥的讚美.jpg",
    "場景 20: 弟弟的興奮": "20_弟弟的興奮.jpg",
    "場景 21: 繼續練習": "21_繼續練習.jpg",
    "場景 22: 爸爸的肯定": "22_爸爸的肯定.jpg",
    "場景 23: 哥哥的鼓勵": "23_哥哥的鼓勵.jpg",
    "場景 24: 弟弟的成長": "24_弟弟的成長.jpg",
    "場景 25: 媽媽的驕傲": "25_媽媽的驕傲.jpg",
    "場景 26: 全家合影": "26_全家合影.jpg",
    "場景 27: 結語": "27_結語.jpg",
}

# Episode 8 mapping
ep8_map = {
    "場景 1: 弟弟的提議": "01_弟弟的提議.jpg",
    "場景 2: 爸爸的反應": "02_爸爸的反應.jpg",
    "場景 3: 哥哥的疑問": "03_哥哥的疑問.jpg",
    "場景 4: 弟弟的解釋": "04_弟弟的解釋.jpg",
    "場景 5: 爸爸的考慮": "05_爸爸的考慮.jpg",
    "場景 6: 哥哥的建議": "06_哥哥的建議.jpg",
    "場景 7: 弟弟的期待": "07_弟弟的期待.jpg",
    "場景 8: 第一次嘗試": "08_第一次嘗試.jpg",
    "場景 9: 弟弟的挫折": "09_弟弟的挫折.jpg",
    "場景 10: 爸爸的鼓勵": "10_爸爸的鼓勵.jpg",
    "場景 11: 哥哥的示範": "11_哥哥的示範.jpg",
    "場景 12: 弟弟的學習": "12_弟弟的學習.jpg",
    "場景 13: 再次嘗試": "13_再次嘗試.jpg",
    "場景 14: 弟弟的興奮": "14_弟弟的興奮.jpg",
    "場景 15: 爸爸的肯定": "15_爸爸的肯定.jpg",
    "場景 16: 哥哥的讚美": "16_哥哥的讚美.jpg",
    "場景 17: 媽媽的反應": "17_媽媽的反應.jpg",
    "場景 18: 弟弟的成長": "18_弟弟的成長.jpg",
    "場景 19: 全家開心": "19_全家開心.jpg",
    "場景 20: 媽媽的驕傲": "20_媽媽的驕傲.jpg",
    "場景 21: 結語": "21_結語.jpg",
}

# Episode 9 mapping
ep9_map = {
    "場景 1: 弟弟的提議": "01_弟弟的提議.jpg",
    "場景 2: 爸爸的反應": "02_爸爸的反應.jpg",
    "場景 3: 哥哥的疑問": "03_哥哥的疑問.jpg",
    "場景 4: 弟弟的解釋": "04_弟弟的解釋.jpg",
    "場景 5: 爸爸的考慮": "05_爸爸的考慮.jpg",
    "場景 6: 哥哥的建議": "06_哥哥的建議.jpg",
    "場景 7: 弟弟的期待": "07_弟弟的期待.jpg",
    "場景 8: 第一次嘗試": "08_第一次嘗試.jpg",
    "場景 9: 弟弟的挫折": "09_弟弟的挫折.jpg",
    "場景 10: 爸爸的鼓勵": "10_爸爸的鼓勵.jpg",
    "場景 11: 哥哥的示範": "11_哥哥的示範.jpg",
    "場景 12: 弟弟的學習": "12_弟弟的學習.jpg",
    "場景 13: 再次嘗試": "13_再次嘗試.jpg",
    "場景 14: 弟弟的興奮": "14_弟弟的興奮.jpg",
    "場景 15: 爸爸的肯定": "15_爸爸的肯定.jpg",
    "場景 16: 哥哥的讚美": "16_哥哥的讚美.jpg",
    "場景 17: 媽媽的反應": "17_媽媽的反應.jpg",
    "場景 18: 弟弟的成長": "18_弟弟的成長.jpg",
    "場景 19: 全家開心": "19_全家開心.jpg",
    "場景 20: 媽媽的驕傲": "20_媽媽的驕傲.jpg",
    "場景 21: 結語": "21_結語.jpg",
}

print("=== Fixing Episode 4 ===")
fix_episode(4, ep4_map)

print("=== Fixing Episode 7 ===")
fix_episode(7, ep7_map)

print("=== Fixing Episode 8 ===")
fix_episode(8, ep8_map)

print("=== Fixing Episode 9 ===")
fix_episode(9, ep9_map)

print("=== All Done ===")
