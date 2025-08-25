import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: false,
    open: false, // Disable auto-open in Docker containers
    hmr: {
      port: 3000,
    },
    watch: {
      usePolling: true,
    },
    fs: {
      // Allow serving files from the entire project
      allow: ['.']
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          ui: ['framer-motion', 'lucide-react', '@heroicons/react'],
          utils: ['clsx', 'tailwind-merge', 'date-fns', 'uuid']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@types': '/src/types',
      '@store': '/src/store',
      '@api': '/src/api',
      '@assets': '/src/assets'
    }
  },
  // Ensure proper MIME types and optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'lucide-react',
      'clsx',
      'tailwind-merge'
    ]
  },
  // Define proper asset handling
  assetsInclude: ['**/*.woff2', '**/*.woff', '**/*.ttf']
})
