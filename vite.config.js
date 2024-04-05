import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import lagacy from '@vitejs/plugin-legacy';
import browserslist from 'browserslist';

export default defineConfig({
  plugins: [
    react(),
    lagacy({
      targets: browserslist.defaults
    })
  ],
  define: {
    __APP_VERSION__: JSON.stringify(`v${process.env.npm_package_version}`)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    mainFields: ['module', 'jsnext:main', 'jsnext'],
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
  },
  publicDir: 'public',
  server: {
    host: 'localhost',
    open: true,
    hmr: true,

    proxy: {
      // '/api': {
      //   target: '',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''),
      // }
    }
  },
  optimizeDeps: {
    exclude: []
  },
  build: {
    // target: 'modules',
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 4 * 1024,
    cssCodeSplit: true,
    copyPublicDir: true,
    sourcemap: false,
    minify: 'esbuild',
    write: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      plugins: [
        // viteStaticCopy({
        //   targets: [
        //     {
        //       src: 'node_modules/three/examples/js/libs/basis',
        //       dest: 'static/three/basis'
        //     }
        //   ]
        // })
      ]
    }
  },
  preview: {
    host: '0.0.0.0',
    open: true
  },
  css: {
    modules: {},
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(__dirname, 'src/styles/vars.less')}";`
      },
      scss: {}
    }
  },
  json: {
    namedExports: true,
    stringify: false
  },
  logLevel: 'info',
  clearScreen: false
});
