import { START_LOADING_PAGE, STOP_LOADING_PAGE } from '../actions/actionTypes'

const initialState = {
	isLoading: null,
	fullSize: false,
}

const loadingReducer = (state = initialState, action) => {
	switch (action.type) {
		case START_LOADING_PAGE:
			return {
				...state,
				isLoading: true,
				fullSize: action.payload,
			}
		case STOP_LOADING_PAGE:
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
