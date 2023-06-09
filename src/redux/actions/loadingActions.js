import { START_LOADING_PAGE, STOP_LOADING_PAGE } from './actionTypes'

export const startLoading = (fullSize = false) => {
	return {
		type: START_LOADING_PAGE,
		payload: fullSize,
	}
}

export const stopLoading = () => {
	return {
		type: STOP_LOADING_PAGE,
	}
}
