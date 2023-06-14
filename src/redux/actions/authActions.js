import {
	AUTH_INIT,
	AUTH_SUCCESS,
	AUTH_FAILURE,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	SIGNUP_SUCCESS,
	SIGNUP_FAILURE,
	LOGOUT,
} from './actionTypes'

import * as Api from '../../services/Api'

export const initAuth = () => {
	return async dispatch => {
		try {
			const user = await Api.getUserData()
			dispatch({ type: AUTH_INIT })
			if (user) {
				dispatch({ type: AUTH_SUCCESS, payload: { user } })
			} else {
				dispatch({ type: AUTH_FAILURE, payload: { error } })
			}
		} catch (error) {
			dispatch({ type: AUTH_FAILURE, payload: { error } })
		}
	}
}

export const login = (email, password) => dispatch => {
	return Api.login(email, password).then(
		response => {
			dispatch({
				type: LOGIN_SUCCESS,
				payload: { user: response },
			})

			return Promise.resolve()
		},
		error => {
			dispatch({
				type: LOGIN_FAILURE,
				payload: { error: error },
			})

			return Promise.reject(error)
		}
	)
}

export const signup = (login, email, password) => dispatch => {
	return Api.signup(login, email, password).then(
		response => {
			dispatch({
				type: SIGNUP_SUCCESS,
				payload: { user: response },
			})

			return Promise.resolve()
		},
		error => {
			dispatch({
				type: SIGNUP_FAILURE,
				payload: { error: error },
			})

			return Promise.reject(error)
		}
	)
}

export const logout = () => {
	return dispatch => {
		Api.logout()
		dispatch({ type: LOGOUT })
	}
}
