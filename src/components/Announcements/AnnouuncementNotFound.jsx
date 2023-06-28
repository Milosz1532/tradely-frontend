import React from 'react'
import NoAnnouncementsImg from '/images/noAnnouncements.svg'

export default function AnnouncementNotFound() {
	return (
		<div className='no-announcements d-flex align-items-center flex-column'>
			<h3>Nie znaleziono żadnych ogłoszeń</h3>
			<img
				className='mt-3'
				style={{ maxWidth: '400px', height: '400px' }}
				src={NoAnnouncementsImg}
				alt='Brak ogłoszeń zdjęcie'
			/>
		</div>
	)
}
