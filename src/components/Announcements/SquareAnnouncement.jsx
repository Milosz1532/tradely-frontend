import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Skeleton from 'react-loading-skeleton'

import noImage from '/images/no-image.png'

export function SquareAnnouncement({ id, title, price, created_at, image, location, category }) {
	return (
		<div className='col-12 col-xl-3 col-lg-4 col-md-6 col-sm-12 mt-4 p-3'>
			<NavLink to={`/announcement/${id}`} style={{ all: 'unset', cursor: 'pointer' }}>
				<div className='announcement-box'>
					<div className='announcement-image'>
						<img draggable='false' src={image ? image : noImage} alt='announcement-image' />
					</div>
					<div className='announcement-content'>
						<div className='announcement-top-section'>
							<span className='announcement-category'>{category ?? 'Brak danych'}</span>
							<span className='announcement-likes'>
								<i className='me-1'>
									<FontAwesomeIcon icon='fa-solid fa-heart' />
								</i>
								300
							</span>
						</div>

						<div className='announcement-title-section'>
							<p className='announcement-title'>{title}</p>
							<p className='announcement-price'>{price ? `${price} zł` : 'Za darmo'}</p>
						</div>
						<hr />

						<div className='announcement-bottom'>
							<div className='announcement-date'>
								<span>{created_at}</span>
								<span>{location ?? 'Brak danych'}</span>
							</div>
							<div className='announcement-buttons'>
								<i className='me-2'>
									<FontAwesomeIcon icon='fa-regular fa-heart' />
								</i>
								<i>
									<FontAwesomeIcon icon='fa-regular fa-comments' />
								</i>
							</div>
						</div>
					</div>
				</div>
			</NavLink>
		</div>
	)
}

export function SquareAnnouncementLoading() {
	return (
		<div className='col-12 col-xl-3 col-lg-4 col-md-6 col-sm-12 mt-4'>
			<div className='announcement-box loading'>
				<div className='announcement-image loading'>
					<Skeleton height={200} />
				</div>
				<div className='announcement-content loading'>
					<div className='announcement-top-section loading'>
						<Skeleton width={150} />
						<Skeleton width={50} />
					</div>
					<div className='announcement-title-section loading'>
						<Skeleton width={200} />
						<Skeleton width={100} />
					</div>
					<hr />
					<div className='announcement-bottom'>
						<div className='announcement-date'>
							<Skeleton width={100} />
							<Skeleton width={150} />
						</div>
						<div className='announcement-buttons d-flex'>
							<Skeleton className='me-2' width={30} height={30} />
							<Skeleton width={30} height={30} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default {
	SquareAnnouncement,
	SquareAnnouncementLoading,
}
