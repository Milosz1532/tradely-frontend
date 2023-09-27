// reducers.js

import { SET_SCREEN_SIZE } from '../actions/actionTypes'

const initialState = {
	isTabletOrMobile: false,
}

const deviceReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_SCREEN_SIZE:
			return {
				...state,
				isTabletOrMobile: action.payload,
			}
		default:
			return state
	}
}

export default deviceReducer
