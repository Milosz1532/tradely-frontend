import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers/rootReducer'
import { setScreenSize } from '../actions/deviceActions'

const store = createStore(rootReducer, applyMiddleware(thunk))

const checkMediaQuery = () => {
	const newIsTabletOrMobile = window.matchMedia('(max-width: 767px)').matches
	store.dispatch(setScreenSize(newIsTabletOrMobile))
}

window.addEventListener('resize', checkMediaQuery)
checkMediaQuery()

export default store
