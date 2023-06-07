const initialState = {
	user: null,
	isAuthenticated: false,
	loading: false,
	error: null,
}

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGIN_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				isAuthenticated: true,
				loading: false,
				error: null,
			}
		case 'AUTH_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				isAuthenticated: true,
				loading: false,
				error: null,
			}

		case 'LOGIN_FAILURE':
			return {
				...state,
				user: null,
				isAuthenticated: false,
				loading: false,
				error: action.payload.error,
			}
		case 'LOGOUT_SUCCESS':
			return {
				...state,
				user: null,
				isAuthenticated: false,
				loading: false,
				error: null,
			}
		case 'LOGOUT_FAILURE':
			return {
				...state,
				error: action.payload.error,
			}
		default:
			return state
	}
}

export default authReducer
