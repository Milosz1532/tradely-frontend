import Cookies from 'js-cookie'

const initialState = {
	user: null,
	token: Cookies.get('ACCESS_TOKEN') || null,
	isAuthenticated: false,
	loading: false,
	verifying: true, // Dodaj nową flagę "verifying"
	error: null,
}

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'AUTH_INIT':
			return {
				...state,
				verifying: true, // Ustaw flagę "verifying" na true podczas inicjalizacji autoryzacji
			}
		case 'LOGIN_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				token: Cookies.get('ACCESS_TOKEN') || null,
				isAuthenticated: true,
				verifying: false, // Ustaw flagę "verifying" na false po zakończeniu autoryzacji

				loading: false,
				error: null,
			}
		case 'AUTH_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
				isAuthenticated: true,
				verifying: false, // Ustaw flagę "verifying" na false po zakończeniu autoryzacji
				loading: false,
				error: null,
			}
		case 'AUTH_FAILURE':
			return {
				...state,
				verifying: false, // Ustaw flagę "verifying" na false po zakończeniu autoryzacji (z błędem)
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
