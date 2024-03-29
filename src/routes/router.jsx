import { createBrowserRouter } from 'react-router-dom'

import DefaultLayout from '../Layouts/DefaultLayout'
import ProfileLayout from '../Layouts/ProfileLayout'

// Profile
import ProfileActiveAnnouncements from '../views/profile/ProfileActiveAnnouncements'
import ProfileCompletedAnnouncements from '../views/profile/ProfileCompletedAnnouncements'
import Favorites from '../views/profile/Favorites'
import EditAccount from '../views/profile/EditAccount'
import ChatPage from '../views/profile/ChatPage'
//End Profile

// PERMISSION ROUTES //
import InactiveAds from '../views/profile/PermissionsPages/InactiveAds'
// END PERMISSION ROUTES //

import NotFound from '../views/NotFound'
import HomePage from '../views/HomePage'
import LoginPage from '../views/Auth/LoginPage'
import PreviewAnnouncement from '../views/Announcements/PreviewAnnouncement'
import CreateAnnouncement from '../views/Announcements/CreateAnnouncement'
import SignupPage from '../views/Auth/SignupPage'
import SearchAnnouncements from '../views/Announcements/SearchAnnouncements'

import AuthRoute from './AuthRoute'
import PermissionRoute from './PermissionRoute'
import ActivateAccount from '../views/Auth/ActivateAccount'
import ConfirmEmailPage from '../views/Auth/ConfirmEmailPage'

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
				path: '/announcements/:location/:category/:subcategory?/:keyword?',
				element: <SearchAnnouncements />,
			},
			{
				path: '/account/chat',
				element: (
					<AuthRoute mustByLogin={true}>
						<ChatPage />
					</AuthRoute>
				),
			},
			{
				path: '/account/chat/:conversation_number',
				element: (
					<AuthRoute mustByLogin={true}>
						<ChatPage />
					</AuthRoute>
				),
			},
			{
				path: '/account/chat/new/:announcement_id',
				element: (
					<AuthRoute mustByLogin={true}>
						<ChatPage />
					</AuthRoute>
				),
			},
		],
	},
	{
		path: '/account',
		element: (
			<AuthRoute mustByLogin={true} path={'/account'}>
				<ProfileLayout />
			</AuthRoute>
		),
		children: [
			{
				path: '/account/active-announcements',
				element: <ProfileActiveAnnouncements />,
			},
			{
				path: '/account/completed-announcements',
				element: <ProfileCompletedAnnouncements />,
			},

			{
				path: '/account/favorites-announcements',
				element: <Favorites />,
			},
			{
				path: '/account/InactiveAds',
				element: (
					<PermissionRoute permission='ANNOUNCEMENT.EDIT'>
						<InactiveAds />
					</PermissionRoute>
				),
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
		element: (
			<AuthRoute mustByLogin={false} navigateTo={'/'}>
				<SignupPage />
			</AuthRoute>
		),
	},
	{
		path: '/activateAccount',
		element: (
			<AuthRoute mustByLogin={false} navigateTo={'/'}>
				<ActivateAccount />
			</AuthRoute>
		),
	},
	{
		path: '/confirmEmail/:verificationCode',
		element: (
			<AuthRoute mustByLogin={false} navigateTo={'/'}>
				<ConfirmEmailPage />
			</AuthRoute>
		),
	},

	{
		path: '*',
		element: <NotFound />,
	},
])

export default router
