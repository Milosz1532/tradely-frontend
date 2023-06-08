// import { LOGIN_SUCCESS, LOGOUT } from './actionTypes'
import * as Api from '../../services/Api'

export const initAuth = () => {
	return async dispatch => {
		try {
			const user = await Api.getUserData()

			dispatch({ type: 'AUTH_INIT' })


			// Ustaw autoryzację jako zakończoną sukcesem i przekaż dane użytkownika
			dispatch({ type: 'AUTH_SUCCESS', payload: { user: user[0] } })
			console.log(`UDAŁO SIĘ WCZYTAĆ DANE`)
			return true
		} catch (error) {
			dispatch({ type: 'AUTH_FAILURE', payload: { error } })
			console.log(`NIE UDAŁO SIĘ WCZYTAĆ DANYCH`)
			return false
		}
	}
}

export const login = (email, password) => {
	// Wywołanie żądania logowania i zapisanie tokenu oraz danych użytkownika
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
	// Wywołanie żądania wylogowania i wyczyszczenie tokenu oraz danych użytkownika
	return async dispatch => {
		try {
			await Api.logout()
			dispatch({ type: 'LOGOUT_SUCCESS' })
		} catch (error) {
			dispatch({ type: 'LOGOUT_FAILURE', payload: { error } })
		}
	}
}
