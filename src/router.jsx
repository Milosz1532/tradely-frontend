import { Navigate, createBrowserRouter, useLocation } from 'react-router-dom'
import NotFound from './views/NotFound'
import DefaultLayout from './Layouts/DefaultLayout'
import HomePage from './views/HomePage'
import PreviewAnnouncement from './views/PreviewAnnouncement'
import CreateAnnouncement from './views/CreateAnnouncement'

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
				element: <CreateAnnouncement />,
			},
			{
				path: '/announcement/:id',
				element: <PreviewAnnouncement />,
			},
		],
	},

	{
		path: '*',
		element: <NotFound />,
	},
])

export default router
