import { permissions } from '../Permissions'

const menuItems = [
	{
		category: 'Profil',
		items: [
			{
				id: 1,
				name: 'Profil',
				link: '/account/profile',
				icon: 'fa-regular fa-user',
			},
			{
				id: 2,
				name: 'Edycja konta',
				link: '/account/edit',
				icon: 'fa-regular fa-pen-to-square',
			},
			{
				id: 3,
				name: 'Moje oceny',
				link: '',
				icon: 'fa-regular fa-star',
			},
			{
				id: 4,
				name: 'Wystawione oceny',
				link: '',
				icon: 'fa-regular fa-smile',
			},
		],
	},
	{
		category: 'Ogłoszenia',
		items: [
			{
				id: 5,
				name: 'Obserwowane',
				link: '/account/favorites',
				icon: 'fa-regular fa-heart',
			},
			{
				id: 6,
				name: 'Moje ogłoszenia',
				link: '/account/announcements',
				icon: 'fa-solid fa-bullhorn',
			},
			{
				id: 7,
				name: 'Wiadomości',
				link: '/account/chat',
				icon: 'fa-regular fa-comments',
			},
		],
	},
	{
		category: 'Administracja',
		items: [
			{
				id: 8,
				name: 'Oczekujące ogłoszenia',
				link: '/account/InactiveAds',
				icon: 'fa-regular fa-heart',
				permissions: permissions.ANNOUNCEMENT.EDIT,
			},
			{
				id: 9,
				name: 'Zgłoszenia',
				link: '',
				icon: 'fa-regular fa-comments',
				permissions: permissions.ANNOUNCEMENT.EDIT,
			},
		],
	},
]

export default menuItems
