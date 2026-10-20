import axios from 'axios';

const api = axios.create({
    baseURL : import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 90000,
})

export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (err?.code === 'ECONNABORTED') return 'The request took too long. Please try again.'
  if (!err?.response) return 'Could not reach the server. Check that the backend is running.'
  return err.response.data?.message || fallback
}

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 })
export const rupees = (n) => inr.format(Number(n))

export default api
