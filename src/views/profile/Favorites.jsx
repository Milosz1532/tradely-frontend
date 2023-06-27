import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { userFavoritesAnnouncements } from '../../services/ProfileService'
import { useSelector } from 'react-redux'
import {
	RectangularAnnouncement,
	RectangularAnnouncementLoading,
} from '../../components/Announcements/RectangularAnnouncement'
import NoAnnouncements from '../../components/Announcements/NoAnnouncements'

const FavoritesAnnouncementsListLoading = () => {
	return (
		<>
			<RectangularAnnouncementLoading />
			<RectangularAnnouncementLoading />
			<RectangularAnnouncementLoading />
			<RectangularAnnouncementLoading />
		</>
	)
}

export default function Favorites() {
	const favoritesState = useSelector(state => state.auth.favoriteAds)
	const isVerifying = useSelector(state => state.auth.verifying)

	return (
		<div className='container-fluid'>
			<div className='row'>
				<h5 className='tab-title'>
					Obserwowane ogłoszenia ({favoritesState && favoritesState.length})
				</h5>
				<article className='account-box'>
					{/* Jeśli isLoading jest true, wyświetl ekran ładowania */}
					{isVerifying ? (
						<FavoritesAnnouncementsListLoading />
					) : favoritesState && favoritesState.length > 0 ? (
						favoritesState.map(a => (
							<React.Fragment key={`favorite-announcement-${a.id}`}>
								<RectangularAnnouncement
									id={a.id}
									image={a.first_image}
									title={a.title}
									price={a.price}
									created_at={a.created_at}
									tags={a.tags}
									item={a}
								/>
								<hr key={`hr-${a.id}`} />
							</React.Fragment>
						))
					) : (
						<NoAnnouncements />
					)}
				</article>
			</div>
		</div>
	)
}
