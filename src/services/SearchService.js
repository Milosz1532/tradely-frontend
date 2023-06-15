import axiosClient from './Api'

export const searchAnnouncements = async (location, category, keyword, page) => {
	try {
		const response = await axiosClient.get('/announcements/search', {
			params: {
				location: location,
				category: category,
				keyword: keyword,
				page: page,
			},
		})
		return response.data
	} catch (error) {
		throw error.response.data
	}
}

export const searchCategories = async () => {
	try {
		const response = await axiosClient.get('/categories')
		return response.data
	} catch (error) {
		throw error.response.data
	}
}

export const indexAnnouncements = async () => {
	try {
		const response = await axiosClient.get('/announcements')
		return response
	} catch (error) {
		throw error.response.data
	}
}

export default {
	searchAnnouncements,
	searchCategories,
	indexAnnouncements,
}
