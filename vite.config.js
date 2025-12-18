import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  // Bundle analyzer plugin for performance analysis
  const plugins = [
    react({
      // Enable Fast Refresh
      fastRefresh: true
    })
  ];
  
  if (mode === 'analyze') {
    const { analyzer } = require('vite-bundle-analyzer');
    plugins.push(analyzer());
  }

  return {
    base: '/',
    plugins,
    server: {
      port: 5173,
      open: true,
      historyApiFallback: true,
      // Optimize HMR
      hmr: {
        overlay: true
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Optimize source maps for production
      sourcemap: !isProduction,
      rollupOptions: {
        output: {
          // More granular code splitting
          manualChunks(id) {
            // Vendor chunks
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-vendor';
              }
              if (id.includes('firebase')) {
                return 'firebase-vendor';
              }
              if (id.includes('redux') || id.includes('@reduxjs')) {
                return 'redux-vendor';
              }
              if (id.includes('react-icons') || id.includes('react-toastify') || id.includes('@headlessui')) {
                return 'ui-vendor';
              }
              if (id.includes('jspdf') || id.includes('html2canvas')) {
                return 'pdf-vendor';
              }
              // Other vendors in a separate chunk
              return 'vendor';
            }
          },
          // Optimize asset file names
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            let extType = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
              extType = 'fonts';
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Minify with esbuild (faster and built-in)
      minify: 'esbuild',
      // Esbuild minify options
      esbuild: {
        drop: isProduction ? ['console', 'debugger'] : [],
        legalComments: 'none'
      },
      // Enable compression
      reportCompressedSize: true,
      // Optimize CSS
      cssMinify: true,
    },
    // Enable build caching
    cacheDir: 'node_modules/.vite',
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react', 
        'react-dom', 
        'react-router-dom', 
        'firebase/app', 
        'firebase/auth', 
        'firebase/firestore',
        'react-redux',
        '@reduxjs/toolkit'
      ],
      // Force optimization of these dependencies
      force: false
    },
    // Optimize assets
    assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg', '**/*.webp'],
  };
});