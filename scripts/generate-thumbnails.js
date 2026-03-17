#!/usr/bin/env node
/**
 * 批量生成低畫質縮圖（LQIP - Low Quality Image Placeholder）
 * 用於漸進式圖片載入，改善首次載入體驗
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const EPISODE = process.argv[2] || 'episode2';
const SOURCE_DIR = path.join(__dirname, '..', 'dev', EPISODE);
const THUMBNAIL_DIR = path.join(SOURCE_DIR, 'thumbnails');
const QUALITY = 60; // JPEG 品質 (0-100)
const WIDTH = 400; // 縮圖寬度

console.log(`🖼️  為 ${EPISODE} 生成低畫質縮圖...`);
console.log(`📁 來源目錄：${SOURCE_DIR}`);
console.log(`📁 縮圖目錄：${THUMBNAIL_DIR}`);
console.log(`⚙️  品質：${QUALITY}%, 寬度：${WIDTH}px\n`);

// 創建縮圖目錄
if (!fs.existsSync(THUMBNAIL_DIR)) {
  fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
  console.log(`✅ 創建目錄：${THUMBNAIL_DIR}\n`);
}

// 查找所有 JPG 文件
const files = fs.readdirSync(SOURCE_DIR)
  .filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'))
  .sort();

console.log(`📊 找到 ${files.length} 張圖片\n`);

let success = 0;
let failed = 0;

files.forEach((file, index) => {
  const sourcePath = path.join(SOURCE_DIR, file);
  const thumbPath = path.join(THUMBNAIL_DIR, file);
  
  // 如果縮圖已存在，跳過
  if (fs.existsSync(thumbPath)) {
    console.log(`⏭️  [${index + 1}/${files.length}] ${file} - 已存在`);
    success++;
    return;
  }
  
  try {
    // 使用 sips 生成縮圖（macOS 內建）
    const cmd = `sips -Z ${WIDTH} --setProperty formatOptions ${QUALITY} "${sourcePath}" --out "${thumbPath}" 2>/dev/null`;
    execSync(cmd, { stdio: 'pipe' });
    
    // 獲取文件大小
    const sourceSize = fs.statSync(sourcePath).size;
    const thumbSize = fs.statSync(thumbPath).size;
    const ratio = ((thumbSize / sourceSize) * 100).toFixed(1);
    
    console.log(`✅ [${index + 1}/${files.length}] ${file}`);
    console.log(`   原圖：${(sourceSize / 1024 / 1024).toFixed(2)}MB → 縮圖：${(thumbSize / 1024).toFixed(0)}KB (${ratio}%)`);
    success++;
  } catch (err) {
    console.log(`❌ [${index + 1}/${files.length}] ${file} - 失敗`);
    console.log(`   錯誤：${err.message}`);
    failed++;
  }
});

console.log(`\n${'='.repeat(50)}`);
console.log(`✅ 完成！成功：${success}, 失敗：${failed}`);
console.log(`📁 縮圖位置：${THUMBNAIL_DIR}`);
