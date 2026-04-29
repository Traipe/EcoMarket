// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://ecomarketapi.herokuapp.com'
})

// Se agrega el token automáticamente a TODAS las requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api