import React, { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../../assets/styles/Header.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import NotLoginIcon from '/images/nav-profile-notLoign-icon.svg'
import userIcon from '/images/user.png'

import { useSelector, useDispatch } from 'react-redux'
import { addUnreadConversation } from '../../redux/actions/authActions'
import { toast } from 'react-toastify'
import { logout } from '../../redux/actions/authActions'

import Pusher from 'pusher-js'
import Echo from 'laravel-echo'
import Cookies from 'js-cookie'

export default function Navbar({ fluid = false }) {
	const dispatch = useDispatch()
	const [showUserProfile, setShowUserProfile] = useState(false)
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
	const unreadMessages = useSelector(state => state.auth.unreadMessages)
	const user = useSelector(state => state.auth.user)
	const userProfileRef = useRef(null)

	const handleProfileMenu = () => {
		setShowUserProfile(prevState => !prevState)
	}

	useEffect(() => {
		if (isAuthenticated) {
			const echo = new Echo({
				broadcaster: 'pusher',
				cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
				key: import.meta.env.VITE_PUSHER_APP_KEY,
				wsHost: window.location.hostname,
				wsPort: 6001,
				forceTLS: false,
				disableStats: true,
				enabledTransports: ['ws', 'wss'],
				authEndpoint: import.meta.env.VITE_API_BASE_URL + '/broadcasting/auth',
				auth: {
					headers: {
						Authorization: `Bearer ${Cookies.get('ACCESS_TOKEN')}`,
					},
				},
			})

			// Nasłuchiwanie wiadomości
			const listenForMessages = () => {
				echo.private(`messanger_user.${user.id}`).listen('MessageSent', e => {
					dispatch(addUnreadConversation(e.data.conversation_id))
				})
			}
			listenForMessages()
		}

		function handleClickOutside(event) {
			if (userProfileRef.current && !userProfileRef.current.contains(event.target)) {
				setShowUserProfile(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isAuthenticated])

	const handleLogoutUser = () => {
		setShowUserProfile(false)
		dispatch(logout())
		toast.success('Pomyślnie wylogowano!')
	}

	const [showMenu, setShowMenu] = useState(null)

	const handleShowMenu = () => {
		setShowMenu(prevState => !prevState)
	}

	const handleAnimationEnd = () => {
		if (showMenu === false) {
			setShowMenu(null)
		}
	}

	return (
		<header>
			<article className={fluid ? 'container-fluid mt-0 pt-2 px-5 ' : 'container mt-0 pt-2'}>
				<div className='logo'>
					<Link to='/'>
						<h2>Tradely</h2>
					</Link>
				</div>
				<div className='header-right-section'>
					<i>
						<NavLink to={'/account/favorites'}>
							<FontAwesomeIcon icon='fa-regular fa-heart' />
						</NavLink>
					</i>

					<i className='messages-icon'>
						<NavLink to={'/account/chat'}>
							<FontAwesomeIcon icon='fa-regular fa-comments' />
							{Object.keys(unreadMessages).length > 0 && (
								<span className='messages-count'>{Object.keys(unreadMessages).length}</span>
							)}
						</NavLink>
					</i>
					<i>
						<FontAwesomeIcon icon='fa-regular fa-bell' />
					</i>

					<div className='header-right-section-account ms-4'>
						<div className='nav-profile' ref={userProfileRef}>
							<span onClick={handleProfileMenu}>
								Moje konto{' '}
								<i>
									<FontAwesomeIcon
										icon={`fa-solid fa-chevron-${showUserProfile ? 'up' : 'down'}`}
									/>
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
												<NavLink to={'/account/announcements'}>
													<li>
														<span>Ogłoszenia</span>
													</li>
												</NavLink>
												<li>
													<span>Wiadomości</span>
												</li>
												<li>
													<span>Otrzymane oceny</span>
												</li>
												<NavLink to={'/account/profile'}>
													<li>
														<span>Profil</span>
													</li>
												</NavLink>

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
													<NavLink to={'/account/favorites'}>
														<span>Obserwowane</span>
													</NavLink>
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
														Zaloguj się i zobacz swoje zakupy, obserwowane oferty i powiadomienia. W
														Tradely jesteś u siebie!
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
				{/* Hamburger Menu */}
				<div className={`hamburger-menu`} onClick={handleShowMenu}>
					<FontAwesomeIcon icon='fa-solid fa-bars' />
				</div>
			</article>
			{/* Mobile Menu */}
			<div
				className={`mobile-menu ${
					showMenu === true ? 'active' : showMenu === false ? 'closing' : ''
				}`}
				onAnimationEnd={handleAnimationEnd}>
				<ul>
					<li>
						<NavLink to={'/account/favorites'}>
							<i>
								<FontAwesomeIcon icon='fa-regular fa-heart' />
							</i>

							<span className='ms-2'>Obserwowane</span>
						</NavLink>
					</li>
					<li>
						<NavLink to={'/account/chat'}>
							<i>
								<FontAwesomeIcon icon='fa-regular fa-comments' />
							</i>
							<span className='ms-2'>Wiadomości</span>
						</NavLink>
					</li>
					<li>
						<NavLink to={'/account/profile'}>
							<i>
								<FontAwesomeIcon icon='fa-regular fa-user' />
							</i>
							<span className='ms-2'>Moje konto</span>
						</NavLink>
					</li>
					<li onClick={handleLogoutUser}>
						<i>
							<FontAwesomeIcon icon='fa-solid fa-door-open' />
						</i>
						<span className='ms-2'>Wyloguj</span>
					</li>
				</ul>
			</div>
		</header>
	)
}
