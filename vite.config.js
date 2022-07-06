import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// ant design https://www.antdv.com/docs/vue/introduce#Usage
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
});
