// import { LOGIN_SUCCESS, LOGOUT } from './actionTypes'
import * as Api from '../../services/Api'

export const initAuth = () => {
	return async dispatch => {
		try {
			const user = await Api.getUserData()

			dispatch({ type: 'AUTH_INIT' })

			dispatch({ type: 'AUTH_SUCCESS', payload: { user: user[0] } })
			return true
		} catch (error) {
			dispatch({ type: 'AUTH_FAILURE', payload: { error } })
			return false
		}
	}
}

export const login = (email, password) => {
	return async dispatch => {
		try {
			const user = await Api.login(email, password)
			dispatch({ type: 'LOGIN_SUCCESS', payload: { user: user } })
		} catch (error) {
			dispatch({ type: 'LOGIN_FAILURE', payload: { error } })
		}
	}
}

export const logout = () => {
	return async dispatch => {
		try {
			await Api.logout()
			dispatch({ type: 'LOGOUT_SUCCESS' })
		} catch (error) {
			dispatch({ type: 'LOGOUT_FAILURE', payload: { error } })
		}
	}
}
