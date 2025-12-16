import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/adminApi': {
        target: 'http://localhost:3000', // 目标服务器地址
        changeOrigin: true, // 是否改变请求源
      }
    }
  }
})
