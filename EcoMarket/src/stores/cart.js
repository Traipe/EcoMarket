import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {

  // ── Estado ──
  const items = ref([])
  const isOpen = ref(false)

  // ── Getters ──
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.qty, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => {
      const price = parseFloat(item.promotionalPrice) || parseFloat(item.originalPrice) || 0
      return sum + price * item.qty
    }, 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  // ── Actions ──
  function add(product) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      const maxQty = product.quantity ?? Infinity
      existing.qty = Math.min(existing.qty + (product.qty ?? 1), maxQty)
    } else {
      items.value.push({ ...product, qty: product.qty ?? 1 })
    }
  }

  function remove(productId) {
    items.value = items.value.filter(i => i.id !== productId)
  }

  function updateQty(productId, qty) {
    const item = items.value.find(i => i.id === productId)
    if (!item) return
    if (qty <= 0) {
      remove(productId)
    } else {
      item.qty = Math.min(qty, item.quantity ?? qty)
    }
  }

  function clear() {
    items.value = []
  }

  function toggleCart() {
    isOpen.value = !isOpen.value
  }

  function openCart() {
    isOpen.value = true
  }

  function closeCart() {
    isOpen.value = false
  }

  return {
    items,
    isOpen,
    totalItems,
    totalPrice,
    isEmpty,
    add,
    remove,
    updateQty,
    clear,
    toggleCart,
    openCart,
    closeCart,
  }
})