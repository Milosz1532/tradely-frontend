import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import noImage from '/images/no-image.png'

export default function AnnouncementDetailsSquare({
	id,
	title,
	price,
	image,
	category,
	favorite_count = 0,
}) {
	const formattedAmount = new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency: 'PLN',
		useGrouping: true,
	}).format(price)

	return (
		<div className='col-12 col-xl-3 col-lg-4 col-md-6 col-sm-12 mt-4'>
			<div className='announcement-details-square mx-3'>
				<div className='announcement-image'>
					<img draggable='false' src={image ? image : noImage} alt='announcement-image' />
				</div>

				<div className='announcement-content'>
					<span className='announcement-category'>{category}</span>
					<div className='announcement-title-section'>
						<p className='announcement-title'>{title}</p>
						<p className='announcement-price'>{formattedAmount}</p>
					</div>
				</div>
				<hr />
				<div className='announcement-stats'>
					<div className='announcement-stat'>
						<i>
							<FontAwesomeIcon icon='fa-regular fa-eye' />
						</i>
						<p>0</p>
					</div>
					<div className='announcement-stat'>
						<i>
							<FontAwesomeIcon icon='fa-regular fa-heart' />
						</i>
						<p>{favorite_count}</p>
					</div>
					<div className='announcement-stat'>
						<i>
							<FontAwesomeIcon icon='fa-regular fa-comments' />
						</i>
						<p>0</p>
					</div>
				</div>
			</div>
		</div>
	)
}
