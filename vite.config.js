import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// `base` solo cambia a la ruta de GitHub Pages cuando el workflow de
// despliegue pasa GH_PAGES=true (ver .github/workflows/deploy-pages.yml).
// Un `npm run build`/`npm run preview` local, sin esa variable, siempre usa
// la raíz — no depende de si Vite considera que el comando es "build" o
// "serve" (`vite preview` sirve justamente el resultado de un build), así
// que atar esto a `command` rompería el flujo de pruebas local de siempre.
export default defineConfig({
  plugins: [react()],
  base: process.env.GH_PAGES ? '/changuito-frontend/' : '/',
})
