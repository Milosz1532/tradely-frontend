import axiosClient from './Api'

export const likeAnnouncement = async id => {
	try {
		const data = {
			id,
		}
		const response = await axiosClient.post('/announcement/like', data)
		console.log(response.data)
		return response.data
	} catch (error) {
		throw error.response.data
	}
}

export const getAnnouncementCategories = async id => {
	try {
		const response = await axiosClient.get('/categories')
		return response.data
	} catch (error) {
		throw error.response.data
	}
}

export default {
	likeAnnouncement,
	getAnnouncementCategories,
}
