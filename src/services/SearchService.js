import axiosClient from './Api'

export const searchAnnouncements = async (location, category, keyword) => {
	try {
		const response = await axiosClient.get('/announcements/search', {
			params: {
				location: location,
				category: category,
				keyword: keyword,
			},
		})
		return response.data
	} catch (error) {
		throw error.response.data
	}
}

export default {
	searchAnnouncements,
}
