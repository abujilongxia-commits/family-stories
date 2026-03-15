#!/usr/bin/env python3
# 修正版：使用 GEMINI_IMAGE_API_KEY 和 GEMINI_IMAGE_BASE_URL

import argparse
import os
import sys
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description="Generate images using Gemini API")
    parser.add_argument("--prompt", "-p", required=True, help="Image prompt")
    parser.add_argument("--filename", "-f", required=True, help="Output filename")
    parser.add_argument("--resolution", "-r", choices=["1K", "2K", "4K"], default="1K")
    parser.add_argument("--api-key", "-k", help="API key")
    parser.add_argument("--base-url", "-u", help="Base URL")
    
    args = parser.parse_args()
    
    # Get API key from argument or environment
    api_key = args.api_key or os.environ.get("GEMINI_IMAGE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    base_url = args.base_url or os.environ.get("GEMINI_IMAGE_BASE_URL") or "https://newapi.pockgo.com/"
    
    if not api_key:
        print("Error: No API key provided")
        sys.exit(1)
    
    print(f"Using API key: {api_key[:10]}...")
    print(f"Using base URL: {base_url}")
    print(f"Prompt: {args.prompt}")
    print(f"Resolution: {args.resolution}")
    print(f"Output: {args.filename}")
    
    # Import after validation
    from google import genai
    from google.genai import types
    from PIL import Image as PILImage
    from io import BytesIO
    
    # Initialize client with base URL
    client = genai.Client(api_key=api_key, http_options={"base_url": base_url})
    
    output_path = Path(args.filename)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    print(f"Generating image...")
    
    try:
        response = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=args.prompt,
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"],
                image_config=types.ImageConfig(
                    image_size=args.resolution
                )
            )
        )
        
        # Process response - handle both inline_data and markdown URLs
        import re
        import requests
        
        image_url = None
        
        for part in response.parts:
            if part.text:
                print(f"Response text: {part.text}")
                # Extract image URL from markdown: ![image_0](https://...)
                match = re.search(r'\!\[.*?\]\((https?://[^\)]+)\)', part.text)
                if match:
                    image_url = match.group(1)
                    print(f"Found image URL: {image_url}")
            elif part.inline_data:
                image_data = part.inline_data.data
                if isinstance(image_data, str):
                    import base64
                    image_data = base64.b64decode(image_data)
                
                image = PILImage.open(BytesIO(image_data))
                if image.mode == 'RGBA':
                    rgb_image = PILImage.new('RGB', image.size, (255, 255, 255))
                    rgb_image.paste(image, mask=image.split()[3])
                    rgb_image.save(str(output_path), 'PNG')
                else:
                    image.convert('RGB').save(str(output_path), 'PNG')
                print(f"✅ Image saved: {output_path.resolve()}")
                return
        
        # If we have a URL, download and save
        if image_url:
            print(f"Downloading image from URL...")
            img_response = requests.get(image_url)
            if img_response.status_code == 200:
                image = PILImage.open(BytesIO(img_response.content))
                if image.mode == 'RGBA':
                    rgb_image = PILImage.new('RGB', image.size, (255, 255, 255))
                    rgb_image.paste(image, mask=image.split()[3])
                    rgb_image.save(str(output_path), 'PNG')
                else:
                    image.convert('RGB').save(str(output_path), 'PNG')
                print(f"✅ Image saved: {output_path.resolve()}")
                return
        
        print("Error: No image in response")
        sys.exit(1)
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
