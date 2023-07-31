import noImage from '/images/no-image.png'
import Skeleton from 'react-loading-skeleton'
import { NavLink } from 'react-router-dom'

export function LastViewedAnnouncement({ id, image, title, price, price_type }) {
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
		<>
			<NavLink to={`/announcement/${id}`} style={{ all: 'unset', cursor: 'pointer' }}>
				<div className='section-element mx-2'>
					<div className='last-viewed-announcement'>
						<div className='last-viewed-announcement-image'>
							<img src={image ? image : noImage} alt='Zdjęcie ogłoszenia' />
						</div>
						<div className='last-viewed-announcement-content'>
							<p>{title}</p>
							<p>{announcementPrice}</p>
						</div>
					</div>
				</div>
			</NavLink>
		</>
	)
}

export function LoadingLastViewedAnnouncement() {
	return (
		<>
			<div className='section-element mx-2'>
				<div className='last-viewed-announcement'>
					<div className='last-viewed-announcement-image'>
						<Skeleton className='h-100' />
					</div>
					<div className='last-viewed-announcement-content'>
						<Skeleton width={150} />
						<Skeleton width={120} />

						{/* <p>{title}</p>
						<p>{announcementPrice}</p> */}
					</div>
				</div>
			</div>
		</>
	)
}

export default { LastViewedAnnouncement, LoadingLastViewedAnnouncement }
