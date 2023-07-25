import noImage from '/images/no-image.png'
import { NavLink } from 'react-router-dom'

export default function featuredAnnouncement({ id, title, price, image, location, category }) {
	const formattedAmount = new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency: 'PLN',
		useGrouping: true,
	}).format(price)

	return (
		<NavLink to={`/announcement/${id}`} style={{ all: 'unset', cursor: 'pointer' }}>
			<div className='featured-announcement-box '>
				<img draggable='false' src={image ? image : noImage} alt='announcement-image' />

				<div className='featured-announcement-box-content'>
					<p className='featured-announcement-box-content-title'>{title}</p>
					<p className='featured-announcement-box-content-price'>{formattedAmount}</p>
				</div>
			</div>
		</NavLink>
	)
}
