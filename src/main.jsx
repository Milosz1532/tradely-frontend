import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// FONT AWESOME ICONS
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import { library } from '@fortawesome/fontawesome-svg-core'
library.add(fas, far)

import Skeleton from 'react-loading-skeleton'

import 'react-loading-skeleton/dist/skeleton.css'

import { RouterProvider } from 'react-router-dom'
import router from './routes/router.jsx'
import { Provider } from 'react-redux'
import store from './redux/store/store'

ReactDOM.createRoot(document.getElementById('root')).render(
	<div className='App'>
		<React.StrictMode>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</React.StrictMode>
	</div>
)
