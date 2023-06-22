import React, { useEffect } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Layout/Navbar'
import Footer from '../components/Layout/Footer'
import ScrollToTop from '../ScrollToTop'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '../assets/styles/Account.css'

import userIcon from '/images/user.png'

export default function ProfileLayout() {
	const location = useLocation()

	return (
		<>
			<Navbar fluid={true} />
			<div className='layout-content '>
				<div className='left-menu'>
					<div className='left-menu-profile-info'>
						<img src={userIcon} alt='user-icon' width={60} height={60} />
						<div className='profile-info-data ms-2'>
							<p className='user-username'>Miłosz Konopka</p>
							<p className='user-email'>milosz.konopka@poczta.com</p>
							<p className='user-id'>ID: 431251</p>
						</div>
					</div>
					<div className='left-menu-content-menu mt-4'>
						<p className='menu-title'>PROFIL</p>
						<ul>
							<NavLink to={'/account/profile'}>
								<li className={location.pathname === '/account/profile' ? 'active' : ''}>
									<i className='me-2'>
										<FontAwesomeIcon icon='fa-regular fa-user' />
									</i>
									Profil
								</li>
							</NavLink>
							<NavLink to={''}>
								<li>
									<i className='me-2'>
										<FontAwesomeIcon icon='fa-regular fa-pen-to-square' />
									</i>
									Edycja konta
								</li>
							</NavLink>
							<NavLink to={''}>
								<li>
									<i className='me-2'>
										<FontAwesomeIcon icon='fa-regular fa-star' />
									</i>
									Moje oceny
								</li>
							</NavLink>
							<NavLink to={''}>
								<li>
									<i className='me-2'>
										<FontAwesomeIcon icon='fa-regular fa-smile' />
									</i>
									Wystawione oceny
								</li>
							</NavLink>
						</ul>
						<p className='menu-title'>OGŁOSZENIA</p>
						<ul>
							<NavLink to={''}>
								<li>
									<i className='me-2'>
										<FontAwesomeIcon icon='fa-regular fa-heart' />
									</i>
									Obserwowane
								</li>
							</NavLink>
							<NavLink to={'/account/announcements'}>
								<li className={location.pathname === '/account/announcements' ? 'active' : ''}>
									<i className='me-2'>
										<FontAwesomeIcon icon='fa-solid fa-bullhorn' />
									</i>
									Moje ogłoszenia
								</li>
							</NavLink>
							<NavLink to={''}>
								<li>
									<i className='me-2'>
										<FontAwesomeIcon icon='fa-regular fa-comments' />
									</i>
									Wiadomości
								</li>
							</NavLink>
						</ul>
					</div>
				</div>
				<div className='profile-layout-content'>
					<Outlet />
				</div>
			</div>
		</>
	)
}
