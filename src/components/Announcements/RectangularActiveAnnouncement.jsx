import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import { useSelector, useDispatch } from 'react-redux'
import { manageFavoritesAnnouncements } from '../../redux/actions/authActions'

import noImage from '/images/no-image.png'

import Button from '../Layout/Button'

export const RectangularActiveAnnouncement = ({
	id,
	image,
	title,
	price,
	price_type,
	city,
	created_at,
	tags,
	item,
}) => {
	const formattedAmount = new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency: 'PLN',
		useGrouping: true,
	}).format(price)

	let announcementPrice = formattedAmount

	if (price_type === 2) {
		announcementPrice = 'Zamienię'
	} else if (price_type === 3) {
		announcementPrice = 'Oddam za darmo'
	}

	return (
		<div className='col-12 '>
			<div className='rectangular-active-announcement pb-3 '>
				<div className='rectangular-active-announcement-image mt-2 '>
					<img src={image ? image : noImage} alt='Announcement photo' />
				</div>
				<div className='ms-2 mt-2  w-100'>
					<div className=''>
						<h5 className='text-sm mb-0'>{title}</h5>
						<h5 className='text-sm color-main m-0 mt-2 mb-0'>{announcementPrice}</h5>
					</div>

					<div className='m-0'>
						<span className='text-xs m-0'>Wystawione dnia: 31.02.2023</span>
					</div>
					<div className='d-flex justify-content-between align-items-center flex-wrap'>
						<div className='d-flex align-items-center'>
							<div>
								<i className='icon-md color-main'>
									<FontAwesomeIcon icon='fa-regular fa-eye' />
								</i>
								<span className='ms-1'>0</span>
							</div>
							<div className='ms-3'>
								<i className='icon-md color-main'>
									<FontAwesomeIcon icon='fa-regular fa-heart' />
								</i>
								<span className='ms-1'>0</span>
							</div>
							<div className='ms-3'>
								<i className='icon-md color-main'>
									<FontAwesomeIcon icon='fa-regular fa-comments' />
								</i>
								<span className='ms-1'>0</span>
							</div>
						</div>
						<div className='me-2 mt-1'>
							<Button text={'Zarządzaj'} color={true} rounded={true} size={'xs'} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export const RectangularActiveAnnouncementLoading = () => {
	return (
		<div className='col-12 mt-3'>
			<div className='rectangular-active-announcement pb-2'>
				<div className='rectangular-announcement-image'>
					<Skeleton width={120} height={80} />
				</div>
				<div className='ms-2 w-100'>
					<div className='reactangular-announement-top-section'>
						<Skeleton width={300} height={30} />
						<Skeleton width={200} />
					</div>
					<ul className='announcement-tags-list'></ul>
					<div className='rectangular-announcement-bottom'>
						<div className='location'>
							<div className='d-flex'>
								<Skeleton className='me-2' width={100} />
								<Skeleton width={90} />
							</div>
						</div>
						<div className='d-flex justify-content-between me-3'>
							<div className='d-flex align-items-center'>
								<Skeleton width={20} height={20} />
								<Skeleton width={40} height={20} className='ms-1' />
							</div>
							<div className='d-flex align-items-center'>
								<Skeleton width={20} height={20} />
								<Skeleton width={40} height={20} className='ms-1' />
							</div>
							<div className='d-flex align-items-center'>
								<Skeleton width={20} height={20} />
								<Skeleton width={40} height={20} className='ms-1' />
							</div>
							<div>
								<Skeleton className='' width={100} height={30} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default {
	RectangularActiveAnnouncement,
	RectangularActiveAnnouncementLoading,
}
