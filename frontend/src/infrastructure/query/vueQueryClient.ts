import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

export const queryClient = new QueryClient()

export function setupVueQuery(app: any) {
  app.use(VueQueryPlugin, { queryClient })
}
