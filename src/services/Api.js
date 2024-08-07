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
		if (!error.response || !error.response.status) {
			const customError = {
				message: 'Wystąpił problem z połączeniem z serwerem. Spróbuj ponownie później',
				isConnectionError: true,
			}
			throw customError
		}
		if (error.response.status === 401) {
			// 401 - GDY KTOŚ NIE JEST ZALOGOWANY
			// 403 - GDY KTOŚ NIE MA UPRAWNIEŃ
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
		setAuthHeader(response.data.token)
		return response.data
	} catch (error) {
		console.log(error)
		throw error.response ? error.response.data : error
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
		return response.data
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const getUserData = async () => {
	try {
		if (Cookies.get('ACCESS_TOKEN')) {
			const response = await axiosClient.get('/verify_token')
			return response.data
		}
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const logout = async () => {
	try {
		await axiosClient.post('/logout')
		setAuthHeader(null)
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const checkPermission = async permission => {
	try {
		const response = await axiosClient.post('/checkPermission', { permission })
		return response.status === 200 ? true : false
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const activateAccount = async activation_code => {
	try {
		const response = await axiosClient.post('/activate-account', { activation_code })
		return response.data
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const resendVerificationEmail = async validation_code => {
	try {
		const response = await axiosClient.post('/resend-verification-email', {
			validation_code,
		})
		return response.data
	} catch (error) {
		console.log(error)
		throw error.response ? error.response.data : error
	}
}

export const checkVerificationCode = async validation_code => {
	try {
		const response = await axiosClient.post('/check-verification-code', {
			validation_code,
		})
		return response.data
	} catch (error) {
		console.log(error)
		throw error.response ? error.response.data : error
	}
}

// CHAT:

export const createNewConversation = async data => {
	try {
		const response = await axiosClient.post('/chat/start', data)
		return response.data
	} catch (error) {
		console.log(error)
		throw error.response ? error.response.data : error
	}
}

export const getConversations = async () => {
	try {
		const response = await axiosClient.get('/chat/conversations')
		return response.data
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const getMessages = async conversationId => {
	try {
		const response = await axiosClient.get(`/chat/conversations/${conversationId}/messages`)
		return response.data
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const sendMessage = async data => {
	try {
		const response = await axiosClient.post('/chat/messages', data)
		return response.data
	} catch (error) {
		console.log(error)
		throw error.response ? error.response.data : error
	}
}

export const markMessageAsDelivered = async messageId => {
	try {
		await axiosClient.put(`/chat/messages/${messageId}/delivered`)
	} catch (error) {
		console.error(error)
		throw error.response ? error.response.data : error
	}
}

export const markMessageAsRead = async messageId => {
	try {
		await axiosClient.put(`/chat/messages/${messageId}/read`)
	} catch (error) {
		console.error(error)
		throw error.response ? error.response.data : error
	}
}

export const getNewConversationData = async id => {
	try {
		const response = await axiosClient.get(`/chat/newConversation/data/${id}`)
		return response
	} catch (error) {
		console.log(error)
		throw error.response ? error.response.data : error
	}
}

export const getSuggestions = async keyword => {
	if (keyword.trim() === '') return
	try {
		const response = await axiosClient.get(`/suggestions/?keyword=${keyword}`)
		return response.data
	} catch (error) {
		console.log(error)
		throw error.response ? error.response.data : error
	}
}

export const getAnnouncementCategories = async () => {
	try {
		const response = await axiosClient.get('/categories')
		return response.data
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const searchAnnouncements = async (
	location,
	category,
	subcategory,
	keyword,
	page,
	filters,
	distance,
	amountFrom,
	amountTo,
	sortType
) => {
	try {
		const response = await axiosClient.get('/announcements/search', {
			params: {
				location: location,
				category: category,
				subcategory: subcategory,
				keyword: keyword,
				page: page,
				filters: filters,
				distance: distance,
				amountFrom: amountFrom,
				amountTo: amountTo,
				sortType: sortType,
			},
		})
		return response.data
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const indexAnnouncements = async (recentAnnouncementIds, userLatitude, userLongitude) => {
	try {
		const queryParams = {
			recentAnnouncementIds: recentAnnouncementIds.join(','),
		}

		// Dodaj współrzędne użytkownika do zapytania, jeśli są dostępne
		if (userLatitude && userLongitude) {
			queryParams.userLatitude = userLatitude
			queryParams.userLongitude = userLongitude
		}

		const response = await axiosClient.get('/announcements', {
			params: queryParams,
		})

		return response
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const getSubcategoryFilters = async (subcategory_id, context) => {
	try {
		const response = await axiosClient.get(`/subcategoriesFilters/${subcategory_id}/${context}`)
		return response.data
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const fetchUserActiveAnnouncements = async page => {
	try {
		const response = await axiosClient.get(`/profile/active-announcements?page=${page}`)
		return response.data
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const fetchUserCompletedAnnouncements = async page => {
	try {
		const response = await axiosClient.get(`/profile/completed-announcements?page=${page}`)
		return response.data
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export default axiosClient
