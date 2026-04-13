import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:5000' || 'https://hyperlocal-vendor-backend.onrender.com'
})

export default instance