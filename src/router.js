import { createRouter, createWebHistory } from 'vue-router'

// Pages / Components
import PythonQuiz from './components/PythonQuiz.vue'
import MovieQuiz from './components/MovieQuiz.vue'
import AuthBox from './components/AuthBox.vue'
import UserPage from './components/UserPage.vue'
import AboutPage from './components/AboutPage.vue'

const routes = [
  {
    path: '/movies',
    name: 'Movies',
    component: MovieQuiz
  },
  {
    path: '/python',
    name: 'Python',
    component: PythonQuiz
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
