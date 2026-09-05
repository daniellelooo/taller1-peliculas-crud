<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'
import MovieCard from '../components/MovieCard.vue'

const authStore = useAuthStore()

const movies = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const page = ref(1)
const meta = ref({
  total: 0,
  page: 1,
  limit: 8,
  totalPages: 1
})

let debounceTimer = null

const fetchMovies = async () => {
  loading.value = true
  error.value = null
  try {
    const params = {
      page: page.value,
      limit: 8
    }
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    const { data } = await api.get('/movies', { params })
    movies.value = data.data
    meta.value = data.meta
  } catch (err) {
    error.value = 'Ocurrió un error al cargar las películas.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    fetchMovies()
  }, 300)
}

const nextPage = () => {
  if (page.value < meta.value.totalPages) {
    page.value++
    fetchMovies()
  }
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchMovies()
  }
}

const deleteMovie = async (id) => {
  try {
    await api.delete(`/movies/${id}`)
    fetchMovies()
  } catch (err) {
    alert('Error al eliminar la película.')
    console.error(err)
  }
}

onMounted(() => {
  fetchMovies()
})
</script>

<template>
  <div class="container">
    <div class="header-actions">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearch" 
          placeholder="🔍 Buscar película por nombre..."
          class="search-input"
        >
      </div>
      
      <RouterLink v-if="authStore.isAuthenticated" to="/peliculas/nueva" class="btn btn-primary">
        + Nueva Película
      </RouterLink>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="loading" class="loader">
      Cargando películas...
    </div>

    <template v-else>
      <div v-if="movies.length === 0" class="empty-state">
        No se encontraron películas.
      </div>
      
      <div v-else class="movies-grid">
        <MovieCard 
          v-for="movie in movies" 
          :key="movie.id" 
          :movie="movie" 
          :canEdit="authStore.isAuthenticated"
          @delete="deleteMovie"
        />
      </div>

      <div class="pagination" v-if="meta.totalPages > 1 || page > 1">
        <button 
          @click="prevPage" 
          :disabled="page === 1"
          class="btn btn-secondary"
        >
          Anterior
        </button>
        <span class="page-info">Página {{ page }} de {{ meta.totalPages }}</span>
        <button 
          @click="nextPage" 
          :disabled="page >= meta.totalPages"
          class="btn btn-secondary"
        >
          Siguiente
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-container {
  flex: 1;
  max-width: 500px;
}

.search-input {
  background-color: var(--surface-color);
  padding: 0.8rem 1.2rem;
  border-radius: 2rem;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--text-secondary);
  font-size: 1.2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.page-info {
  font-weight: 500;
  color: var(--text-secondary);
}

@media (max-width: 600px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .search-container {
    max-width: 100%;
  }
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}
</style>
