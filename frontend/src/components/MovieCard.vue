<script setup>
import { computed } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  },
  canEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete'])

const confirmDelete = () => {
  if (confirm(`¿Estás seguro de eliminar "${props.movie.nombre}"?`)) {
    emit('delete', props.movie.id)
  }
}
</script>

<template>
  <div class="movie-card">
    <div class="poster-container">
      <img :src="movie.imagen" :alt="movie.nombre" class="poster" @error="$event.target.src='https://via.placeholder.com/500x750?text=Sin+Imagen'" />
      <div class="year-badge" v-if="movie.anio">{{ movie.anio }}</div>
    </div>
    
    <div class="card-content">
      <h3 class="title" :title="movie.nombre">{{ movie.nombre }}</h3>
      
      <div class="meta">
        <span class="genre" v-if="movie.genero">{{ movie.genero }}</span>
        <span class="director" v-if="movie.director">{{ movie.director }}</span>
      </div>
      
      <div class="actions" v-if="canEdit">
        <RouterLink :to="`/peliculas/${movie.id}/editar`" class="btn-action edit">
          ✏️ Editar
        </RouterLink>
        <button @click="confirmDelete" class="btn-action delete">
          🗑️ Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  background-color: var(--surface-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.poster-container {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background-color: #111;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.movie-card:hover .poster {
  transform: scale(1.05);
}

.year-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(15, 23, 42, 0.8);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.card-content {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  flex: 1;
}

.genre {
  color: var(--accent-color);
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.btn-action {
  flex: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem;
  font-size: 0.85rem;
  border-radius: var(--radius-md);
  transition: all 0.2s;
  background-color: var(--bg-color);
  color: var(--text-secondary);
}

.btn-action:hover {
  color: var(--text-primary);
}

.btn-action.edit:hover {
  background-color: var(--accent-color);
  color: white;
}

.btn-action.delete:hover {
  background-color: var(--danger-color);
  color: white;
}
</style>
