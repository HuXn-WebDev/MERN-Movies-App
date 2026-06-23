import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/': 'http://localhost:3000',
      '/uploads/': 'http://localhost:3000',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'cobertura'],
      reportsDirectory: './coverage',
      include: [
        'src/redux/api/*.js',
        'src/redux/features/**/*.js',
        'src/pages/Auth/Login.jsx',
        'src/pages/Auth/Register.jsx',
        'src/pages/Auth/PrivateRoute.jsx',
        'src/pages/Admin/AdminRoute.jsx',
        'src/pages/Movies/AllMovies.jsx',
      ],
      exclude: ['src/main.jsx', 'src/test/**'],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
      },
    },
  },
});
