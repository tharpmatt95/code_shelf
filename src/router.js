import { createRouter, createWebHistory } from 'vue-router'
import AuthBox from './components/AuthBox.vue'
import CodeQuiz from './components/CodeQuiz.vue'
import UserPage from './components/UserPage.vue'

const routes = [
  { path: '/', component: CodeQuiz },
  { path: '/login', component: AuthBox },
  { path: '/user', component: UserPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
