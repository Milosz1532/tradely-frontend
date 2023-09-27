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
	const isTabletOrMobile = useSelector(state => state.device.isTabletOrMobile)

	const [selectedTab, setSelectedTab] = useState(false)

	const hasPermission = permission => {
		return permissions.some(item => item.name === permission)
	}

	const showAdministrationSection = menuItems.some(
		category =>
			category.category === 'Administracja' &&
			category.items.some(item => item.permissions && hasPermission(item.permissions))
	)

	useEffect(() => {
		// Zaktualizuj selectedTab na podstawie location.pathname
		const currentTab = menuItems
			.flatMap(category => category.items)
			.find(item => item.link === location.pathname)

		if (currentTab) {
			setSelectedTab(currentTab.name)
		} else {
			setSelectedTab(false)
		}
	}, [location.pathname])

	return (
		<>
			<Navbar />
			<div className='container mt-3'>
				<div className='row'>
					{isTabletOrMobile && (
						<>
							{!selectedTab && (
								<div className='col-xl-5'>
									<div
										className='main-content-box p-0 pb-2 sticky-column'
										style={{ minHeight: '300px' }}>
										{menuItems.map(category =>
											category.category === 'Administracja' && !showAdministrationSection ? null : (
												<React.Fragment key={category.category}>
													<div className='main-content-header pb-3'>
														<h5 className='m-0 ms-2'>{category.category}</h5>
													</div>
													<ul className='profile-menu-list mt-2'>
														{category.items.map(item =>
															item.permissions && !hasPermission(item.permissions) ? null : (
																<NavLink key={item.id} to={item.link}>
																	<li
																		className={`p-3 px-3 ${
																			location.pathname === item.link ? 'selected-list-element' : ''
																		}`}>
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
							)}
							{selectedTab && (
								<div className='col-xl-7'>
									<div className='main-content-box p-0 pb-2 ' style={{ minHeight: '300px' }}>
										<Outlet />
									</div>
								</div>
							)}
						</>
					)}
					{!isTabletOrMobile && (
						<>
							<div className='col-xl-5'>
								<div
									className='main-content-box p-0 pb-2 sticky-column'
									style={{ minHeight: '300px' }}>
									{menuItems.map(category =>
										category.category === 'Administracja' && !showAdministrationSection ? null : (
											<React.Fragment key={category.category}>
												<div className='main-content-header pb-3'>
													<h5 className='m-0 ms-2'>{category.category}</h5>
												</div>
												<ul className='profile-menu-list mt-2'>
													{category.items.map(item =>
														item.permissions && !hasPermission(item.permissions) ? null : (
															<NavLink key={item.id} to={item.link}>
																<li
																	className={`p-3 px-3 ${
																		location.pathname === item.link ? 'selected-list-element' : ''
																	}`}>
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
							{selectedTab && (
								<div className='col-xl-7'>
									<div className='main-content-box p-0 pb-2 ' style={{ minHeight: '300px' }}>
										<Outlet />
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</>
	)
}
