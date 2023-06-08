// const AuthRoute = ({ children, mustByLogin, navigateTo }) => {
// 	const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
// 	const navigate = useNavigate()

// 	useEffect(() => {
// 		const checkAuth = async () => {
// 			try {
// 				await axiosClient.get('/verify_token')
// 			} catch (error) {
// 				console.log(`Navigate`)
// 				navigate(navigateTo ?? '/login', { replace: true })
// 			}
// 		}

// 		if (mustByLogin) {
// 			checkAuth()
// 		}
// 	}, [mustByLogin, navigateTo])

// 	if (!mustByLogin || isAuthenticated) {
// 		return children
// 	} else {
// 		console.log(`Nie ma uprawnień`)
// 		return <LoadingPage />
// 	}
// }

import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import axiosClient from '../helpers/axios-client'

import { useSelector, useDispatch } from 'react-redux'
import { initAuth } from '../redux/actions/authActions.js'

import LoadingPage from '../components/LoadingPage'

const AuthRoute = ({ children, mustByLogin, navigateTo }) => {
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
	const isVerifying = useSelector(state => state.auth.verifying) // Pobierz stan weryfikacji autoryzacji

	if (isVerifying) {
		return <LoadingPage /> // Wyświetl komponent ładowania podczas weryfikacji autoryzacji
	}

	if (mustByLogin && isAuthenticated) {
		return children
	} else if (mustByLogin && !isAuthenticated) {
		return <Navigate to={'/login'} />
	} else if (!mustByLogin && isAuthenticated) {
		return <Navigate to={'/'} />
	} else if (!mustByLogin && !isAuthenticated) {
		return children
	}
}

export default AuthRoute
