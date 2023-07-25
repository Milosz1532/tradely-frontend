import { Navigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { startLoading, stopLoading } from '../redux/actions/loadingActions'

const AuthRoute = ({ children, mustByLogin, navigateTo }) => {
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
	const isVerifying = useSelector(state => state.auth.verifying)
	const isLoading = useSelector(state => state.loading.isLoading)

	const dispatch = useDispatch()
	const location = useLocation()

	if (isVerifying) {
		dispatch(startLoading(true))
		return null
	} else {
		setTimeout(() => {
			dispatch(stopLoading())
		}, 200)
	}

	if (mustByLogin && isAuthenticated) {
		localStorage.getItem('redirectPath') && localStorage.removeItem('redirectPath')
		return children
	} else if (mustByLogin && !isAuthenticated) {
		if (location.pathname) {
			localStorage.setItem('redirectPath', location.pathname)
		}
		return <Navigate to='/login' />
	} else if (!mustByLogin && isAuthenticated) {
		return <Navigate to={navigateTo || '/'} />
	} else if (!mustByLogin && !isAuthenticated) {
		return children
	}

	return false
}

export default AuthRoute
