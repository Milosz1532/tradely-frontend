import React from 'react'
import { NavLink } from 'react-router-dom'

import noImage from '/images/no-image.png'

export default function SquareAnnouncement({ id, title, price, created_at, image }) {
	return (
		<div className='col-12 col-xl-3 col-lg-4 col-md-6 col-sm-12 mt-4'>
			<NavLink to={`/announcement/${id}`} style={{ all: 'unset', cursor: 'pointer' }}>
				<div className='announcement-box'>
					<div className='announcement-image'>
						<img draggable='false' src={image ? image : noImage} alt='announcement-image' />
					</div>
					<div className='announcement-content'>
						<div className='announcement-top-section'>
							<span className='announcement-category'>Motoryzacja Samochody uzywane</span>
							<span className='announcement-likes'>
								<i className='fa-solid fa-heart'></i> 300
							</span>
						</div>

						<div className='announcement-title-section'>
							<p className='announcement-title'>{title}</p>
							<p className='announcement-price'>{price} zł</p>
						</div>
						<hr />

						<div className='announcement-bottom'>
							<div className='announcement-date'>
								<span>{created_at}</span>
								<span>87-800 Włocławek</span>
							</div>
							<div className='announcement-buttons'>
								<i className='fa-regular fa-comment mx-2'></i>
								<i className='fa-regular fa-heart'></i>
							</div>
						</div>
					</div>
				</div>
			</NavLink>
		</div>
	)
}
