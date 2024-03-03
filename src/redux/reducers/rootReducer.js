// rootReducer.js

import { combineReducers } from 'redux'
import authReducer from './authReducer'
import loadingReducer from './loadingReducer'
import deviceReducer from './deviceReducer'

const rootReducer = combineReducers({
	auth: authReducer,
	loading: loadingReducer,
	device: deviceReducer,
	// next reducer
})

export default rootReducer
