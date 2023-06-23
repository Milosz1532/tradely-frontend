import React from 'react'
import NoAnnouncementsIcon from '/images/no-announcements-list.svg'

export default function NoAnnouncements() {
	return (
		<div className='no-announcements'>
			<h4>Brak ogłoszeń</h4>
			<img src={NoAnnouncementsIcon} alt='brak ogłoszeń' />
		</div>
	)
}
