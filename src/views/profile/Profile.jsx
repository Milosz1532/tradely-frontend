import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import noImage from '/images/no-image.png'

const AnnouncementDetailsSquare = () => {
	return (
		<div className='col-12 col-xl-2 col-lg-4 col-md-6 col-sm-12 mt-4'>
			<div className='announcement-details-square'>
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

export default function Profile() {
	return (
		<>
			<h5 className='tab-title'>Profil</h5>
			<article className='account-box'>
				<h5 className='box-title'>Statystyki</h5>
				<div className='row'>
					<div className='col-3 p-3'>
						<div className='profile-stats-box'>
							<div className='icon'>
								<i>
									<FontAwesomeIcon icon='fa-solid fa-bullhorn' />
								</i>
							</div>
							<p className='stats-box-title'>Wszystkie ogłoszenia</p>
							<p className='stats-box-count'>214</p>
						</div>
					</div>
					<div className='col-3 p-3'>
						<div className='profile-stats-box'>
							<div className='icon'>
								<i>
									<FontAwesomeIcon icon='fa-solid fa-chart-line' />
								</i>
							</div>
							<p className='stats-box-title'>Aktywne ogłoszenia</p>
							<p className='stats-box-count'>214</p>
						</div>
					</div>

					<div className='col-3 p-3'>
						<div className='profile-stats-box'>
							<div className='icon'>
								<i>
									<FontAwesomeIcon icon='fa-solid fa-heart' />
								</i>
							</div>
							<p className='stats-box-title'>Polubione ogłoszenia</p>
							<p className='stats-box-count'>214</p>
						</div>
					</div>

					<div className='col-3 p-3'>
						<div className='profile-stats-box'>
							<div className='icon'>
								<i>
									<FontAwesomeIcon icon='fa-solid fa-star' />
								</i>
							</div>
							<p className='stats-box-title'>Twoja opinia</p>
							<div className='stats-box-stars'>
								<i>
									<FontAwesomeIcon icon='fa-solid fa-star' />
								</i>
								<i>
									<FontAwesomeIcon icon='fa-solid fa-star' />
								</i>
								<i>
									<FontAwesomeIcon icon='fa-solid fa-star' />
								</i>
								<i>
									<FontAwesomeIcon icon='fa-solid fa-star' />
								</i>
								<i>
									<FontAwesomeIcon icon='fa-regular fa-star' />
								</i>
							</div>
						</div>
					</div>
				</div>
			</article>

			<article className='account-box'>
				<h5 className='box-title'>Najnowsze ogłoszenia</h5>
				<div className='row'>
					<AnnouncementDetailsSquare />
					<AnnouncementDetailsSquare />
				</div>
			</article>
		</>
	)
}
