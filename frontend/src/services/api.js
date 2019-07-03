import axios from 'axios';
import { HOST } from '../_config/constants'

const api = axios.create({
    baseURL: `http://${HOST}:4000`
})

export default api;