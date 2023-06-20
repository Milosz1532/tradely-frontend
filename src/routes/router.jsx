import { Navigate, createBrowserRouter, useLocation } from 'react-router-dom'

import DefaultLayout from '../Layouts/DefaultLayout'
import ProfileLayout from '../Layouts/ProfileLayout'

// Profile
import Profile from '../views/profile/Profile'
import ProfileAnnouncements from '../views/profile/ProfileAnnouncements'
//End Profile

import NotFound from '../views/NotFound'
import HomePage from '../views/HomePage'
import LoginPage from '../views/LoginPage'
import PreviewAnnouncement from '../views/PreviewAnnouncement'
import CreateAnnouncement from '../views/CreateAnnouncement'
import SignupPage from '../views/SignupPage'
import SearchAnnouncements from '../views/SearchAnnouncements'

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
			{
				path: '/announcements/:location/:category/:keyword?',
				element: <SearchAnnouncements />,
			},
		],
	},
	{
		path: '/account',
		element: <ProfileLayout />,
		children: [
			{
				path: '/account/profile',
				element: <Profile />,
			},
			{
				path: '/account/announcements',
				element: <ProfileAnnouncements />,
			},
		],
	},
	{
		path: '/login',
		element: (
			<AuthRoute mustByLogin={false} navigateTo={'/'}>
				<LoginPage />
			</AuthRoute>
		),
	},
	{
		path: '/signup',
		// element: <SignupPage />,
		element: (
			<AuthRoute mustByLogin={false} navigateTo={'/'}>
				<SignupPage />
			</AuthRoute>
		),
	},

	{
		path: '*',
		element: <NotFound />,
	},
])

export default router
