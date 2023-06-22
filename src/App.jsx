import { useEffect } from 'react'

import { RouterProvider } from 'react-router-dom'
import router from './routes/router.jsx'

import { useDispatch } from 'react-redux'
import { initAuth } from './redux/actions/authActions.js'

import { useSelector } from 'react-redux'

import LoadingPage from './components/Layout/LoadingPage'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
	const dispatch = useDispatch()
	const isLoading = useSelector(state => state.loading.isLoading)
	const loadingFullSize = useSelector(state => state.loading.fullSize)

	useEffect(() => {
		dispatch(initAuth())
	})

	// return <RouterProvider router={router} />
	return (
		<>
			{isLoading && <LoadingPage fullSize={loadingFullSize} />}
			<RouterProvider router={router} />
			<ToastContainer />
		</>
	)
}
