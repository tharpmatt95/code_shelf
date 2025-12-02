import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import router from './router'

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000';
axios.defaults.withCredentials = true

createApp(App)
  .use(ElementPlus)
  .use(router)
  .mount('#app')
