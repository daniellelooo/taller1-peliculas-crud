<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <div class="container navbar-container">
      <RouterLink to="/" class="brand">
        🎬 Cine<span>App</span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink to="/" class="nav-item">Catálogo</RouterLink>
        
        <template v-if="!isAuthenticated">
          <RouterLink to="/login" class="nav-item">Iniciar sesión</RouterLink>
          <RouterLink to="/registro" class="btn btn-primary ml-2">Registrarse</RouterLink>
        </template>
        
        <template v-else>
          <span class="user-greeting">Hola, {{ user?.nombre }}</span>
          <button @click="handleLogout" class="btn btn-secondary ml-2">Cerrar sesión</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand span {
  color: var(--accent-color);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-item {
  color: var(--text-secondary);
  font-weight: 500;
  transition: color 0.2s;
}

.nav-item:hover, .nav-item.router-link-active {
  color: var(--text-primary);
}

.user-greeting {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

@media (max-width: 600px) {
  .user-greeting {
    display: none;
  }
  .nav-links {
    gap: 1rem;
  }
}
</style>
