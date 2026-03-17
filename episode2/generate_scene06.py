#!/usr/bin/env python3
"""第二集第 6 張：路邊休息"""
import requests, os, re
from pathlib import Path

PROMPT = """大甲媽祖遶境路上短暫休息補充水分，大甲媽祖遶境真實場景，路邊信徒休息區、其他香客經過、紅色香旗、夜晚燈籠光線、隊伍持續前進中、熱鬧非凡，
俯視全景鏡頭，一家四口圍坐路邊休息，爸爸（50 多歲短髮戴眼鏡）拿水瓶喝水，媽媽凱莉（50 多歲短髮戴眼鏡藍色針織衫）拿香旗擦汗，哥哥阿布吉（20 歲黑色短髮戴眼鏡白色 T 恤灰色衛衣）喝水，弟弟棉花糖（15 歲金屬圓框眼鏡黑色短髮帶刺刺頭頂黃色 T 恤牛仔短褲）喝飲料靠哥哥肩上，弟弟靠在哥哥肩上，媽媽遞水給爸爸，全家相視而笑，雖然疲憊但滿足，溫馨放鬆、家庭溫暖、短暫的寧靜，
宮崎駿動畫風格，吉卜力工作室，溫暖手繪質感，柔和水彩色彩，夜晚光線，細節豐富背景，溫和色調，夢幻氛圍，2K 高品質"""

API_KEY = os.environ.get("GEMINI_IMAGE_API_KEY") or open(Path.home()/".openclaw"/".env").read().split("GEMINI_IMAGE_API_KEY=")[1].split()[0]
BASE_URL = "https://newapi.pockgo.com/v1/chat/completions"

print(f"🎨 生成第 6 張：路邊休息...")
response = requests.post(BASE_URL, headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}, json={"model": "grok-3-image", "messages": [{"role": "user", "content": PROMPT}], "max_tokens": 1}, timeout=120)
response.raise_for_status()
result = response.json()
content = result["choices"][0]["message"]["content"]
url_match = re.search(r'\!\[image[^\]]*\]\((https?://[^\)]+)\)', content)
if url_match:
    image_url = url_match.group(1)
    print(f"✅ 生成成功！URL: {image_url}")
    output_path = Path("/Users/mac/.openclaw/workspace/github-family-website/episode2/06_路邊休息_溫馨放鬆.jpg")
    with open(output_path, "wb") as f:
        f.write(requests.get(image_url, timeout=60).content)
    print(f"✅ 已保存：{output_path} ({output_path.stat().st_size/1024/1024:.2f} MB)")
else:
    print(f"❌ 無法解析 URL: {content}")
