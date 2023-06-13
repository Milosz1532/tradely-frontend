import React, { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../assets/styles/Header.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import NotLoginIcon from '../assets/images/nav-profile-notLoign-icon.svg'
import userIcon from '/images/user.png'

import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { logout } from '../redux/actions/authActions'

export default function Navbar() {
	const dispatch = useDispatch()
	const [showUserProfile, setShowUserProfile] = useState(false)
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
	const user = useSelector(state => state.auth.user)
	const userProfileRef = useRef(null)

	const handleProfileMenu = () => {
		setShowUserProfile(prevState => !prevState)
	}

	useEffect(() => {
		function handleClickOutside(event) {
			if (userProfileRef.current && !userProfileRef.current.contains(event.target)) {
				setShowUserProfile(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleLogoutUser = () => {
		setShowUserProfile(false)
		dispatch(logout())
		toast.success('Pomyślnie wylogowano!')
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
						<div className='nav-profile' ref={userProfileRef}>
							<span onClick={handleProfileMenu}>
								Moje konto{' '}
								<i>
									<FontAwesomeIcon icon={`fa-solid fa-chevron-${showUserProfile ? 'up' : 'down'}`} />
								</i>
							</span>

							<div className={`nav-profile-dropdown ${showUserProfile ? 'active' : ''}`}>
								<div className='nav-profile-content'>
									{isAuthenticated ? (
										<div className='nav-profile-Login'>
											<div className='nav-profile-user-info'>
												<img draggable={false} src={userIcon} alt='user-icon' />
												<div className='nav-profile-user-info-content'>
													<p className='user-first_last_name'>{user && user.login}</p>
													<p className='user-id'>ID: {user.id}</p>
												</div>
											</div>
											<hr />
											<h6 className='nav-profile-title'>
												<i className='me-2'>
													<FontAwesomeIcon icon='fa-solid fa-user' />
												</i>
												Twoje konto:
											</h6>
											<ul>
												<li>
													<span>Ogłoszenia</span>
												</li>
												<li>
													<span>Wiadomości</span>
												</li>
												<li>
													<span>Otrzymane oceny</span>
												</li>
												<li>
													<span>Profil</span>
												</li>
												<li>
													<span>Ustawienia</span>
												</li>
											</ul>

											<h6 className='nav-profile-title mt-3'>
												<i className='me-2'>
													<FontAwesomeIcon icon='fa-solid fa-bullhorn' />
												</i>
												Ogłoszenia:
											</h6>
											<ul>
												<li>
													<span>Obserwowane</span>
												</li>
												<li>
													<span>Wyszukiwania</span>
												</li>
											</ul>

											<hr />
											<p style={{ cursor: 'pointer' }} onClick={handleLogoutUser}>
												<i className='me-2'>
													<FontAwesomeIcon icon='fa-solid fa-arrow-right-from-bracket'></FontAwesomeIcon>
												</i>
												Wyloguj
											</p>
										</div>
									) : (
										<>
											<div className='nav-profile-notLogin'>
												<img draggable='false' src={NotLoginIcon} alt='nav-profile-image' />
												<div className='content mt-2'>
													<h6>Witaj na Tradely!</h6>
													<p>
														Zaloguj się i zobacz swoje zakupy, obserwowane oferty i powiadomienia. W Tradely jesteś u
														siebie!
													</p>
													<NavLink to={'/login'}>
														<button className='btn-design w-100'>Zaloguj się</button>
													</NavLink>
													<p className='nav-profile-register'>
														Nie masz konta? <NavLink to={'/signup'}>Zarejestruj się</NavLink>
													</p>
												</div>
											</div>
										</>
									)}
								</div>
							</div>
							<NavLink to='/createAnnouncement'>
								<button className='btn-design btn-md ms-4'>Dodaj ogłoszenie</button>
							</NavLink>
						</div>
					</div>
				</div>
			</article>
		</header>
	)
}
