import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css' 
import routes from 'virtual:generated-pages'
import { setupVueQuery } from '@/infrastructure/query/vueQueryClient'
import { createRouter, createWebHistory } from 'vue-router'


const app = createApp(App)
const router = createRouter({ history: createWebHistory(), routes })

setupVueQuery(app)
app.use(router)
app.mount('#app')

