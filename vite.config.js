import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      // Quando o frontend faz uma requisição para URLs que começam com '/api'
      '/api': {
        // O Vite redireciona essa requisição para o seu backend na porta 8000
        target: 'http://localhost:8000',
        // 'changeOrigin: true' é importante para garantir que o host seja alterado
        changeOrigin: true,
        // (Opcional) Se o seu backend não espera o prefixo '/api', descomente a linha abaixo
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
})