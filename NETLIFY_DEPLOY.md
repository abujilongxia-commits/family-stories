# 🚀 Netlify 部署指南

## 步驟 1：登入 Netlify
1. 前往 https://app.netlify.com
2. 使用 GitHub 帳號登入

## 步驟 2：新增網站
1. 點擊 **"Add new site"** → **"Import an existing project"**
2. 選擇 **GitHub**
3. 授權 Netlify 訪問你的 GitHub 帳號

## 步驟 3：選擇倉庫
1. 搜尋並選擇 **`abujilongxia-commits/family-stories`**
2. 點擊 **"Deploy site"**

## 步驟 4：配置構建設置
Netlify 會自動檢測 `netlify.toml`，配置如下：
- **Build command:** `echo 'No build required - static site'`
- **Publish directory:** `.` (倉庫根目錄)

## 步驟 5：等待部署
- 首次部署約需 1-2 分鐘
- 部署完成後會獲得網址：`https://xxxx-xxxx-xxxx.netlify.app`

## 步驟 6：自訂網域名稱（可選）
1. 進入 **Site settings** → **Domain management**
2. 點擊 **"Add custom domain"**
3. 輸入想要的網域名稱

## 步驟 7：自動同步
- Netlify 會自動監聽 GitHub 的 `main` branch
- 每次 push 都會自動重新部署
- 可在 **Deploys** 頁面查看部署歷史

---

## 📱 測試網址

部署完成後，蝦蝦助手可以訪問：
- **首頁：** `https://xxxx-xxxx-xxxx.netlify.app/reader/`
- **第 1 集：** `https://xxxx-xxxx-xxxx.netlify.app/reader/story.html?episode=1`
- **第 6 集：** `https://xxxx-xxxx-xxxx.netlify.app/reader/story.html?episode=6`

---

## 🔧 環境變數（如需）

如果需要設定環境變數：
1. 進入 **Site settings** → **Environment variables**
2. 點擊 **"Add a variable"**
3. 輸入變數名稱和值

---

## 📊 監控

- **部署狀態：** https://app.netlify.com/sites/[site-name]/deploys
- **網站分析：** https://app.netlify.com/sites/[site-name]/analytics
- **日誌查看：** 點擊任意部署 → 查看構建日誌

---

**完成後請將 Netlify 網址分享給蝦蝦助手！** 🦐
