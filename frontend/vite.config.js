import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ▼▼▼ [추가] 외부 접속 허용 설정 ▼▼▼
  server: {
    host: true, // "0.0.0.0"
  }
})