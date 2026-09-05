<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const credentials = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMsg = ref(null)

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = null
  
  try {
    await authStore.login(credentials.value)
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (err) {
    if (err.response?.data?.message) {
      const msg = err.response.data.message
      errorMsg.value = Array.isArray(msg) ? msg[0] : msg
    } else {
      errorMsg.value = 'Error al iniciar sesión. Intenta nuevamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Iniciar Sesión</h2>
      
      <div v-if="errorMsg" class="error-message">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label" for="email">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            v-model="credentials.email" 
            required 
            placeholder="correo@ejemplo.com"
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="credentials.password" 
            required 
            minlength="6"
            placeholder="Mínimo 6 caracteres"
          >
        </div>

        <button type="submit" class="btn btn-primary auth-btn" :disabled="loading">
          {{ loading ? 'Iniciando...' : 'Entrar' }}
        </button>
      </form>
      
      <p class="auth-footer">
        ¿No tienes cuenta? <RouterLink to="/registro" class="auth-link">Regístrate</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 8rem);
}

.auth-card {
  background-color: var(--surface-color);
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;
}

.auth-title {
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.auth-btn {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  margin-top: 1rem;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.auth-link {
  color: var(--accent-color);
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
