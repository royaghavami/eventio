import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Pages from 'vite-plugin-pages'
import path from 'path'


export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          '@tanstack/vue-query': [
            'useQuery',
            'useMutation',
            'useQueryClient',
            'VueQueryPlugin',
            'QueryClient',
          ],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),
    Components({
      dirs: ['src/ui/components'],
      extensions: ['vue'],
      deep: true,
      dts: 'src/components.d.ts',
    }),
    Pages({
      dirs: 'src/ui/pages',
      extensions: ['vue'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})