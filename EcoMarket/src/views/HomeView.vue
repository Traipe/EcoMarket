<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <span class="hero-eyebrow">Mercado sustentable</span>
        <h1 class="hero-title">
          Consume con
          <span class="hero-accent">conciencia.</span>
        </h1>
        <p class="hero-body">
          Productos orgánicos, locales y de temporada. Directo del productor a tu mesa.
        </p>
        <div class="hero-actions">
          <router-link to="/products" class="btn-primary">Ver productos</router-link>
          <router-link v-if="!isLoggedIn" to="/login" class="btn-ghost">Crear cuenta</router-link>
          <span v-else class="welcome-msg">Hola, {{ userEmail }} 🌿</span>
        </div>
      </div>

      <div class="hero-visual">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="hero-badge">
          <span class="badge-number">100%</span>
          <span class="badge-label">orgánico</span>
        </div>
      </div>
    </section>

    <section class="stats-row">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <span class="stat-number">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Explora por categoría</h2>
      <div class="categories-grid">
        <button
          v-for="cat in featuredCategories"
          :key="cat.name"
          class="cat-card"
          @click="goToCategory(cat.name)"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
        </button>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Recién llegados</h2>
        <router-link to="/products" class="see-all">Ver todos →</router-link>
      </div>

      <div v-if="isLoading" class="skeleton-row">
        <div v-for="n in 3" :key="n" class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-body">
            <div class="skeleton-line short"></div>
            <div class="skeleton-line"></div>
          </div>
        </div>
      </div>

      <div v-else class="featured-grid">
        <ProductCard
          v-for="product in recentProducts"
          :key="product.id"
          :product="product"
          :inWishlist="false"
          @add-to-cart="handleAddToCart"
          @toggle-wishlist="() => $router.push('/login')"
        />
      </div>
    </section>

    <section class="cta-section">
      <h2 class="cta-title">¿Tienes productos sustentables?</h2>
      <p class="cta-body">Únete como productor y llega a miles de personas comprometidas con el planeta.</p>
      <router-link to="/login" class="btn-primary">Publicar mis productos</router-link>
    </section>

    <Transition name="toast">
      <div v-if="toast.visible" class="toast">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
// ... (mismo script que ya tienes, no requiere cambios de lógica) ...
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api.js'
import ProductCard from '@/components/ProductCard.vue'

const router = useRouter()
const products = ref([])
const isLoading = ref(true)
const toast = ref({ visible: false, message: '' })
let toastTimer = null

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const userEmail = computed(() => localStorage.getItem('userEmail') || '')

const recentProducts = computed(() => products.value.slice(0, 3))

const stats = [
  { value: '500+', label: 'Productos activos' },
  { value: '120+', label: 'Productores' },
  { value: '4.8★', label: 'Valoración media' },
  { value: '0%', label: 'Plástico' },
]

const featuredCategories = [
  { name: 'Frutas',     icon: '🍎' },
  { name: 'Verduras',   icon: '🥦' },
  { name: 'Orgánico',   icon: '🌿' },
  { name: 'Lácteos',    icon: '🧀' },
  { name: 'Granos',     icon: '🌾' },
  { name: 'Otros',      icon: '🛒' },
]

function goToCategory(cat) {
  router.push({ path: '/products', query: { category: cat } })
}

async function fetchProducts() {
  try {
    const { data } = await api.get('/products')
    products.value = data
  } catch {
    // silencioso en home
  } finally {
    isLoading.value = false
  }
}

function handleAddToCart(payload) {
  showToast(`${payload.qty}× ${payload.name} agregado al carrito.`)
}

function showToast(message) {
  clearTimeout(toastTimer)
  toast.value = { visible: true, message }
  toastTimer = setTimeout(() => { toast.value.visible = false }, 2800)
}

onMounted(fetchProducts)
</script>

<style scoped>
/* Cambiamos las fuentes a la paleta nueva */
.home-page {
  min-height: 100vh;
  background-color: #693817; /* Pullman Brown */
  font-family: 'Bubbler One', sans-serif;
  color: #fffaff; /* Snow */
}

/* ── Hero ── */
.hero {
  min-height: 88vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 4rem 6vw 3rem;
  position: relative;
  overflow: hidden;
  /* Gradientes usando Old Moss Green y Beer */
  background-image:
    radial-gradient(ellipse at 10% 60%, rgba(133, 151, 51, 0.4) 0%, transparent 55%),
    radial-gradient(ellipse at 90% 20%, rgba(235, 135, 24, 0.15) 0%, transparent 50%);
}

.hero-eyebrow {
  font-size: 0.9rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #eb8718; /* Beer */
  display: block;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: #fffaff; /* Snow */
  line-height: 1.1;
  margin: 0 0 1.25rem;
}

.hero-accent {
  color: #859733; /* Old Moss Green */
  display: block;
}

.hero-body {
  font-size: 1.2rem;
  color: rgba(255, 250, 255, 0.8);
  line-height: 1.6;
  margin: 0 0 2rem;
  max-width: 440px;
}

.btn-primary {
  background: #eb8718; /* Beer */
  color: #fffaff;
  border: none;
  border-radius: 50px;
  padding: 0.85rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #d47a16;
  transform: scale(1.05);
}

.btn-ghost {
  background: transparent;
  color: #fffaff;
  border: 2px solid #859733; /* Old Moss Green */
  border-radius: 50px;
  padding: 0.85rem 2rem;
  font-size: 1rem;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.btn-ghost:hover {
  background: rgba(133, 151, 51, 0.2);
  border-color: #eb8718;
}

/* ── Visual orbs ── */
.orb-1 {
  width: 260px;
  height: 260px;
  background: rgba(133, 151, 51, 0.3);
  border: 1px solid rgba(255, 250, 255, 0.1);
}

.orb-2 {
  width: 160px;
  height: 160px;
  background: rgba(235, 135, 24, 0.1);
  border: 1px solid rgba(235, 135, 24, 0.2);
}

.badge-number {
  font-size: 3rem;
  color: #eb8718;
}

.badge-label {
  color: #859733;
}

/* ── Stats ── */
.stats-row {
  background: rgba(255, 250, 255, 0.05);
  border-top: 1px solid rgba(255, 250, 255, 0.1);
  border-bottom: 1px solid rgba(255, 250, 255, 0.1);
}

.stat-card {
  background: transparent;
  padding: 2.5rem 1.5rem;
}

.stat-number {
  color: #eb8718;
}

.stat-label {
  color: rgba(255, 250, 255, 0.6);
}

/* ── Secciones ── */
.section-title {
  font-size: 2rem;
  color: #fffaff;
}

.see-all {
  color: #eb8718;
}

/* ── Categorías ── */
.cat-card {
  background: rgba(133, 151, 51, 0.15);
  border: 1px solid rgba(133, 151, 51, 0.3);
}

.cat-card:hover {
  border-color: #eb8718;
  background: rgba(235, 135, 24, 0.1);
}

.cat-name {
  color: #fffaff;
  font-weight: bold;
}

/* ── CTA ── */
.cta-section {
  background: rgba(133, 151, 51, 0.1);
  border-top: 1px solid rgba(255, 250, 255, 0.05);
}

.cta-title {
  color: #fffaff;
}

/* ── Toast ── */
.toast {
  background: #859733;
  color: #fffaff;
}
</style>