import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { userFavoritesAnnouncements } from '../../services/ProfileService'

import {
	RectangularAnnouncement,
	RectangularAnnouncementLoading,
} from '../../components/Announcements/RectangularAnnouncement'

import NoAnnouncements from '../../components/Announcements/NoAnnouncements'

const FavoritesAnnouncementsListLoading = () => {
	return (
		<>
			<RectangularAnnouncementLoading />
		</>
	)
}

let inn = 0

const Testt = () => {
	console.log(`ID: ${inn}`)
	inn++
}

export default function Favorites() {
	const [userFavoritesAnnouncementsList, setUserFavoritesAnnouncementsList] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [refreshList, setRefreshList] = useState(false)

	useEffect(() => {
		const getUserFavoritesAnnouncements = async () => {
			try {
				const announcementsData = await userFavoritesAnnouncements()
				setUserFavoritesAnnouncementsList(announcementsData.data)
				console.log(announcementsData.data)
			} catch {
				setUserFavoritesAnnouncementsList([])
			} finally {
				setIsLoading(false)
			}
		}
		setIsLoading(true)
		setUserFavoritesAnnouncementsList([])
		getUserFavoritesAnnouncements()
	}, [refreshList])

	return (
		<div className='container-fluid'>
			<div className='row'>
				<h5 className='tab-title'>
					Obserwowane ogłoszenia (
					{userFavoritesAnnouncementsList && userFavoritesAnnouncementsList.length})
				</h5>
				<article className='account-box'>
					{isLoading ? (
						<FavoritesAnnouncementsListLoading />
					) : userFavoritesAnnouncementsList && userFavoritesAnnouncementsList.length > 0 ? (
						userFavoritesAnnouncementsList.map(a => (
							<React.Fragment key={`favorite-announcement-${a.id}`}>
								<RectangularAnnouncement
									id={a.id}
									image={a.first_image}
									title={a.title}
									price={a.price}
									created_at={a.created_at}
									tags={a.tags}
									refreshList={e => setRefreshList(prevState => !prevState)}
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
