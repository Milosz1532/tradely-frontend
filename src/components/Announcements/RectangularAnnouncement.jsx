import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
// import { likeAnnouncement } from '../../services/AnnouncementService'
import { useSelector, useDispatch } from 'react-redux'
import { manageFavoritesAnnouncements } from '../../redux/actions/authActions'

import noImage from '/images/no-image.png'

export const RectangularAnnouncement = ({
	id,
	image,
	title,
	price,
	created_at,
	tags,
	edit = false,
	disabled = false,
	refreshList = false,
	is_favorited = false,
	item,
}) => {
	const dispatch = useDispatch()

	const [isFavorited, setIsFavorited] = useState(false)
	const [likes, setLikes] = useState(0)
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

	useEffect(() => {
		setIsFavorited(is_favorited)
	}, [])

	const handleLikeAnnouncement = async e => {
		e.preventDefault()
		if (!isAuthenticated) return
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

	const linkTo = disabled ? null : `/announcement/${id}`

	const formattedAmount = new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency: 'PLN',
		useGrouping: true,
	}).format(price)

	return (
		<div className='col-12 rectangular-announcement mt-2'>
			<NavLink
				to={linkTo}
				style={
					disabled ? { all: 'unset', cursor: 'default' } : { all: 'unset', cursor: 'pointer' }
				}>
				<div className='row'>
					<div className='col-2 rectangular-announcement-image'>
						<img src={image ? image : noImage} alt='Announcement photo' />
					</div>
					<div className='col-10 rectangular-announcement-content'>
						<div className='reactangular-announement-top-section'>
							<h5 className='title'>{title}</h5>
							<h5 className='price'>{formattedAmount ? `${formattedAmount}` : 'Za darmo'}</h5>
						</div>
						<ul className='announcement-tags-list'>
							{tags.map(t => (
								<li key={`announcement-${id}-tag-id-${t.id}`}>{t.name}</li>
							))}
						</ul>
						<div className='location'>
							<span>13.06.2023 12:00</span>
							<span>Włocławek, 87-800</span>
						</div>
						{edit ? (
							<div className='favorite-icon'>
								<button className='btn-design btn-sm'>Zarządzaj</button>
							</div>
						) : (
							<i className='favorite-icon announcement-button' onClick={handleLikeAnnouncement}>
								<FontAwesomeIcon icon={`fa-${isFavorited ? 'solid' : 'regular'} fa-heart`} />
							</i>
						)}
					</div>
				</div>
			</NavLink>
		</div>
	)
}

export const RectangularAnnouncementLoading = () => {
	return (
		<div className='col-12 rectangular-announcement mt-2 '>
			<div className='row'>
				<div className='col-2 rectangular-announcement-image'>
					<div className='ms-3 mt-1'>
						<Skeleton height={100} />
					</div>
				</div>
				<div className='col-10 rectangular-announcement-content'>
					<div className='reactangular-announement-top-section'>
						<h5 className='title'>
							<Skeleton width={200} />
						</h5>
						<h5 className='price'>
							<Skeleton width={100} />
						</h5>
					</div>
					<ul className='announcement-tags-list'>
						<li>
							<Skeleton width={60} />
						</li>
						<li>
							<Skeleton width={80} />
						</li>
						<li>
							<Skeleton width={100} />
						</li>
						<li>
							<Skeleton width={80} />
						</li>
					</ul>
					<div className='location'>
						<span>
							<Skeleton width={120} />
						</span>
						<span>
							<Skeleton width={120} />
						</span>
					</div>
					<i className='favorite-icon'>
						<Skeleton circle={true} height={20} width={20} />
					</i>
				</div>
			</div>
		</div>
	)
}

export default {
	RectangularAnnouncement,
	RectangularAnnouncementLoading,
}
