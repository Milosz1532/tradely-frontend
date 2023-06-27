import axiosClient from './Api'

export const userAnnouncements = async () => {
	try {
		const response = await axiosClient.get('/profile/announcements')
		return response.data
	} catch (error) {
		throw error.response.data
	}
}

export const userFavoritesAnnouncements = async () => {
	try {
		const response = await axiosClient.get('/profile/favoriteAnnouncements')
		return response.data.data
	} catch (error) {
		throw error.response.data
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
		throw error.response.data
	}
}

export default {
	userAnnouncements,
	userFavoritesAnnouncements,
	likeAnnouncement,
}
