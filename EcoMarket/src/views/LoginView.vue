<template>
  <div class="login-page">
    <div class="login-wrapper">

      <div class="brand">
        <v-img
          src="@/assets/img/logoecomarket.png" 
          alt="EcoMarket Logo"
          max-width="45"
          class="mr-1"
        ></v-img>
        <span class="brand-name">EcoMarket</span>
      </div>

      <div class="login-card">
        <h1 class="card-title">{{ isRegister ? 'Crear cuenta' : 'Iniciar sesión' }}</h1>
        <p class="card-subtitle">{{ isRegister ? 'Únete a la comunidad eco.' : 'Bienvenido de vuelta.' }}</p>

        <div v-if="errorMsg" class="error-alert">
          {{ errorMsg }}
        </div>

        <div class="field-group">
          <label class="field-label">Correo electrónico</label>
          <input
            v-model="form.email"
            type="email"
            class="field-input"
            placeholder="tu@correo.com"
            @keyup.enter="handleSubmit"
          />
        </div>

        <div class="field-group">
          <label class="field-label">Contraseña</label>
          <div class="input-wrapper">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              placeholder="••••••••"
              @keyup.enter="handleSubmit"
            />
            <button class="toggle-pass" @click="showPassword = !showPassword" type="button">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <button
          class="submit-btn"
          :class="{ loading: isLoading }"
          @click="handleSubmit"
          :disabled="isLoading"
        >
          <span v-if="!isLoading" class="btn-text">{{ isRegister ? 'Registrarse' : 'Entrar' }}</span>
          <span v-else class="spinner"></span>
        </button>

        <p class="toggle-mode">
          {{ isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
          <button class="link-btn" @click="toggleMode">
            {{ isRegister ? 'Inicia sesión' : 'Regístrate' }}
          </button>
        </p>
      </div>

      <p class="footer-note">Productos 100% sustentables 🌱</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api.js'

const router = useRouter()

const isRegister = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

const form = reactive({
  email: '',
  password: ''
})

function toggleMode() {
  isRegister.value = !isRegister.value
  errorMsg.value = ''
  form.email = ''
  form.password = ''
}

async function handleSubmit() {
  errorMsg.value = ''

  if (!form.email || !form.password) {
    errorMsg.value = 'Por favor completa todos los campos.'
    return
  }

  isLoading.value = true

  try {
    const endpoint = isRegister.value ? '/register' : '/login'
    const { data } = await api.post(endpoint, {
      email: form.email,
      password: form.password
    })

    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('userId', data.user.id)
    localStorage.setItem('userEmail', data.user.email)

    router.push('/products')
  } catch (err) {
    if (err.response?.status === 400) {
      errorMsg.value = isRegister.value
        ? 'El correo ya está registrado.'
        : 'Credenciales incorrectas.'
    } else {
      errorMsg.value = 'Error de conexión. Intenta más tarde.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Aplicamos Bubbler One como fuente principal */
.login-page {
  min-height: 100vh;
  background-color: #693817; /* Pullman Brown */
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(133, 151, 51, 0.3) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(235, 135, 24, 0.15) 0%, transparent 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Bubbler One', sans-serif;
  color: #fffaff;
}

.login-wrapper {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.brand-name {
  font-family: 'Bubbler One', sans-serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #fffaff; /* Snow */
  letter-spacing: 1px;
}

.login-card {
  width: 100%;
  background: rgba(133, 151, 51, 0.15); /* Old Moss Green suave */
  border: 1px solid rgba(133, 151, 51, 0.4);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  backdrop-filter: blur(10px);
}

.card-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fffaff;
  margin: 0 0 8px;
  text-align: center;
}

.card-subtitle {
  font-size: 1rem;
  color: rgba(255, 250, 255, 0.7);
  margin: 0 0 2rem;
  text-align: center;
}

.error-alert {
  background: rgba(235, 135, 24, 0.2);
  border: 1px solid #eb8718;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #fffaff;
  margin-bottom: 1.5rem;
  text-align: center;
}

.field-label {
  font-size: 0.9rem;
  font-weight: bold;
  color: #eb8718; /* Beer */
  margin-bottom: 8px;
  text-transform: uppercase;
}

.field-input {
  width: 100%;
  background: rgba(105, 56, 23, 0.4); /* Brown oscuro translúcido */
  border: 2px solid rgba(133, 151, 51, 0.3);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  color: #fffaff;
  outline: none;
  transition: all 0.3s ease;
}

.field-input:focus {
  border-color: #eb8718;
  background: rgba(105, 56, 23, 0.6);
}

.submit-btn {
  width: 100%;
  background: #eb8718; /* Beer */
  border: none;
  border-radius: 50px;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fffaff;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #d47a16;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(235, 135, 24, 0.3);
}

.link-btn {
  background: none;
  border: none;
  color: #eb8718;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 5px;
}

.footer-note {
  font-size: 0.9rem;
  color: rgba(255, 250, 255, 0.4);
}

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fffaff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>