import axiosClient from './Api'

export const userAnnouncements = async () => {
	try {
		const response = await axiosClient.get('/profile/announcements')
		return response.data
	} catch (error) {
		throw error.response.data
	}
}

export default {
	userAnnouncements,
}