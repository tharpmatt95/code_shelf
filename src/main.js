import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.withCredentials = true

console.log('AXIOS CONFIG:', axios.defaults)

createApp(App).mount('#app')
