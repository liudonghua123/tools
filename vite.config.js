import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import wasmSharpPlugin from "@wasmsharp/vite-plugin"

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        wasmSharpPlugin(),
    ],
    base: '/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: '0.0.0.0',
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
    },
    optimizeDeps: {
        include: ['monaco-editor'],
        exclude: ['@wasmer/sdk'],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'monaco-editor': ['monaco-editor'],
                    'markdown': ['marked', 'mermaid', 'highlight.js']
                }
            }
        }
    }
})
