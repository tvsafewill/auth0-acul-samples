import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        entryFileNames: "index.js", // Single JavaScript output file
        assetFileNames: "index.css", // Single CSS output file
        manualChunks: () => "index.js", // Force single chunk
      },
    },
    cssCodeSplit: false, // Disable CSS code-splitting to bundle CSS in one file
  }
});
