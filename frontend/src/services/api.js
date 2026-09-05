import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Usaremos un custom event o directamente la lógica de limpieza y redirección
      // Dado que Pinia se inicializa globalmente, podemos acceder a localStorage directamente
      // y recargar para que router/store limpien, o emitir un evento.
      // Más simple: borrar localStorage y window.location.href
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
