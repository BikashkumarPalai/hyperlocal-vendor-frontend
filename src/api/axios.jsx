import axios from 'axios'

const instance = axios.create({
  baseURL:  'https://hyperlocal-vendor-backend.vercel.app'||'http://localhost:5000' 
})

export default instance