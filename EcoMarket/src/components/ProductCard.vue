<template>
  <div class="product-card" :class="{ 'is-organic': isOrganic }">

    <div class="card-image-wrapper">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        class="card-image"
        @error="imgError = true"
      />
      <div v-else class="card-image-placeholder">
        <span>🌿</span>
      </div>

      <span v-if="hasDiscount" class="badge-discount">
        -{{ discountPercent }}%
      </span>

      <button
        class="btn-wishlist"
        :class="{ active: inWishlist }"
        @click.stop="$emit('toggle-wishlist', product)"
        title="Lista de deseos"
      >
        {{ inWishlist ? '♥' : '♡' }}
      </button>
    </div>

    <div class="card-body">
      <div class="card-meta">
        <span class="category-tag">{{ product.category }}</span>
        <span v-if="product.dueDate" class="due-date">Vence: {{ product.dueDate }}</span>
      </div>

      <h3 class="product-name">{{ product.name }}</h3>

      <p class="product-description">{{ product.description }}</p>

      <div class="price-row">
        <span class="price-promo">{{ product.promotionalPrice }}</span>
        <span v-if="hasDiscount" class="price-original">{{ product.originalPrice }}</span>
      </div>

      <div class="card-footer">
        <div class="quantity-control">
          <button class="qty-btn" @click="decrement" :disabled="qty <= 1">−</button>
          <span class="qty-value">{{ qty }}</span>
          <button class="qty-btn" @click="increment" :disabled="qty >= product.quantity">+</button>
        </div>

        <button
          class="btn-cart"
          @click="handleAddToCart"
          :disabled="product.quantity === 0"
        >
          {{ product.quantity === 0 ? 'Agotado' : 'Agregar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  inWishlist: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add-to-cart', 'toggle-wishlist'])

const qty = ref(1)
const imgError = ref(false)

const isOrganic = computed(() =>
  props.product.category?.toLowerCase().includes('orgánico') ||
  props.product.category?.toLowerCase().includes('organico')
)

const hasDiscount = computed(() => {
  const original = parseFloat(props.product.originalPrice)
  const promo = parseFloat(props.product.promotionalPrice)
  return !isNaN(original) && !isNaN(promo) && promo < original
})

const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  const original = parseFloat(props.product.originalPrice)
  const promo = parseFloat(props.product.promotionalPrice)
  return Math.round((1 - promo / original) * 100)
})

function increment() {
  if (qty.value < props.product.quantity) qty.value++
}

function decrement() {
  if (qty.value > 1) qty.value--
}

function handleAddToCart() {
  emit('add-to-cart', { ...props.product, qty: qty.value })
  qty.value = 1
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

.product-card {
  background: rgba(9, 9, 103, 0.35);
  border: 1px solid rgba(112, 121, 211, 0.2);
  border-radius: 14px;
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-6px);
  border-color: rgba(112, 121, 211, 0.5);
  box-shadow: 0 8px 32px rgba(9, 9, 103, 0.5);
}

.product-card.is-organic {
  border-color: rgba(85, 141, 2, 0.4);
}

.product-card.is-organic:hover {
  border-color: rgba(85, 141, 2, 0.7);
  box-shadow: 0 8px 32px rgba(85, 141, 2, 0.2);
}

/* ── Imagen ── */
.card-image-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.4);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .card-image {
  transform: scale(1.04);
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  background: rgba(9, 9, 103, 0.5);
}

/* ── Badges ── */
.badge-discount {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #558d02;
  color: #000;
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
}

.btn-wishlist {
  position: absolute;
  top: 8px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(112, 121, 211, 0.3);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 16px;
  color: rgba(177, 179, 201, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, border-color 0.2s;
  line-height: 1;
}

.btn-wishlist.active {
  color: #ff6b8a;
  border-color: rgba(255, 107, 138, 0.5);
}

.btn-wishlist:hover {
  color: #ff6b8a;
}

/* ── Body ── */
.card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.category-tag {
  font-family: 'Space Mono', monospace;
  font-size: 0.68rem;
  color: #7079d3;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(112, 121, 211, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(112, 121, 211, 0.2);
}

.due-date {
  font-size: 0.72rem;
  color: rgba(177, 179, 201, 0.45);
}

.product-name {
  font-family: 'Space Mono', monospace;
  font-size: 0.95rem;
  font-weight: 700;
  color: #b1b3c9;
  margin: 0;
  line-height: 1.3;
}

.product-description {
  font-size: 0.82rem;
  color: rgba(177, 179, 201, 0.55);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Precios ── */
.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 4px;
}

.price-promo {
  font-family: 'Space Mono', monospace;
  font-size: 1.15rem;
  font-weight: 700;
  color: #558d02;
}

.price-original {
  font-size: 0.82rem;
  color: rgba(177, 179, 201, 0.4);
  text-decoration: line-through;
}

/* ── Footer ── */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(112, 121, 211, 0.15);
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(112, 121, 211, 0.2);
  border-radius: 8px;
  padding: 4px 8px;
}

.qty-btn {
  background: none;
  border: none;
  color: #7079d3;
  font-size: 1rem;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  transition: color 0.15s;
}

.qty-btn:disabled {
  color: rgba(112, 121, 211, 0.25);
  cursor: not-allowed;
}

.qty-btn:not(:disabled):hover {
  color: #b1b3c9;
}

.qty-value {
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
  color: #b1b3c9;
  min-width: 18px;
  text-align: center;
}

.btn-cart {
  background: #558d02;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #000;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  white-space: nowrap;
}

.btn-cart:hover:not(:disabled) {
  background: #6aaf02;
  transform: translateY(-1px);
}

.btn-cart:disabled {
  background: rgba(85, 141, 2, 0.25);
  color: rgba(0, 0, 0, 0.4);
  cursor: not-allowed;
}
</style>