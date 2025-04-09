// Add or update the server section with a proxy
export default defineConfig({
  // ... other config
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5300',
        changeOrigin: true
      }
    }
  }
});