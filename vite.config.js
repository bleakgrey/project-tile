import { defineConfig } from 'vite'
import { splitVendorChunkPlugin } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    root: './src',
    publicDir: '../public',
    server: {
        open: '/'
    },
    plugins: [
        splitVendorChunkPlugin(),
        tsconfigPaths(),
    ],
    assetsInclude: [
        '**/*.png',
        '**/*.fnt',
        '**/*.atlas',
    ],
    esbuild: {
        jsxInject: `import { jsx } from '@/engine/Helpers'`,
    },
    build: {
        assetsInlineLimit: 0,
        assetsDir: './assets',
        outDir: '../dist',
        emptyOutDir: true,
        // sourcemap: true,
        rollupOptions: {
            output: {
                assetFileNames: (asset) => {
                    console.log(asset)
                    return "assets/[name][extname]"
                },
                chunkFileNames: (chunk) => {
                    console.log(chunk)
                    return "assets/[name].js"
                },
            },
        },
    },
})