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

import Button from './Button'

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

	return (
		<header>
			<article
				className={fluid ? 'container-fluid mt-0 pt-2 px-xl-5 ' : 'container mt-0 pt-2 px-xl-4'}>
				<div className='logo'>
					<Link to='/'>
						<h2>Tradely</h2>
					</Link>
				</div>
				<div className='header-right-section'>
					<i>
						<NavLink to={'/account/favorites-announcements'}>
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
							<span className='header-right-section-account-button' onClick={handleProfileMenu}>
								Moje konto
								<i className='ms-2'>
									<FontAwesomeIcon
										icon={`fa-solid fa-chevron-${showUserProfile ? 'up' : 'down'}`}
									/>
								</i>
							</span>

							<span
								className='header-right-section-account-mobile-button'
								onClick={handleProfileMenu}>
								<FontAwesomeIcon icon='fa-solid fa-user-tie' />
							</span>

							<div className={`nav-profile-dropdown ${showUserProfile ? 'active' : ''}`}>
								<div className='nav-profile-close-icon' onClick={handleProfileMenu}>
									<FontAwesomeIcon icon='fa-solid fa-xmark' />
								</div>
								<div className='nav-profile-content'>
									{isAuthenticated ? (
										<div className='nav-profile-Login'>
											<div className='nav-profile-user-info el-border-bottom pb-3'>
												<img draggable={false} src={userIcon} alt='user-icon' />
												<div className='nav-profile-user-info-content'>
													<p className='user-first_last_name'>{user && user.login}</p>
													<p className='user-id'>ID: {user.id}</p>
												</div>
											</div>
											<h6 className='color-main mt-3'>Ogłoszenia:</h6>
											<ul>
												<NavLink to={'/account/active-announcements'}>
													<li className='mt-2'>
														<span>Aktywne ogłoszenia</span>
													</li>
												</NavLink>
												<NavLink to={'/account/completed-announcements'}>
													<li className='mt-3'>
														<span>Zakończone ogłoszenia</span>
													</li>
												</NavLink>
												<li className='mt-3'>
													<span>Otrzymane oceny</span>
												</li>
												<NavLink to={'/account'}>
													<li className='mt-3'>
														<span>Profil</span>
													</li>
												</NavLink>

												<li>
													<span>Ustawienia</span>
												</li>
											</ul>

											<h6 className='color-main mt-3'>Moje konto:</h6>

											<ul className='el-border-bottom pb-2'>
												<li className='mt-3'>
													<NavLink to={'/account/favorites-announcements'}>
														<span>Obserwowane</span>
													</NavLink>
												</li>
												<li className='mt-3'>
													<span>Wyszukiwania</span>
												</li>
											</ul>

											<p
												className='clickable-label color-main cursor-pointer mt-2'
												onClick={handleLogoutUser}>
												<p>
													<b>Wyloguj się</b>
												</p>
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
														<Button
															className={'w-100'}
															text={'Zaloguj się'}
															size={'medium'}
															color={true}
														/>
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
							<div className='header-right-section-add-button d-inline'>
								<NavLink to='/createAnnouncement'>
									<Button className={'ms-3'} text={'Dodaj ogłoszenie'} size={'medium'} />
								</NavLink>
							</div>
						</div>
					</div>
				</div>
			</article>
		</header>
	)
}
