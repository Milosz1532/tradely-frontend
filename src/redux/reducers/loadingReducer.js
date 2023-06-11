import { START_LOADING_PAGE, STOP_LOADING_PAGE } from '../actions/actionTypes'

const initialState = {
	isLoading: false,
	fullSize: false,
}

const loadingReducer = (state = initialState, action) => {
	switch (action.type) {
		case START_LOADING_PAGE:
			console.log(`1221`)
			return {
				...state,
				isLoading: true,
				fullSize: action.payload,
			}
		case STOP_LOADING_PAGE:
			console.log(`object`)
			return {
				...state,
				isLoading: false,
				fullSize: false,
			}
		default:
			return state
	}
}

export default loadingReducer