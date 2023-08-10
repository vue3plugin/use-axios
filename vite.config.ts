import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    build: {
        lib: {
            entry: "./src/index.ts",
            fileName: (format) => `index.${format}.js`,
            formats: ['es', "cjs"],
        },
        rollupOptions: {
            external: ['vue'],
        },
        cssCodeSplit: false,
        outDir: "dist",
        minify: "esbuild",
    },
    plugins: [
        vue(),
    ]
})