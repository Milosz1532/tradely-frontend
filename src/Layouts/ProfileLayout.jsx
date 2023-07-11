import React, { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Layout/Navbar'
import Footer from '../components/Layout/Footer'
import ScrollToTop from '../ScrollToTop'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../assets/styles/Account.scss'
import userIcon from '/images/user.png'
import menuItems from '../utils/profile/menu'
import { useSelector } from 'react-redux'

export default function ProfileLayout() {
	const location = useLocation()
	const permissions = useSelector(state => state.auth.permissions)
	const user = useSelector(state => state.auth.user)

	const [fullSizeMenu, setFullSizeMenu] = useState(false)

	const hasPermission = permission => {
		return permissions.some(item => item.name === permission)
	}

	const showAdministrationSection = menuItems.some(
		category =>
			category.category === 'Administracja' &&
			category.items.some(item => item.permissions && hasPermission(item.permissions))
	)

	return (
		<>
			<Navbar fluid={true} />
			<div className='layout-content'>
				<div className={`left-menu ${fullSizeMenu && 'full-size'}`}>
					<div className='left-menu-close-btn ' onClick={e => setFullSizeMenu(false)}>
						<i>
							<FontAwesomeIcon icon='fa-solid fa-angles-left' />
						</i>
						<span>Zwiń menu</span>
					</div>
					<div className='left-menu-profile-info'>
						<img src={userIcon} alt='user-icon' width={60} height={60} draggable={false} />
						<div className='profile-info-data ms-2'>
							<p className='user-username'>{`${
								user?.first_name && user?.last_name
									? `${user.first_name} ${user.last_name}`
									: 'Anonimowy użytkownik'
							}`}</p>
							<p className='user-email'>{user.email}</p>
							<p className='user-id'>ID: {user.id}</p>
						</div>
					</div>
					<div className='left-menu-content-menu mt-4'>
						{menuItems.map(category =>
							category.category === 'Administracja' && !showAdministrationSection ? null : (
								<React.Fragment key={category.category}>
									<p className='menu-title'>{category.category}</p>
									<ul>
										{category.items.map(item =>
											// Sprawdzenie uprawnień dla elementu menu
											item.permissions && !hasPermission(item.permissions) ? null : (
												<NavLink key={item.id} to={item.link}>
													<li className={location.pathname === item.link ? 'active' : ''}>
														<i className='me-2'>
															<FontAwesomeIcon icon={item.icon} />
														</i>
														<span className='left-menu-tab-title'>{item.name}</span>
													</li>
												</NavLink>
											)
										)}
									</ul>
								</React.Fragment>
							)
						)}
					</div>
				</div>
				<div className='profile-layout-content'>
					<div className='left-menu-size-button' onClick={e => setFullSizeMenu(true)}>
						<i>
							<FontAwesomeIcon icon='fa-solid fa-angles-right' />
						</i>
					</div>
					<Outlet />
				</div>
			</div>
		</>
	)
}
