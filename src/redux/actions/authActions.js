import { LOGIN_SUCCESS, LOGOUT } from './actionTypes'

export const loginSuccess = token => {
	return {
		type: LOGIN_SUCCESS,
		payload: token,
	}
}

export const logout = () => {
	return {
		type: LOGOUT,
	}
}
