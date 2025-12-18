import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'

import ApiService from "./common/api.service"
import DateFilter from "./common/date.filter"
import ErrorFilter from "./common/error.filter"
import { useAuthStore } from '@/stores/auth'

// @ts-ignore
ApiService.init();

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Global filters are not supported in Vue 3 the same way.
// We should probably provide them or use them as utility functions.
// For backwards compatibility relative to templates, we can add them to globalProperties.
app.config.globalProperties.$filters = {
  date: DateFilter,
  error: ErrorFilter
}

// Check auth
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  Promise.all([authStore.checkAuth()]).then(() => next())
});

app.mount('#app')
