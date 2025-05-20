import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000' // ⬅️ 把 API 轉發給後端 Node.js 伺服器
    }
  }
})
