import { createRouter, createWebHistory } from 'vue-router'

// Pages / Components
import CodeQuiz from './components/CodeQuiz.vue'
import AuthBox from './components/AuthBox.vue'
import UserPage from './components/UserPage.vue'
import AboutPage from './components/AboutPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: CodeQuiz
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthBox
  },
  {
    path: '/user',
    name: 'User',
    component: UserPage
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
