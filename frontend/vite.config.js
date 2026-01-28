import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:4000",
        changeOrigin: true,
        secure: false, // Permitir certificados autofirmados
      },
    },
    historyApiFallback: true, // Redirigir todas las rutas al index.html
    open: "/auth", // Abrir directamente en /auth
  },
});
