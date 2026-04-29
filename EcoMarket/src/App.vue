<template>
  <v-app>
    <v-app-bar color="background" elevation="2">
      <v-app-bar-title>
        <router-link to="/" class="d-flex align-center text-decoration-none">
          <v-img
            src="@/assets/img/logoecomarket.png" 
            alt="EcoMarket Logo"
            max-width="45"
            class="mr-2"
          ></v-img>
          <span class="custom-font text-secondary">EcoMarket</span>
        </router-link>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn to="/" variant="text" color="secondary">Inicio</v-btn>
      <v-btn to="/products" variant="text" color="secondary">Productos</v-btn>
      
      <v-btn to="/login" color="primary" variant="flat" class="mr-2">
        Login
      </v-btn>

      <v-btn icon @click="cart.toggleCart()" color="secondary">
        <v-badge 
          :content="cart.totalItems" 
          :model-value="!cart.isEmpty" 
          color="primary"
        >
          <v-icon>mdi-cart-outline</v-icon>
        </v-badge>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <CartDrawer />
  </v-app>
</template>

<script setup>
import { useCartStore } from '@/stores/cart.js'
import CartDrawer from '@/components/CartDrawer.vue'

const cart = useCartStore()
</script>

<style>
/* Importante: Sin 'scoped' para que afecte a toda la app */
@import url('https://fonts.googleapis.com/css2?family=Bubbler+One&display=swap');

.v-application {
  font-family: 'Bubbler One', sans-serif !important;
}

.custom-font {
  font-family: 'Bubbler One', sans-serif;
  font-size: 1.8rem;
  font-weight: bold;
}
</style>