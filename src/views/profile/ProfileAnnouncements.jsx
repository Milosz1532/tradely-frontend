import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { userAnnouncements } from '../../services/ProfileService'

import NoAnnouncementsIcon from '/images/no-announcements-list.svg'

import NoAnnouncements from '../../components/Announcements/NoAnnouncements'

import {
	RectangularAnnouncement,
	RectangularAnnouncementLoading,
} from '../../components/Announcements/RectangularAnnouncement'

import TabControl from '../../components/Layout/TabControl'

const LoadingAnnouncements = () => (
	<>
		<RectangularAnnouncementLoading />
		<RectangularAnnouncementLoading />
		<RectangularAnnouncementLoading />
		<RectangularAnnouncementLoading />
		<RectangularAnnouncementLoading />
	</>
)

export default function ProfileAnnouncements() {
	const [userAnnouncementsList, setUserAnnouncementsList] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const getUserAnnouncements = async () => {
			try {
				const announcementsData = await userAnnouncements()
				setUserAnnouncementsList(announcementsData)
			} catch {
				setUserAnnouncementsList([])
			} finally {
				setIsLoading(false)
			}
		}
		getUserAnnouncements()
	}, [])

	return (
		<div className='container-fluid'>
			<div className='row'>
				<h5 className='tab-title'>Moje ogłoszenia</h5>
				<article className='account-box'>
					<TabControl>
						<div title='Aktywne ogłoszenia'>
							<h3>Twoje aktywne ogłoszenia</h3>
							<hr />
							<div className='container-fluid'>
								{isLoading ? (
									<LoadingAnnouncements />
								) : userAnnouncementsList.active_announcements &&
								  userAnnouncementsList.active_announcements.length > 0 ? (
									userAnnouncementsList.active_announcements.map(a => (
										<RectangularAnnouncement
											key={a.id}
											id={a.id}
											image={a.first_image}
											title={a.title}
											price={a.price}
											created_at={a.created_at}
											tags={a.tags}
											edit={true}
										/>
									))
								) : (
									<NoAnnouncements />
								)}
							</div>
						</div>
						<div title='Oczekujące ogłoszenia'>
							<h3>Twoje oczekujące ogłoszenia</h3>
							<hr />
							<div className='container-fluid'>
								{isLoading ? (
									<LoadingAnnouncements />
								) : userAnnouncementsList.pending_announcements &&
								  userAnnouncementsList.pending_announcements.length > 0 ? (
									userAnnouncementsList.pending_announcements.map(a => (
										<RectangularAnnouncement
											key={a.id}
											id={a.id}
											image={a.first_image}
											title={a.title}
											price={a.price}
											created_at={a.created_at}
											tags={a.tags}
											edit={true}
										/>
									))
								) : (
									<NoAnnouncements />
								)}
							</div>
						</div>
						<div title='Zakończone ogłoszenia'>
							<h3>Twoje zakończone ogłoszenia</h3>
							<hr />
							<div className='container-fluid'>
								{isLoading ? (
									<LoadingAnnouncements />
								) : userAnnouncementsList.completed_announcements &&
								  userAnnouncementsList.completed_announcements.length > 0 ? (
									userAnnouncementsList.completed_announcements.map(a => (
										<RectangularAnnouncement
											key={a.id}
											id={a.id}
											image={a.first_image}
											title={a.title}
											price={a.price}
											created_at={a.created_at}
											tags={a.tags}
											disabled={true}
										/>
									))
								) : (
									<NoAnnouncements />
								)}
							</div>
						</div>
					</TabControl>
				</article>
			</div>
		</div>
	)
}
