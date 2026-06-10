import 'dotenv/config';

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
});

export default api;
