import { useEffect, useState } from 'react'

import { RouterProvider } from 'react-router-dom'
import router from './routes/router.jsx'

import { useDispatch } from 'react-redux'
import { initAuth, fetchFavoriteAds } from './redux/actions/authActions.js'

import { useSelector } from 'react-redux'

import LoadingPage from './components/Layout/LoadingPage'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
	const dispatch = useDispatch()
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
	const isLoading = useSelector(state => state.loading.isLoading)
	const loadingFullSize = useSelector(state => state.loading.fullSize)
	const [isShowingLoading, setIsShowingLoading] = useState(false)

	useEffect(() => {
		if (!isAuthenticated) {
			dispatch(initAuth())
		}
	}, [dispatch])

	useEffect(() => {
		if (isAuthenticated) {
			dispatch(fetchFavoriteAds())
		}
	}, [dispatch, isAuthenticated])

	useEffect(() => {
		if (isLoading) {
			setIsShowingLoading(true)
		} else if (isLoading === false) {
			setIsShowingLoading(true)
			setTimeout(() => {
				setIsShowingLoading(false)
			}, 1000)
		}
	}, [isLoading])

	return (
		<>
			{isShowingLoading && <LoadingPage fullSize={loadingFullSize} />}
			<RouterProvider router={router} />
			<ToastContainer />
		</>
	)
}
