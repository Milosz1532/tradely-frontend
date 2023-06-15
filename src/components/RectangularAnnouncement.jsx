import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'

import noImage from '/images/no-image.png'

export const RectangularAnnouncement = ({ id, image, title, price, created_at }) => {
	return (
		<div className='col-12 rectangular-announcement mt-2'>
			<NavLink to={`/announcement/${id}`} style={{ all: 'unset', cursor: 'pointer' }}>
				<div className='row'>
					<div className='col-2 rectangular-announcement-image'>
						<img src={image ? image : noImage} alt='Announcement photo' />
					</div>
					<div className='col-10 rectangular-announcement-content'>
						<div className='reactangular-announement-top-section'>
							<h5 className='title'>{title}</h5>
							<h5 className='price'>{price ? `${price} zł` : 'Za darmo'}</h5>
						</div>
						<ul className='tags'>
							<li>NOWY</li>
							<li>GWARANCJA</li>
							<li>IPHONE</li>
							<li>TELEFON</li>
						</ul>
						<div className='location'>
							<span>13.06.2023 12:00</span>
							<span>Włocławek, 87-800</span>
						</div>
						<i className='favorite-icon'>
							<FontAwesomeIcon icon='fa-regular fa-heart' />
						</i>
					</div>
				</div>
			</NavLink>
		</div>
	)
}

export const RectangularAnnouncementLoading = () => {
	return (
		<div className='col-12 rectangular-announcement mt-2'>
			<div className='row'>
				<div className='col-2 rectangular-announcement-image'>
					<div className='ms-3 mt-1'>
						<Skeleton height={100} />
					</div>
				</div>
				<div className='col-10 rectangular-announcement-content'>
					<div className='reactangular-announement-top-section'>
						<h5 className='title'>
							<Skeleton width={200} />
						</h5>
						<h5 className='price'>
							<Skeleton width={100} />
						</h5>
					</div>
					<ul className='tags'>
						<li>
							<Skeleton width={60} />
						</li>
						<li>
							<Skeleton width={80} />
						</li>
						<li>
							<Skeleton width={100} />
						</li>
						<li>
							<Skeleton width={80} />
						</li>
					</ul>
					<div className='location'>
						<span>
							<Skeleton width={120} />
						</span>
						<span>
							<Skeleton width={120} />
						</span>
					</div>
					<i className='favorite-icon'>
						<Skeleton circle={true} height={20} width={20} />
					</i>
				</div>
			</div>
		</div>
	)
}

export default {
	RectangularAnnouncement,
	RectangularAnnouncementLoading,
}
