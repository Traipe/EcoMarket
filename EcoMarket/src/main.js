import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Router
import { createRouter, createWebHistory } from 'vue-router'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'ecomarket',
    themes: {
      ecomarket: {
        dark: true,
        colors: {
          background: '#693817', // Pullman Brown (Fondo cálido y rústico)
          surface:    '#859733', // Old Moss Green (Tarjetas y secciones)
          primary:    '#eb8718', // Beer (Naranja vibrante para botones/destacados)
          secondary:  '#fffaff', // Snow (Para contrastes limpios)
          accent:     '#eb8718', 
          'on-background': '#fffaff',
          'on-surface':    '#fffaff',
        }
      }
    }
  }
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./views/HomeView.vue') },
    { path: '/products', component: () => import('./views/ProductsView.vue') },
    { path: '/login', component: () => import('./views/LoginView.vue') },
  ]
})

createApp(App)
  .use(vuetify)
  .use(createPinia())
  .use(router)
  .mount('#app')