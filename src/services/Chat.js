import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import Cookies from 'js-cookie'

window.Pusher = Pusher

window.Echo = new Echo({
	broadcaster: 'pusher',
	cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
	key: import.meta.env.VITE_PUSHER_APP_KEY,
	wsHost: window.location.hostname,
	wsPort: 6001,
	forceTLS: false,
	disableStats: true,
	enabledTransports: ['ws', 'wss'],
	authEndpoint: import.meta.env.VITE_API_BASE_URL + '/broadcasting/auth',
	auth: {
		headers: {
			Authorization: `Bearer ${Cookies.get('ACCESS_TOKEN')}`,
		},
	},
})
