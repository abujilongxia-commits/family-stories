#!/usr/bin/env python3
"""
第二集第 3 張：起駕時刻（22:05）- 使用詳細 prompt 生成
確保角色人物一致性
"""

import requests
import os
from pathlib import Path

# 詳細 prompt
PROMPT = """大甲媽起駕的莊嚴時刻神轎開始移動，大甲媽祖遶境真實場景，人山人海信徒隊伍、紅色香旗旗海飄飄、金色媽祖神轎被 8-16 人抬著前進、鞭炮煙霧繚繞、鎮瀾宮建築背景、數十萬人一起行走中的擁擠動態感、信徒跟隨隊伍前進、鑼鼓喧天、陣頭表演舞龍舞獅八家將官將首、紅色燈籠懸掛、夜晚燈火通明、熱鬧非凡，
一家四口（爸爸 50 多歲短髮戴眼鏡拿相機跪拜、媽媽凱莉 50 多歲短髮戴眼鏡藍色針織衫拿香旗跪拜、哥哥阿布吉 20 歲黑色短髮戴眼鏡白色 T 恤灰色衛衣跪拜、弟弟棉花糖 15 歲金屬圓框眼鏡黑色短髮帶刺刺頭頂黃色 T 恤牛仔短褲跪拜）全家跪拜祈福，媽媽眼眶泛淚，弟弟學著媽媽的動作，哥哥扶著弟弟，爸爸記錄這神聖時刻，神聖莊嚴、歷史傳承感、信仰的力量、震撼感人，
宮崎駿動畫風格，吉卜力工作室，溫暖手繪質感，柔和水彩色彩，夜晚光線，細節豐富背景，溫和色調，夢幻氛圍，2K 高品質"""

# API 配置
API_KEY = os.environ.get("GEMINI_IMAGE_API_KEY")
if not API_KEY:
    env_path = Path.home() / ".openclaw" / ".env"
    if env_path.exists():
        with open(env_path, "r") as f:
            for line in f:
                if line.startswith("GEMINI_IMAGE_API_KEY="):
                    API_KEY = line.split("=", 1)[1].strip()
                    break

BASE_URL = "https://newapi.pockgo.com/v1/chat/completions"
MODEL = "grok-3-image"

# 發送請求
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

payload = {
    "model": MODEL,
    "messages": [
        {
            "role": "user",
            "content": PROMPT
        }
    ],
    "max_tokens": 1,
}

print("🎨 正在生成圖片（使用詳細 prompt）...")
print(f"📝 Prompt 長度：{len(PROMPT)} 字元")

response = requests.post(BASE_URL, headers=headers, json=payload, timeout=120)
response.raise_for_status()

result = response.json()

# 解析返回結果
if "choices" in result and len(result["choices"]) > 0:
    content = result["choices"][0]["message"]["content"]
    
    # 提取圖片 URL
    import re
    url_match = re.search(r'\!\[image[^\]]*\]\((https?://[^\)]+)\)', content)
    
    if url_match:
        image_url = url_match.group(1)
        print(f"✅ 圖片生成成功！")
        print(f"🔗 URL: {image_url}")
        
        # 下載圖片
        print("📥 正在下載圖片...")
        output_path = Path("/Users/mac/.openclaw/workspace/github-family-website/episode2/03_起駕時刻_神聖莊嚴.jpg")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        img_response = requests.get(image_url, timeout=60)
        img_response.raise_for_status()
        
        with open(output_path, "wb") as f:
            f.write(img_response.content)
        
        file_size = output_path.stat().st_size
        print(f"✅ 圖片已保存：{output_path}")
        print(f"📊 文件大小：{file_size / 1024 / 1024:.2f} MB")
    else:
        print(f"❌ 無法解析圖片 URL")
        print(f"返回內容：{content}")
else:
    print(f"❌ API 返回錯誤：{result}")
