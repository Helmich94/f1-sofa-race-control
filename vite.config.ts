import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api/f1-news": {
        target: "http://127.0.0.1:5001",
        changeOrigin: true,
        rewrite: () =>
          "/f1-sofa-race-control/europe-west1/f1News",
      },
    },
  },
});