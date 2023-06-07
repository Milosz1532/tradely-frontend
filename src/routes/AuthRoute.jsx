import React from 'react'
import { Navigate } from 'react-router-dom'

const AuthRoute = ({ children }) => {
	const isAuthenticated = false // Przykładowa funkcja pobierająca informacje o autoryzacji

	if (!isAuthenticated) {
		return <Navigate to='/login' /> // Przekierowanie do strony logowania w przypadku braku autoryzacji
	}

	return children
}

export default AuthRoute
