import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { startLoading, stopLoading } from '../redux/actions/loadingActions'

import { checkPermission } from '../services/Api'

const PermissionRoute = ({ children, permission }) => {
	const dispatch = useDispatch()
	const [isVerifying, setIsVerifying] = useState(true)
	const [access, setAccess] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			dispatch(startLoading(true))

			setIsVerifying(true)
			setAccess(false)
			try {
				const hasPermission = await checkPermission(permission)
				if (hasPermission) {
					setAccess(true)
				} else {
					setAccess(false)
				}
			} catch (error) {
				setAccess(false)
			} finally {
				setIsVerifying(false)
				dispatch(stopLoading())
			}
		}

		fetchData()
	}, [])

	if (isVerifying) {
		return false
	}

	if (access) {
		return children
	}

	return <Navigate to='/' />
}

export default PermissionRoute
