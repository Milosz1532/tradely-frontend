import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const StateContext = createContext({
	currentUser: null,
	token: null,
	notification: null,
	setUser: () => {},
	setToken: () => {},
})

export const ContextProvider = ({ children }) => {
	const [user, setUser] = useState({})
	const [token, setToken] = useState(Cookies.get('ACCESS_TOKEN'))
	const [notification, _setNotification] = useState('')

	const setNotification = message => {
		_setNotification(message)
		setTimeout(() => {
			setNotification('')
		}, 5000)
	}

	useEffect(() => {
		const initialToken = Cookies.get('ACCESS_TOKEN')
		if (initialToken) {
			setToken(initialToken)
		}
	}, [])

	const updateToken = newToken => {
		setToken(newToken)
		if (newToken) {
			Cookies.set('ACCESS_TOKEN', newToken, { expires: 7 })
		} else {
			Cookies.remove('ACCESS_TOKEN')
		}
	}

	return (
		<StateContext.Provider
			value={{
				user,
				token,
				setUser,
				setToken: updateToken,
				notification,
				setNotification,
			}}>
			{children}
		</StateContext.Provider>
	)
}

export const useStateContext = () => useContext(StateContext)
