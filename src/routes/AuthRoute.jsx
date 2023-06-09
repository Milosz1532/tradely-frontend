import { Navigate } from 'react-router-dom'

import { useSelector } from 'react-redux'

import LoadingPage from '../components/LoadingPage'

const AuthRoute = ({ children, mustByLogin, navigateTo }) => {
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
	const isVerifying = useSelector(state => state.auth.verifying)

	if (isVerifying) {
		return <LoadingPage />
	}

	if (mustByLogin && isAuthenticated) {
		return children
	} else if (mustByLogin && !isAuthenticated) {
		return <Navigate to={'/login'} />
	} else if (!mustByLogin && isAuthenticated) {
		return <Navigate to={navigateTo ? navigateTo : '/'} />
	} else if (!mustByLogin && !isAuthenticated) {
		return children
	}
}

export default AuthRoute
