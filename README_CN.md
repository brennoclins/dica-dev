# Dica Dev: 技術博客

![screen](/public/noproject/criandoGIFcomImagens_by_Brenno.gif)

歡迎來到 **Dica-Dev**！這是一個為軟體開發人員提供建議的技術博客。博客文章是從此項目的 GitHub 存儲庫中的問題生成的。

## 使用技術

- [Next.js](https://nextjs.org/): 用於服務器端渲染和靜態網站生成的 React 框架。
- [Biome.js](https://biomejs.dev/): 用於代碼 linting 和格式化的工具。
- [Tailwind CSS](https://tailwindcss.com/docs/guides/nextjs): 用於快速樣式設計的實用 CSS 框架。
- [CSS Modules](): 用於本地 CSS 範圍。
- [TypeScript](https://www.typescriptlang.org/): 為 JavaScript 添加靜態類型的超集。
- [Axios](https://axios-http.com/docs/intro#:~:text=What%20is%20Axios?%20Axios%20is%20a%20promise-based%20HTTP%20Client%20for): 用於向 GitHub API 發送請求的 HTTP 客戶端。
- [date-fns](https://date-fns.org/): 用於日期操作和格式化的庫。
- [API de Contexto do React](https://react.dev/reference/react/useContext): 用於全局狀態管理。
- [React Hook](https://react.dev/reference/react/hooks): 用於管理 React 中的狀態和副作用。

## 功能

- **博客文章**: GitHub 存儲庫中的問題用作博客文章。存儲庫中創建的每個問題都會成為博客中的新文章。
- **前端界面**: 使用 Next.js、Tailwind CSS 和 CSS Modules 構建，提供現代和響應式的用戶體驗。
- **GitHub API 請求**: 使用 Axios 獲取存儲庫中的所有問題並將其顯示為博客文章。

## 如何運行項目

1. 克隆存儲庫:
   ```bash
   git clone https://github.com/brennoclins/dica-dev.git
    ```

2. 安裝依賴項:
    ```bash
    cd dica-dev
    npm install
    ```

3. 配置環境變量: 在項目根目錄創建一個 .env.local 文件，並添加以下變量:
    ```bash
    NEXT_PUBLIC_GITHUB_USER=brennoclins
    NEXT_PUBLIC_GITHUB_REPO=dica-dev
    ```

4. 運行項目:
    ```bash
    npm run dev
    ```

5. 在瀏覽器中訪問項目:
    ```bash
    http://localhost:3000
    ```

## 貢獻
歡迎貢獻！隨時打開問題和拉取請求。

## 博客鏈接
- [訪問博客: Dica-Dev](https://dica-dev.vercel.app/)
