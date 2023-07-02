const initialState = {
	user: null,
	isAuthenticated: false,
	verifying: true,
	error: null,
	favoriteAds: [],
	permissions: false,
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
				user: action.payload.user.user,
				isAuthenticated: true,
				verifying: false,
				error: null,
				permissions: action.payload.user.permissions,
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
				user: action.payload.user.user,
				isAuthenticated: true,
				verifying: false,
				error: null,
				permissions: action.payload.user.permissions,
			}

		case 'LOGIN_FAILURE':
			return {
				...state,
				user: null,
				isAuthenticated: false,
				error: action.payload.error,
				permissions: null,
			}
		case 'SIGNUP_SUCCESS':
			return {
				...state,
				// user: action.payload.user,
				// isAuthenticated: true,
				// verifying: false,
				// error: null,
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

		case 'SET_FAVORITE_ADS':
			return {
				...state,
				favoriteAds: action.payload.favoriteAds,
			}

		case 'FETCH_FAVORITE_ADS_FAILURE':
			return {
				...state,
				error: action.payload.error,
			}
		case 'ADD_TO_FAVORITES':
			return {
				...state,
				favoriteAds: [...state.favoriteAds, action.payload.announcement],
			}
		case 'REMOVE_FROM_FAVORITES':
			return {
				...state,
				favoriteAds: state.favoriteAds.filter(ad => ad.id !== action.payload.announcement.id),
			}

		default:
			return state
	}
}

export default authReducer
