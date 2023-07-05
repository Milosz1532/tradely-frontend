import axiosClient from './Api'

export const userAnnouncements = async () => {
	try {
		const response = await axiosClient.get('/profile/announcements')
		return response.data
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const userFavoritesAnnouncements = async () => {
	try {
		const response = await axiosClient.get('/profile/favoriteAnnouncements')
		return response.data.data
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const likeAnnouncement = async id => {
	try {
		const data = {
			id,
		}
		const response = await axiosClient.post('/announcement/like', data)
		return response.data
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const fetchProfileData = async () => {
	try {
		const response = await axiosClient.get('/profile/data')
		return response.data
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export const updateProfileData = async data => {
	try {
		const response = axiosClient.put('/profile/update/personal', data)
		return response
	} catch (error) {
		throw error.response ? error.response.data : error
	}
}

export default {
	userAnnouncements,
	userFavoritesAnnouncements,
	likeAnnouncement,
	fetchProfileData,
}
