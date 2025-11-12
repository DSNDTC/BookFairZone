import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // bind to IPv4 loopback to avoid permission/IPv6 binding issues on some Windows setups
    host: "127.0.0.1",
    port: 3030,
  },
  plugins: [react()],
})
