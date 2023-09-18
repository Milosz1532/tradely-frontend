import noImage from '/images/no-image.png'
import { NavLink } from 'react-router-dom'

export default function featuredAnnouncement({
	id,
	title,
	price,
	price_type,
	image,
	location,
	category,
}) {
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
		<NavLink to={`/announcement/${id}`} style={{ all: 'unset', cursor: 'pointer' }}>
			<div className='featured-announcement-box'>
				<img draggable='false' src={image ? image : noImage} alt='announcement-image' />

				<div className='featured-announcement-box-content'>
					<p className='featured-announcement-box-content-title'>{title}</p>
					<p className='featured-announcement-box-content-price'>{announcementPrice}</p>
				</div>
			</div>
		</NavLink>
	)
}
