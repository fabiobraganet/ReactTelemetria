// src/services/api.ts

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3011', // URL do json-server
});

export default api;
