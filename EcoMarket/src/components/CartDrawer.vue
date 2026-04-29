<template>
  <!-- Overlay -->
  <Transition name="overlay">
    <div v-if="cart.isOpen" class="overlay" @click="cart.closeCart()"></div>
  </Transition>

  <!-- Drawer -->
  <Transition name="drawer">
    <div v-if="cart.isOpen" class="drawer">

      <div class="drawer-header">
        <h2 class="drawer-title">
          Carrito
          <span v-if="!cart.isEmpty" class="item-count">{{ cart.totalItems }}</span>
        </h2>
        <button class="close-btn" @click="cart.closeCart()">✕</button>
      </div>

      <!-- Vacío -->
      <div v-if="cart.isEmpty" class="empty-state">
        <span class="empty-icon">🛒</span>
        <p class="empty-text">Tu carrito está vacío.</p>
        <button class="btn-browse" @click="goToProducts">Ver productos</button>
      </div>

      <!-- Items -->
      <div v-else class="drawer-body">
        <ul class="item-list">
          <li
            v-for="item in cart.items"
            :key="item.id"
            class="cart-item"
          >
            <div class="item-img-wrap">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="item-img"
              />
              <div v-else class="item-img-placeholder">🌿</div>
            </div>

            <div class="item-info">
              <p class="item-name">{{ item.name }}</p>
              <p class="item-price">{{ item.promotionalPrice || item.originalPrice }}</p>

              <div class="qty-row">
                <button class="qty-btn" @click="cart.updateQty(item.id, item.qty - 1)">−</button>
                <span class="qty-val">{{ item.qty }}</span>
                <button
                  class="qty-btn"
                  @click="cart.updateQty(item.id, item.qty + 1)"
                  :disabled="item.qty >= item.quantity"
                >+</button>
              </div>
            </div>

            <button class="remove-btn" @click="cart.remove(item.id)" title="Eliminar">✕</button>
          </li>
        </ul>

        <!-- Footer -->
        <div class="drawer-footer">
          <div class="total-row">
            <span class="total-label">Total estimado</span>
            <span class="total-value">${{ cart.totalPrice.toFixed(2) }}</span>
          </div>

          <button class="btn-checkout" @click="handleCheckout">
            Confirmar pedido
          </button>

          <button class="btn-clear" @click="cart.clear()">
            Vaciar carrito
          </button>
        </div>
      </div>

    </div>
  </Transition>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.js'

const cart = useCartStore()
const router = useRouter()

function goToProducts() {
  cart.closeCart()
  router.push('/products')
}

function handleCheckout() {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    cart.closeCart()
    router.push('/login')
    return
  }
  // Aquí conectarás con /reserved cuando implementes el checkout
  alert('Checkout próximamente 🌿')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

/* ── Overlay ── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  backdrop-filter: blur(2px);
}

/* ── Drawer ── */
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: min(420px, 100vw);
  background: #03031a;
  border-left: 1px solid rgba(112, 121, 211, 0.2);
  z-index: 101;
  display: flex;
  flex-direction: column;
  font-family: 'DM Sans', sans-serif;
}

/* ── Header ── */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(112, 121, 211, 0.15);
}

.drawer-title {
  font-family: 'Space Mono', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: #b1b3c9;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-count {
  background: #558d02;
  color: #000;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(177, 179, 201, 0.4);
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.15s;
}

.close-btn:hover {
  color: #b1b3c9;
}

/* ── Vacío ── */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
}

.empty-icon {
  font-size: 2.5rem;
}

.empty-text {
  font-size: 0.9rem;
  color: rgba(177, 179, 201, 0.4);
  margin: 0;
}

.btn-browse {
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

.btn-browse:hover {
  border-color: #7079d3;
  color: #b1b3c9;
}

/* ── Body ── */
.drawer-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.item-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(112, 121, 211, 0.2) transparent;
}

/* ── Item ── */
.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(112, 121, 211, 0.1);
}

.cart-item:last-child {
  border-bottom: none;
}

.item-img-wrap {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(9, 9, 103, 0.4);
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #b1b3c9;
  margin: 0 0 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  font-family: 'Space Mono', monospace;
  font-size: 0.82rem;
  color: #558d02;
  margin: 0 0 8px;
}

.qty-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  background: rgba(112, 121, 211, 0.1);
  border: 1px solid rgba(112, 121, 211, 0.2);
  border-radius: 6px;
  width: 26px;
  height: 26px;
  color: #7079d3;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  line-height: 1;
}

.qty-btn:hover:not(:disabled) {
  background: rgba(112, 121, 211, 0.2);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-val {
  font-family: 'Space Mono', monospace;
  font-size: 0.82rem;
  color: #b1b3c9;
  min-width: 18px;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  color: rgba(177, 179, 201, 0.25);
  font-size: 13px;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
  transition: color 0.15s;
  align-self: flex-start;
}

.remove-btn:hover {
  color: #ff6b8a;
}

/* ── Footer ── */
.drawer-footer {
  padding: 1.25rem 1.5rem 2rem;
  border-top: 1px solid rgba(112, 121, 211, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
}

.total-label {
  font-size: 0.82rem;
  color: rgba(177, 179, 201, 0.5);
}

.total-value {
  font-family: 'Space Mono', monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: #558d02;
}

.btn-checkout {
  width: 100%;
  background: #558d02;
  border: none;
  border-radius: 8px;
  padding: 0.85rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #000;
  font-family: 'Space Mono', monospace;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-checkout:hover {
  background: #6aaf02;
  transform: translateY(-1px);
}

.btn-clear {
  width: 100%;
  background: none;
  border: 1px solid rgba(177, 179, 201, 0.1);
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.8rem;
  color: rgba(177, 179, 201, 0.35);
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.btn-clear:hover {
  border-color: rgba(255, 107, 138, 0.35);
  color: #ff6b8a;
}

/* ── Transiciones ── */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
</style>