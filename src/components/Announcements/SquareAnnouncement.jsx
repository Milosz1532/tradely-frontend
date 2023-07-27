import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import numeral from 'numeral'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Skeleton from 'react-loading-skeleton'
import { toast } from 'react-toastify'

import noImage from '/images/no-image.png'

import { manageFavoritesAnnouncements } from '../../redux/actions/authActions'

export function SquareAnnouncement({
	id,
	user_id,
	title,
	price,
	created_at,
	image,
	location,
	category,
	price_type,
	favorite_count = 0,
	is_favorited = false,
	item,
}) {
	const [likes, setLikes] = useState(0)

	const [isFavorited, setIsFavorited] = useState(false)
	const user = useSelector(state => state.auth.user)
	const favoriteAds = useSelector(state => state.auth.favoriteAds)
	const dispatch = useDispatch()

	useEffect(() => {
		setLikes(favorite_count)
		setIsFavorited(is_favorited)
	}, [])

	const handleLikeAnnouncement = async e => {
		e.preventDefault()
		if (!user) return
		try {
			dispatch(manageFavoritesAnnouncements(item))

			if (isFavorited) {
				setLikes(prevLikes => prevLikes - 1)
			} else {
				setLikes(prevLikes => prevLikes + 1)
			}
			setIsFavorited(prevState => !prevState)
		} catch (error) {
			console.log('Nie udało się dodać/usunąć ogłoszenia z ulubionych', error)
		}
	}

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
		// <div className='col-12 col-xl-3 col-lg-4 col-md-6 col-sm-12 mt-4 p-3'>
		<NavLink to={`/announcement/${id}`} style={{ all: 'unset', cursor: 'pointer' }}>
			<div className='announcement-box mx-3'>
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
							{likes}
						</span>
					</div>

					<div className='announcement-title-section'>
						<p className='announcement-title'>{title}</p>
						<p className='announcement-price'>{announcementPrice}</p>
					</div>
					<hr />

					<div className='announcement-bottom'>
						<div className='announcement-date'>
							<span>{created_at}</span>
							<span>{location ?? 'Brak danych'}</span>
						</div>
						{user && user.id && user.id == user_id ? (
							false
						) : (
							<div className='announcement-buttons'>
								<i className='me-2 announcement-button' onClick={handleLikeAnnouncement}>
									<FontAwesomeIcon icon={`fa-${isFavorited ? 'solid' : 'regular'} fa-heart`} />
								</i>
								<NavLink to={`/account/chat/new/${id}`} style={{ all: 'unset', cursor: 'pointer' }}>
									<i>
										<FontAwesomeIcon icon='fa-regular fa-comments' />
									</i>
								</NavLink>
							</div>
						)}
					</div>
				</div>
			</div>
		</NavLink>

		// </div>
	)
}

export function SquareAnnouncementLoading() {
	return (
		<div className='col-12 col-xl-3 col-lg-4 col-md-6 col-sm-12 mt-4'>
			<div className='announcement-box loading'>
				<div className='announcement-image loading'>
					<Skeleton height={155} />
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
