import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axiosClient from '../helpers/axios-client'

const AuthRoute = ({ children, mustByLogin }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isCheckingAuth, setIsCheckingAuth] = useState(true)

	useEffect(() => {
		const verifyToken = async () => {
			try {
				const response = await axiosClient.get('/verify_token')
				if (response.status === 200) {
					setIsAuthenticated(true)
				}
			} catch (error) {
				setIsAuthenticated(false)
			} finally {
				setIsCheckingAuth(false)
			}
		}

		if (mustByLogin) {
			verifyToken()
		} else {
			setIsAuthenticated(true)
			setIsCheckingAuth(false)
		}
	}, [mustByLogin])

	if (mustByLogin && !isAuthenticated) {
		return <Navigate to='/login' />
	} else {
		return children
	}
}

export default AuthRoute
