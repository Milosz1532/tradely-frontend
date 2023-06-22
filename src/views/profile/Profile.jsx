import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import AnnouncementDetailsSquare from '../../components/Announcements/AnnouncementDetailsSquare'

export default function Profile() {
	return (
		<div className='container-fluid'>
			<div className='row'>
				<h5 className='tab-title'>Mój profil</h5>
				<article className='account-box'>
					<h5 className='box-title'>Statystyki</h5>
					<div className='row'>
						<div className='col-12 col-xl-3 col-lg-4 col-md-6 col-sm-12 mt-4 p-3'>
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
						<div className='col-12 col-xl-3 col-lg-4 col-md-6 col-sm-12 mt-4 p-3'>
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

						<div className='col-12 col-xl-3 col-lg-4 col-md-6 col-sm-12 mt-4 p-3'>
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

						<div className='col-12 col-xl-3 col-lg-4 col-md-6 col-sm-12 mt-4 p-3'>
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
						<AnnouncementDetailsSquare />
						<AnnouncementDetailsSquare />
					</div>
				</article>
			</div>
		</div>
	)
}
