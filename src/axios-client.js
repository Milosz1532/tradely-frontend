import axios from 'axios'
import Cookies from 'js-cookie'
import { Link, Navigate, Outlet } from 'react-router-dom'

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
})

axiosClient.interceptors.request.use(config => {
	const token = Cookies.get('ACCESS_TOKEN')
	config.headers.Authorization = `Bearer ${token}`
	return config
})

axiosClient.interceptors.response.use(
	response => {
		return response
	},
	error => {
		try {
			const { response } = error
			if (response.status === 401) {
				Cookies.remove('ACCESS_TOKEN')
				window.location.reload(false)
			}
		} catch (e) {
			console.log(e)
		}

		throw error
	}
)

export default axiosClient
