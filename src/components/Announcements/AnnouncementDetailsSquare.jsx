import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import noImage from '/images/no-image.png'

export default function AnnouncementDetailsSquare() {
	return (
		<div className='col-12 col-xl-3 col-lg-4 col-md-6 col-sm-12 mt-4'>
			<div className='announcement-details-square mx-3'>
				<div className='announcement-image'>
					<img draggable='false' src={noImage} alt='announcement-image' />
				</div>

				<div className='announcement-content'>
					<span className='announcement-category'>Motoryzacja Samochody osobowe</span>
					<div className='announcement-title-section'>
						<p className='announcement-title'>Ogłoszenie testowe do profilu</p>
						<p className='announcement-price'>3000 zł</p>
					</div>
				</div>
				<hr />
				<div className='announcement-stats'>
					<div className='announcement-stat'>
						<i>
							<FontAwesomeIcon icon='fa-regular fa-eye' />
						</i>
						<p>10</p>
					</div>
					<div className='announcement-stat'>
						<i>
							<FontAwesomeIcon icon='fa-regular fa-heart' />
						</i>
						<p>10</p>
					</div>
					<div className='announcement-stat'>
						<i>
							<FontAwesomeIcon icon='fa-regular fa-comments' />
						</i>
						<p>10</p>
					</div>
				</div>
			</div>
		</div>
	)
}
