<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => !!route.params.id)
const loading = ref(false)
const fetching = ref(isEditing.value)
const errors = ref([])

const form = ref({
  nombre: '',
  imagen: '',
  director: '',
  anio: '',
  genero: '',
  sinopsis: ''
})

const isValidImageUrl = computed(() => {
  if (!form.value.imagen) return false
  return form.value.imagen.startsWith('http://') || form.value.imagen.startsWith('https://')
})

const fetchMovie = async () => {
  try {
    const { data } = await api.get(`/movies/${route.params.id}`)
    // Cargar solo los campos que existen
    Object.keys(form.value).forEach(key => {
      if (data[key] !== undefined) {
        form.value[key] = data[key]
      }
    })
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar la película o no existe.')
    router.push('/')
  } finally {
    fetching.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = []
  
  // Clean payload
  const payload = { ...form.value }
  if (payload.anio) payload.anio = Number(payload.anio)
  
  try {
    if (isEditing.value) {
      await api.patch(`/movies/${route.params.id}`, payload)
    } else {
      await api.post('/movies', payload)
    }
    router.push('/')
  } catch (err) {
    if (err.response?.data?.message) {
      const msg = err.response.data.message
      errors.value = Array.isArray(msg) ? msg : [msg]
    } else {
      errors.value = ['Ocurrió un error inesperado.']
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isEditing.value) {
    fetchMovie()
  }
})
</script>

<template>
  <div class="container form-container">
    <div class="header">
      <h2>{{ isEditing ? 'Editar Película' : 'Nueva Película' }}</h2>
      <RouterLink to="/" class="btn btn-secondary">Volver</RouterLink>
    </div>

    <div v-if="fetching" class="loader">
      Cargando datos...
    </div>

    <div v-else class="form-grid">
      <form @submit.prevent="handleSubmit" class="form-content">
        <div v-if="errors.length > 0" class="error-message">
          <p>Por favor, corrige los siguientes errores:</p>
          <ul>
            <li v-for="(err, i) in errors" :key="i">{{ err }}</li>
          </ul>
        </div>

        <div class="form-group">
          <label class="form-label" for="nombre">Nombre *</label>
          <input type="text" id="nombre" v-model="form.nombre" required maxlength="120" placeholder="Ej: Matrix">
        </div>

        <div class="form-group">
          <label class="form-label" for="imagen">URL de Imagen *</label>
          <input type="url" id="imagen" v-model="form.imagen" required placeholder="https://ejemplo.com/imagen.jpg">
        </div>

        <div class="row">
          <div class="form-group half">
            <label class="form-label" for="anio">Año</label>
            <input type="number" id="anio" v-model="form.anio" min="1888" max="2100" placeholder="Ej: 1999">
          </div>
          <div class="form-group half">
            <label class="form-label" for="genero">Género</label>
            <input type="text" id="genero" v-model="form.genero" maxlength="60" placeholder="Ej: Ciencia ficción">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="director">Director</label>
          <input type="text" id="director" v-model="form.director" maxlength="120" placeholder="Ej: Hermanas Wachowski">
        </div>

        <div class="form-group">
          <label class="form-label" for="sinopsis">Sinopsis</label>
          <textarea id="sinopsis" v-model="form.sinopsis" rows="4" maxlength="1000" placeholder="Breve descripción de la película..."></textarea>
        </div>

        <button type="submit" class="btn btn-primary btn-submit" :disabled="loading">
          {{ loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Película') }}
        </button>
      </form>

      <div class="preview-section">
        <p class="form-label">Vista Previa de Imagen</p>
        <div class="image-preview">
          <img v-if="isValidImageUrl" :src="form.imagen" alt="Vista previa" @error="$event.target.style.display = 'none'" @load="$event.target.style.display = 'block'" />
          <div v-else class="preview-placeholder">
            <span>La imagen aparecerá aquí</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 900px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  font-size: 1.8rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 3rem;
}

.form-content {
  background-color: var(--surface-color);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.row {
  display: flex;
  gap: 1rem;
}

.half {
  flex: 1;
}

.btn-submit {
  width: 100%;
  margin-top: 1rem;
  padding: 0.8rem;
  font-size: 1.05rem;
}

.preview-section {
  display: flex;
  flex-direction: column;
}

.image-preview {
  background-color: var(--surface-color);
  border-radius: var(--radius-lg);
  aspect-ratio: 2/3;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed var(--border-color);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
  padding: 2rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .image-preview {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
