<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = ref({
  nombre: '',
  email: '',
  password: ''
})

const loading = ref(false)
const errorMsg = ref(null)

const handleRegister = async () => {
  loading.value = true
  errorMsg.value = null
  
  try {
    await authStore.register(form.value)
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (err) {
    if (err.response?.data?.message) {
      const msg = err.response.data.message
      errorMsg.value = Array.isArray(msg) ? msg[0] : msg
    } else {
      errorMsg.value = 'Error al registrar usuario. Intenta nuevamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Crear Cuenta</h2>
      
      <div v-if="errorMsg" class="error-message">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label" for="nombre">Nombre completo</label>
          <input 
            type="text" 
            id="nombre" 
            v-model="form.nombre" 
            required 
            maxlength="80"
            placeholder="Ej: Ana Pérez"
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="email">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required 
            placeholder="correo@ejemplo.com"
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            required 
            minlength="6"
            maxlength="72"
            placeholder="Mínimo 6 caracteres"
          >
        </div>

        <button type="submit" class="btn btn-primary auth-btn" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>
      
      <p class="auth-footer">
        ¿Ya tienes cuenta? <RouterLink to="/login" class="auth-link">Inicia sesión</RouterLink>
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
