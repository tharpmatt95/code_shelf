import { createRouter, createWebHistory } from 'vue-router'

// Pages / Components
import AWSQuiz from './components/AWSQuiz.vue'
import PythonQuiz from './components/PythonQuiz.vue'
import MovieQuiz from './components/MovieQuiz.vue'
import SportsQuiz from './components/SportsQuiz.vue'
import EngineeringQuiz from './components/EngineeringQuiz.vue'
import AuthBox from './components/AuthBox.vue'
import UserPage from './components/UserPage.vue'
import AboutPage from './components/AboutPage.vue'

const routes = [
  {
    path: '/sports',
    name: 'Sports',
    component: SportsQuiz
  },
  {
    path: '/movies',
    name: 'Movies',
    component: MovieQuiz
  },
  {
    path: '/aws',
    name: 'AWS',
    component: AWSQuiz
  },
  {
    path: '/python',
    name: 'Python',
    component: PythonQuiz
  },
  {
    path: '/engineering',
    name: 'Engineering',
    component: EngineeringQuiz
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
