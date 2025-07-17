import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cart: resolve(__dirname, 'cart.html'),
        myorders: resolve(__dirname, 'myorders.html'),
        order: resolve(__dirname, 'order.html'),
        verify: resolve(__dirname, 'verify.html'),
      },
    },
  },
})
