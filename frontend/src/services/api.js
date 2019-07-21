import axios from 'axios';
import { HOST } from '../_config/constants'

const api = axios.create({
    baseURL: `https://${HOST}`
})

export default api;