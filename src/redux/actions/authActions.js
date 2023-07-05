import { toast } from 'react-toastify'

import {
	AUTH_INIT,
	AUTH_SUCCESS,
	AUTH_FAILURE,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	SIGNUP_SUCCESS,
	SIGNUP_FAILURE,
	LOGOUT,
	SET_FAVORITE_ADS,
	FETCH_FAVORITE_ADS_FAILURE,
	ADD_TO_FAVORITES,
	REMOVE_FROM_FAVORITES,
} from './actionTypes'

import * as Api from '../../services/Api'
import { userFavoritesAnnouncements, likeAnnouncement } from '../../services/ProfileService'

export const initAuth = () => {
	return async dispatch => {
		dispatch({ type: AUTH_INIT })
		try {
			const user = await Api.getUserData()
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
			console.log(`Tutaj`)
			console.log(error)
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
			})
			return Promise.resolve(response)
		},
		error => {
			console.log(error)
			dispatch({
				type: SIGNUP_FAILURE,
				payload: { error: error },
			})

			return Promise.reject(error)
		}
	)
}

export const fetchFavoriteAds = () => {
	return async dispatch => {
		try {
			const favoriteAds = await userFavoritesAnnouncements()

			dispatch({ type: SET_FAVORITE_ADS, payload: { favoriteAds } })
		} catch (error) {
			dispatch({ type: FETCH_FAVORITE_ADS_FAILURE, payload: { error } })
		}
	}
}

export const manageFavoritesAnnouncements = announcement => {
	return async dispatch => {
		try {
			const result = await likeAnnouncement(announcement.id)

			if (result.success && result.status === 1) {
				dispatch({ type: ADD_TO_FAVORITES, payload: { announcement } })
				toast.success('Ogłoszenie dodane do ulubionych', { autoClose: 1500 })
			} else if (result.success && result.status === 0) {
				dispatch({ type: REMOVE_FROM_FAVORITES, payload: { announcement } })
				toast.success('Ogłoszenie usunięte z ulubionych', { autoClose: 1500 })
			}
		} catch (error) {
			console.log('Nie udało się usunąć ogłoszenia z ulubionych', error)
			toast.error('Wystąpił błąd')
		}
	}
}

export const logout = () => {
	return dispatch => {
		Api.logout()
		dispatch({ type: LOGOUT })
	}
}
