import axiosClient from './Api'

export const getAnnouncementCategories = async id => {
	try {
		const response = await axiosClient.get('/categories')
		return response.data
	} catch (error) {
		throw error.response.data
	}
}

export default {
	getAnnouncementCategories,
}
