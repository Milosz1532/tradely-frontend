import React from 'react'
import ReactDOM from 'react-dom/client'

import './assets/styles/index.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

// FONT AWESOME ICONS
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import { library } from '@fortawesome/fontawesome-svg-core'
library.add(fas, far)

import Skeleton from 'react-loading-skeleton'

import 'react-loading-skeleton/dist/skeleton.css'

import App from './App'

import { Provider } from 'react-redux'
import store from './redux/store/store'

// document.body.style = 'background: #f4f8fc;'
document.body.style = 'background: #F3F4F5;'

ReactDOM.createRoot(document.getElementById('root')).render(
	<div className='App'>
		<React.StrictMode>
			<Provider store={store}>
				<App />
			</Provider>
		</React.StrictMode>
	</div>
)
