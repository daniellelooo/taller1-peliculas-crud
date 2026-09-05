import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import MoviesView from '../views/MoviesView.vue'
import MovieFormView from '../views/MovieFormView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MoviesView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true }
    },
    {
      path: '/registro',
      name: 'registro',
      component: RegisterView,
      meta: { guestOnly: true }
    },
    {
      path: '/peliculas/nueva',
      name: 'nueva-pelicula',
      component: MovieFormView,
      meta: { requiresAuth: true }
    },
    {
      path: '/peliculas/:id/editar',
      name: 'editar-pelicula',
      component: MovieFormView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
