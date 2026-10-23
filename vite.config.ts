import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative stier, så bygget fungerer både på et eget domene og på GitHub Pages (/<repo>/)
  base: './',
})
