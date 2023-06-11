import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../assets/styles/Header.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// TEMP //
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { logout } from '../redux/actions/authActions'
// TEMP

export default function Navbar() {
	const dispatch = useDispatch()
	const [showUserProfile, setShowUserProfile] = useState(false)
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

	const handleProfileMenu = () => {
		setShowUserProfile(prevState => !prevState)
	}

	const handleLogoutUser = () => {
		dispatch(logout())
		toast.success('Konto zarejestrowane pomyślnie!')
	}

	return (
		<header>
			<article className='container mt-0 pt-2'>
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

					<div className='header-right-section-account ms-4'>
						<div className='nav-profile'>
							<span onClick={handleProfileMenu}>
								Moje konto{' '}
								<i>
									<FontAwesomeIcon icon={`fa-solid fa-chevron-${showUserProfile ? 'up' : 'down'}`} />
								</i>
							</span>

							{showUserProfile && (
								<div className='nav-profile-dropdown'>
									{isAuthenticated ? (
										<>
											<p>Hello World</p>
											<p>Hello World</p>
											<p onClick={handleLogoutUser}>Wyloguj</p>
										</>
									) : (
										<p>Zaloguj się</p>
									)}
								</div>
							)}
						</div>
						{/* <NavLink to='/createAnnouncement'>
							<button className='color-button-design mb-2 ms-4'>Dodaj ogłoszenie</button>
						</NavLink> */}
					</div>
				</div>
			</article>
		</header>
	)
}
