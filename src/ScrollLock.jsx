import { useEffect } from 'react'

const ScrollLock = () => {
	useEffect(() => {
		document.body.classList.add('scroll-lock')
		return () => {
			document.body.classList.remove('scroll-lock')
		}
	}, [])

	return null
}

export default ScrollLock
