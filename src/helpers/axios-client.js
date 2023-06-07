import axios from 'axios'
import Cookies from 'js-cookie'
import { useSelector } from 'react-redux';


const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
})

axiosClient.interceptors.request.use(config => {
	const token = Cookies.get('ACCESS_TOKEN')
	console.log(token)
	config.headers.Authorization = `Bearer ${token}`
	return config
})

axiosClient.interceptors.response.use(
	response => {
		return response
	},
	error => {
		if (error.response.status === 401 || error.response.status === 403) {
			// Token uwierzytelniający jest nieprawidłowy lub wygasł
			// Możesz wykonać odpowiednie działania, np. przekierowanie na stronę logowania
			console.log('Token uwierzytelniający jest nieprawidłowy lub wygasł')
		}
		throw error
	}
)

export default axiosClient
