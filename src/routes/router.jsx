import { Navigate, createBrowserRouter, useLocation } from 'react-router-dom'

import DefaultLayout from '../Layouts/DefaultLayout'
import ProfileLayout from '../Layouts/ProfileLayout'

// Profile
import Profile from '../views/profile/Profile'
import ProfileAnnouncements from '../views/profile/ProfileAnnouncements'
import Favorites from '../views/profile/Favorites'
//End Profile

import NotFound from '../views/NotFound'
import HomePage from '../views/HomePage'
import LoginPage from '../views/Auth/LoginPage'
import PreviewAnnouncement from '../views/Announcements/PreviewAnnouncement'
import CreateAnnouncement from '../views/Announcements/CreateAnnouncement'
import SignupPage from '../views/Auth/SignupPage'
import SearchAnnouncements from '../views/Announcements/SearchAnnouncements'

import AuthRoute from './AuthRoute'
import InactiveAds from '../views/profile/PermissionsPages/InactiveAds'

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
		element: (
			<AuthRoute mustByLogin={true}>
				<ProfileLayout />
			</AuthRoute>
		),
		children: [
			{
				path: '/account/profile',
				element: <Profile />,
			},
			{
				path: '/account/announcements',
				element: <ProfileAnnouncements />,
			},
			{
				path: '/account/favorites',
				element: <Favorites />,
			},
			{
				path: '/account/InactiveAds',
				element: <InactiveAds />,
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
