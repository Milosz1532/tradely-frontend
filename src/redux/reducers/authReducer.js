const initialState = {
	user: null,
	isAuthenticated: false,
	loading: false,
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
		case 'LOGIN_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				isAuthenticated: true,
				verifying: false, 

				loading: false,
				error: null,
			}
		case 'AUTH_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				isAuthenticated: true,
				verifying: false, 
				loading: false,
				error: null,
			}
		case 'AUTH_FAILURE':
			return {
				...state,
				verifying: false, 
				error: action.payload.error,
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
