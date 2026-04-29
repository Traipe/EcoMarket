<template>
  <div class="products-page">

    <!-- Header búsqueda + filtros -->
    <div class="page-header">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar productos..."
          class="search-input"
        />
        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
      </div>

      <div class="filters-row">
        <button
          v-for="cat in categories"
          :key="cat"
          class="filter-chip"
          :class="{ active: selectedCategory === cat }"
          @click="toggleCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Estado: cargando -->
    <div v-if="isLoading" class="state-container">
      <div class="skeleton-grid">
        <div v-for="n in 6" :key="n" class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-body">
            <div class="skeleton-line short"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line medium"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado: error -->
    <div v-else-if="errorMsg" class="state-container center">
      <p class="state-icon">⚠️</p>
      <p class="state-text">{{ errorMsg }}</p>
      <button class="retry-btn" @click="fetchProducts">Reintentar</button>
    </div>

    <!-- Estado: sin resultados -->
    <div v-else-if="filteredProducts.length === 0" class="state-container center">
      <p class="state-icon">🌾</p>
      <p class="state-text">Sin productos para "{{ searchQuery || selectedCategory }}"</p>
      <button class="retry-btn" @click="clearFilters">Limpiar filtros</button>
    </div>

    <!-- Grid de productos -->
    <div v-else class="products-grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :inWishlist="wishlistIds.has(product.id)"
        @add-to-cart="handleAddToCart"
        @toggle-wishlist="handleToggleWishlist"
      />
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.visible" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api.js'
import ProductCard from '@/components/ProductCard.vue'

const products = ref([])
const isLoading = ref(true)
const errorMsg = ref('')
const searchQuery = ref('')
const selectedCategory = ref('Todos')

const wishlistIds = ref(new Set())

const toast = ref({ visible: false, message: '', type: 'success' })
let toastTimer = null

// ── Categorías dinámicas desde la API ──
const categories = computed(() => {
  const cats = new Set(products.value.map(p => p.category).filter(Boolean))
  return ['Todos', ...cats]
})

// ── Filtrado ──
const filteredProducts = computed(() => {
  let result = products.value

  if (selectedCategory.value !== 'Todos') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    )
  }

  return result
})

function toggleCategory(cat) {
  selectedCategory.value = selectedCategory.value === cat ? 'Todos' : cat
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'Todos'
}

// ── API: productos ──
async function fetchProducts() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    const { data } = await api.get('/products')
    products.value = data
  } catch {
    errorMsg.value = 'No se pudieron cargar los productos.'
  } finally {
    isLoading.value = false
  }
}

// ── API: wishlist ──
async function fetchWishlist() {
  const userId = localStorage.getItem('userId')
  if (!userId) return
  try {
    const { data } = await api.get(`/wishlist?userId=${userId}`)
    wishlistIds.value = new Set(data.map(item => item.id))
  } catch {
    // silencioso: la wishlist no bloquea la vista
  }
}

async function handleToggleWishlist(product) {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    showToast('Inicia sesión para usar la wishlist.', 'error')
    return
  }

  if (wishlistIds.value.has(product.id)) {
    try {
      await api.delete(`/wishlist/${product.id}`)
      wishlistIds.value.delete(product.id)
      wishlistIds.value = new Set(wishlistIds.value)
      showToast(`${product.name} eliminado de favoritos.`, 'info')
    } catch {
      showToast('Error al actualizar favoritos.', 'error')
    }
  } else {
    try {
      await api.post('/wishlist', { ...product, userId: Number(userId) })
      wishlistIds.value.add(product.id)
      wishlistIds.value = new Set(wishlistIds.value)
      showToast(`${product.name} agregado a favoritos. ♥`, 'success')
    } catch {
      showToast('Error al agregar a favoritos.', 'error')
    }
  }
}

// ── Carrito (Pinia store) ──
function handleAddToCart(payload) {
  // Emitir al store cuando esté implementado
  // cartStore.add(payload)
  showToast(`${payload.qty}× ${payload.name} agregado al carrito.`, 'success')
}

// ── Toast ──
function showToast(message, type = 'success') {
  clearTimeout(toastTimer)
  toast.value = { visible: true, message, type }
  toastTimer = setTimeout(() => {
    toast.value.visible = false
  }, 2800)
}

onMounted(() => {
  fetchProducts()
  fetchWishlist()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

.products-page {
  min-height: 100vh;
  background-color: #000000;
  background-image:
    radial-gradient(ellipse at 0% 0%, rgba(9, 9, 103, 0.5) 0%, transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(85, 141, 2, 0.15) 0%, transparent 50%);
  padding: 2rem 1.5rem 4rem;
  font-family: 'DM Sans', sans-serif;
}

/* ── Header ── */
.page-header {
  max-width: 1100px;
  margin: 0 auto 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(9, 9, 103, 0.35);
  border: 1px solid rgba(112, 121, 211, 0.25);
  border-radius: 10px;
  padding: 0 1rem;
  transition: border-color 0.2s;
}

.search-bar:focus-within {
  border-color: rgba(112, 121, 211, 0.6);
}

.search-icon {
  font-size: 16px;
  opacity: 0.5;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  padding: 0.8rem 0;
  font-size: 0.95rem;
  color: #b1b3c9;
  font-family: 'DM Sans', sans-serif;
}

.search-input::placeholder {
  color: rgba(177, 179, 201, 0.3);
}

.clear-btn {
  background: none;
  border: none;
  color: rgba(177, 179, 201, 0.4);
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  transition: color 0.15s;
}

.clear-btn:hover {
  color: #b1b3c9;
}

.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  background: rgba(9, 9, 103, 0.3);
  border: 1px solid rgba(112, 121, 211, 0.2);
  border-radius: 20px;
  padding: 5px 14px;
  font-size: 0.8rem;
  color: rgba(177, 179, 201, 0.6);
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip:hover {
  border-color: rgba(112, 121, 211, 0.5);
  color: #b1b3c9;
}

.filter-chip.active {
  background: rgba(85, 141, 2, 0.2);
  border-color: rgba(85, 141, 2, 0.6);
  color: #558d02;
}

/* ── Grid ── */
.products-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* ── Skeleton ── */
.skeleton-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.skeleton-card {
  background: rgba(9, 9, 103, 0.25);
  border: 1px solid rgba(112, 121, 211, 0.1);
  border-radius: 14px;
  overflow: hidden;
}

.skeleton-img {
  height: 180px;
  background: rgba(112, 121, 211, 0.08);
  animation: shimmer 1.5s infinite;
}

.skeleton-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: rgba(112, 121, 211, 0.08);
  animation: shimmer 1.5s infinite;
}

.skeleton-line.short  { width: 40%; }
.skeleton-line.medium { width: 65%; }

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}

/* ── Estados vacíos ── */
.state-container {
  max-width: 1100px;
  margin: 0 auto;
}

.state-container.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  gap: 0.75rem;
}

.state-icon {
  font-size: 2.5rem;
  margin: 0;
}

.state-text {
  font-size: 0.95rem;
  color: rgba(177, 179, 201, 0.5);
  margin: 0;
}

.retry-btn {
  background: none;
  border: 1px solid rgba(112, 121, 211, 0.35);
  border-radius: 8px;
  padding: 8px 20px;
  color: #7079d3;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 8px;
  transition: border-color 0.2s, color 0.2s;
}

.retry-btn:hover {
  border-color: #7079d3;
  color: #b1b3c9;
}

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
  z-index: 999;
  white-space: nowrap;
  pointer-events: none;
}

.toast.success {
  background: rgba(85, 141, 2, 0.9);
  color: #000;
  border: 1px solid rgba(85, 141, 2, 0.5);
}

.toast.error {
  background: rgba(180, 40, 40, 0.9);
  color: #fff;
  border: 1px solid rgba(200, 60, 60, 0.5);
}

.toast.info {
  background: rgba(9, 9, 103, 0.95);
  color: #b1b3c9;
  border: 1px solid rgba(112, 121, 211, 0.4);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>