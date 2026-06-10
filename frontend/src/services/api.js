const BASE_URL = 'http://localhost:8000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, endpoint, body = null, isFormData = false) {
  const headers = {
    Accept: 'application/json',
    ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    ...(!isFormData && { 'Content-Type': 'application/json' }),
  };

  const options = {
    method,
    headers,
    ...(body && { body: isFormData ? body : JSON.stringify(body) }),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();

  if (!res.ok) throw data;
  return data;
}

// Auth
export const login = (credentials) => request('POST', '/login', credentials);
export const logout = () => request('POST', '/logout');

// Products
export const getProducts = () => request('GET', '/products');
export const getProduct = (id) => request('GET', `/products/${id}`);
export const createProduct = (formData) => request('POST', '/products', formData, true);
export const updateProduct = (id, formData) => request('POST', `/products/${id}?_method=PUT`, formData, true);
export const deleteProduct = (id) => request('DELETE', `/products/${id}`);

// Categories
export const getCategories = () => request('GET', '/categories');