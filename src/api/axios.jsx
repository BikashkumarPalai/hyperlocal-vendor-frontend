import axios from 'axios'

const instance = axios.create({
  baseURL:  'https://hyperlocal-vendor-backend.onrender.com'||'http://localhost:5000' 
})

export default instance