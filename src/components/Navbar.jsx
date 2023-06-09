import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../assets/styles/Header.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// TEMP //
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/actions/authActions'
// TEMP

export default function Navbar() {

	const dispatch = useDispatch();

	// TEMP
	const handleLogout = () => {
		dispatch(logout());

	}
	//TEMP

	return (
		<header className='container mt-0 pt-2'>
			<div className='logo'>
				<Link to='/'>
					<h2>Tradely</h2>
				</Link>
			</div>
			<div className='header-right-section'>
				<i>
					<FontAwesomeIcon icon='fa-regular fa-heart' />
				</i>
				<i>
					<FontAwesomeIcon icon='fa-regular fa-comments' />
				</i>
				<i>
					<FontAwesomeIcon icon='fa-regular fa-bell' />
				</i>

				<div className='header-right-section-account'>
					<span onClick={handleLogout}>
						Moje konto{' '}
						<i>
							<FontAwesomeIcon icon='fa-solid fa-chevron-down' />
						</i>
					</span>
					<NavLink to='/createAnnouncement'>
						<button className='color-button-design mb-2'>Dodaj ogłoszenie</button>
					</NavLink>
				</div>
			</div>
		</header>
	)
}
