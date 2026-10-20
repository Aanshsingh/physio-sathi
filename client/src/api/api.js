import axios from 'axios';

const api = axios.create({
    baseURL : import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 4500,
})

export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (err?.code === 'ECONNABORTED') return 'The request took too long. Please try again.'
  if (!err?.response) return 'Could not reach the server. Check that the backend is running.'
  return err.response.data?.message || fallback
}

export const rupees = (n) => `u20B9${Number(n).toLocaleString('en-IN')}`

export default api
