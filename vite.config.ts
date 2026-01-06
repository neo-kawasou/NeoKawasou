import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/NeoKawasou/',
  plugins: [react()],
  build: {
    outDir: 'docs',
  },
})
