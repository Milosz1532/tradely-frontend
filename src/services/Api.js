import axios from 'axios'
import Cookies from 'js-cookie'

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
})

axiosClient.interceptors.response.use(
	response => {
		return response
	},
	error => {
		if (error.response.status === 401 || error.response.status === 403) {
			setAuthHeader(false)
			window.location.reload(false)
		}
		throw error
	}
)

axiosClient.interceptors.request.use(config => {
	const token = Cookies.get('ACCESS_TOKEN')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	const preferredLanguage = 'pl'
	if (preferredLanguage) {
		config.headers['X-localization'] = preferredLanguage
	}

	return config
})

const setAuthHeader = token => {
	if (token) {
		Cookies.set('ACCESS_TOKEN', token, { expires: 60 })
	} else {
		Cookies.remove('ACCESS_TOKEN')
	}
}

export const login = async (email, password) => {
	try {
		const data = {
			email: email,
			password: password,
		}
		const response = await axiosClient.post('/login', data)
		const { token, user } = response.data
		setAuthHeader(token)
		return user
	} catch (error) {
		throw error.response.data
	}
}

export const signup = async (login, email, password) => {
	try {
		const data = {
			login,
			email,
			password,
		}
		const response = await axiosClient.post('/signup', data)
		const { token, user } = response.data
		setAuthHeader(token)
		return user
	} catch (error) {
		throw error.response.data
	}
}

export const getUserData = async () => {
	try {
		if (Cookies.get('ACCESS_TOKEN')) {
			const response = await axiosClient.get('/verify_token')
			return response.data
		}
	} catch (error) {
		throw error.response.data
	}
}

export const logout = async () => {
	try {
		await axiosClient.post('/logout')
		setAuthHeader(null)
	} catch (error) {
		throw error.response.data
	}
}

export default axiosClient
