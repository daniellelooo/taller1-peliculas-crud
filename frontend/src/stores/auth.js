import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('access_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  function setSession(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('access_token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function clearSession() {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  async function login(credentials) {
    const { data } = await api.post('/auth/login', credentials)
    setSession(data.access_token, data.user)
  }

  async function register(userData) {
    const { data } = await api.post('/auth/register', userData)
    setSession(data.access_token, data.user)
  }

  function logout() {
    clearSession()
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const { data } = await api.get('/auth/me')
      // Update user just in case
      user.value = data
      localStorage.setItem('user', JSON.stringify(data))
    } catch (error) {
      // Interceptor will handle the 401 and redirect, but we clear state here too
      clearSession()
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    fetchMe
  }
})
