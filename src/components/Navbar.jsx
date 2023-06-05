import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/styles/Header.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Navbar() {
	return (
		<header className='container'>
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
					<span>
						Moje konto{' '}
						<i>
							<FontAwesomeIcon icon='fa-solid fa-chevron-down' />
						</i>
					</span>
				</div>
			</div>
		</header>
	)
}
