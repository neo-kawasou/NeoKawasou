import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/NeoKawasou/',
  plugins: [react()],       // ← これで TSX と Fast Refresh に対応
  build: {
    outDir: 'docs',
  },
})
