import { useEffect } from 'react'

import { RouterProvider } from 'react-router-dom'
import router from './routes/router.jsx'

import { useDispatch } from 'react-redux'
import { initAuth } from './redux/actions/authActions.js'

export default function App() {
	const dispatch = useDispatch()

	useEffect(() => {
		console.log(`Test`)
		dispatch(initAuth())
	})

	return <RouterProvider router={router} />
}
