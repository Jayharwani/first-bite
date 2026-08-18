import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this project from /first-bite/. Vercel and local dev
// serve from root, so the base is switched by an env flag set in CI.
const base = process.env.DEPLOY_TARGET === 'gh-pages' ? '/first-bite/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
