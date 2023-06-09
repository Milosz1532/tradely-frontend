const initialState = {
	user: null,
	isAuthenticated: false,
	verifying: true,
	error: null,
}

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'AUTH_INIT':
			return {
				...state,
				verifying: true,
			}
		case 'AUTH_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				isAuthenticated: true,
				verifying: false,
				error: null,
			}
		case 'AUTH_FAILURE':
			return {
				...state,
				verifying: false,
				error: action.payload.error,
			}
		case 'LOGIN_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				isAuthenticated: true,
				verifying: false,
				error: null,
			}

		case 'LOGIN_FAILURE':
			return {
				...state,
				user: null,
				isAuthenticated: false,
				error: action.payload.error,
			}
		case 'SIGNUP_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				isAuthenticated: true,
				verifying: false,
				error: null,
			}

		case 'SIGNUP_FAILURE':
			return {
				...state,
				user: null,
				isAuthenticated: false,
				error: action.payload.error,
			}
		case 'LOGOUT':
			return {
				...state,
				user: null,
				isAuthenticated: false,
				error: null,
			}
		default:
			return state
	}
}

export default authReducer
