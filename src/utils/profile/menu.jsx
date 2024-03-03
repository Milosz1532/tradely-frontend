import { permissions } from '../Permissions'

const menuItems = [
	{
		category: 'Ogłoszenia',
		items: [
			{
				id: 1,
				name: 'Aktywne ogłoszenia',
				link: '/account/active-announcements',
			},
			{
				id: 2,
				name: 'Zakończone ogłoszenia',
				link: '/account/completed-announcements',
			},
			{
				id: 3,
				name: 'Polubione ogłoszenia',
				link: '/account/favorites-announcements',
			},
		],
	},
	{
		category: 'Moje konto',
		items: [
			{
				id: 5,
				name: 'Informacje o mnie',
				link: '',
			},
			{
				id: 6,
				name: 'Moje oceny',
				link: '',
			},
			{
				id: 7,
				name: 'Wystawione oceny',
				link: '/account/chat',
			},
			{
				id: 8,
				name: 'Tradely +',
				link: '/account/chat',
			},
		],
	},
	{
		category: 'Administracja',
		items: [
			{
				id: 9,
				name: 'Oczekujące ogłoszenia',
				link: '/account/InactiveAds',
				permissions: permissions.ANNOUNCEMENT.EDIT,
			},
			{
				id: 10,
				name: 'Zgłoszenia',
				link: '',
				permissions: permissions.ANNOUNCEMENT.EDIT,
			},
		],
	},
]

export default menuItems
