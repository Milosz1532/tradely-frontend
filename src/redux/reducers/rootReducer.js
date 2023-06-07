// rootReducer.js

import { combineReducers } from 'redux'
import authReducer from './authReducer'

const rootReducer = combineReducers({
	auth: authReducer,
	// next reducer
})

export default rootReducer
