import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://hyperlocal-vendor-backend.onrender.com'
})

export default instance