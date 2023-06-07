import { Navigate, createBrowserRouter, useLocation } from 'react-router-dom'

import NotFound from '../views/NotFound'
import DefaultLayout from '../Layouts/DefaultLayout'
import HomePage from '../views/HomePage'
import LoginPage from '../views/LoginPage'
import PreviewAnnouncement from '../views/PreviewAnnouncement'
import CreateAnnouncement from '../views/CreateAnnouncement'
import SignupPage from '../views/SignupPage'

import AuthRoute from './AuthRoute'

const router = createBrowserRouter([
	{
		path: '/',
		element: <DefaultLayout />,
		children: [
			{
				path: '/',
				element: <HomePage />,
			},
			{
				path: '/createAnnouncement',
				element: (
					<AuthRoute mustByLogin={true}>
						<CreateAnnouncement />
					</AuthRoute>
				),
			},
			{
				path: '/announcement/:id',
				element: <PreviewAnnouncement />,
			},
		],
	},
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/signup',
		element: <SignupPage />,
	},

	{
		path: '*',
		element: <NotFound />,
	},
])

export default router
