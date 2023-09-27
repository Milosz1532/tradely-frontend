import React, { useState, useEffect } from 'react'
import Searchbar from '../components/Layout/Searchbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
	SquareAnnouncement,
	SquareAnnouncementLoading,
} from '../components/Announcements/SquareAnnouncement'
import FeaturedAnnouncement from '../components/Announcements/FeaturedAnnouncement'
import {
	LastViewedAnnouncement,
	LoadingLastViewedAnnouncement,
} from '../components/Announcements/LastViewedAnnouncement'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { indexAnnouncements, getAnnouncementCategories } from '../services/Api'

import Skeleton from 'react-loading-skeleton'

const LoadingLastViewedAnnouncements = () => {
	return (
		<div className='container mt-5'>
			<div className='m-auto' style={{ width: '35%' }}>
				<Skeleton height={35} />
			</div>
			<div className='row mt-3'>
				<div className='col-lg-4 col-md-4'>
					<LoadingLastViewedAnnouncement />
				</div>
				<div className='col-lg-4 col-md-4'>
					<LoadingLastViewedAnnouncement />
				</div>
				<div className='col-lg-4 col-md-4'>
					<LoadingLastViewedAnnouncement />
				</div>
			</div>
		</div>
	)
}

const LoadingAnnouncement = () => {
	return (
		<div className='container mt-5'>
			<div className='m-auto' style={{ width: '35%' }}>
				<Skeleton height={35} />
			</div>
			<div className='row'>
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
			</div>
		</div>
	)
}

const LoadingFeaturedAnnouncements = () => {
	return (
		<>
			<div className='m-auto' style={{ width: '35%' }}>
				<Skeleton height={35} />
			</div>

			<div className='row mt-3'>
				<div className='col-6 mt-2'>
					<Skeleton height={200} />
				</div>
				<div className='col-6 mt-2'>
					<Skeleton height={200} />
				</div>
				<div className='col-4 mt-2'>
					<Skeleton height={250} />
				</div>
				<div className='col-4 mt-2'>
					<Skeleton height={250} />
				</div>
				<div className='col-4 mt-2'>
					<Skeleton height={250} />
				</div>
			</div>
		</>
	)
}

function SlidereNextArrow(props) {
	const { onClick } = props
	return (
		<div className='slider-next-arrow' onClick={onClick}>
			<FontAwesomeIcon icon='fa-solid fa-angle-right' />
		</div>
	)
}

function SliderPrevArrow(props) {
	const { onClick } = props
	return (
		<div className='slider-prev-arrow' onClick={onClick}>
			<i>
				<FontAwesomeIcon icon='fa-solid fa-angle-left' />
			</i>
		</div>
	)
}

const FeaturedAnnouncements = ({ data }) => {
	const announcementslist = data.map((a, index) => (
		<div
			className={`featured-announcement-col col-xl-4 col-md-4 col-sm-4 col-xs-12 mt-2`}
			key={a.id}>
			<FeaturedAnnouncement
				id={a.id}
				title={a.title}
				price={a.price}
				price_type={a.price_type}
				image={a.first_image}
				location={a.location}
				category={a.category}
			/>
		</div>
	))

	return <>{announcementslist}</>
}

export default function HomePage() {
	const [_loadingAnnouncements, _setLoadingAnnouncements] = useState(true)
	const [_loadingCategories, _setLoadingCategories] = useState(true)
	const [categories, setCategories] = useState([null])
	const [announcementsData, setAnnouncementsData] = useState([null])

	useEffect(() => {
		const loadAnnouncements = async () => {
			_setLoadingAnnouncements(true)
			try {
				const recentAnnouncements = JSON.parse(localStorage.getItem('recentAnnouncements')) || []

				const getPosition = () => {
					return new Promise((resolve, reject) => {
						if ('geolocation' in navigator) {
							navigator.geolocation.getCurrentPosition(
								position => {
									const userLatitude = position.coords.latitude
									const userLongitude = position.coords.longitude
									resolve({ userLatitude, userLongitude })
								},
								error => {
									console.error('Błąd pobierania współrzędnych geograficznych:', error.message)
									resolve(null)
								}
							)
						} else {
							resolve(null)
						}
					})
				}

				const position = await getPosition()

				if (position) {
					const { userLatitude, userLongitude } = position
					const response = await indexAnnouncements(
						recentAnnouncements,
						userLatitude,
						userLongitude
					)
					setAnnouncementsData(response.data)
				} else {
					const response = await indexAnnouncements(recentAnnouncements)
					setAnnouncementsData(response.data)
				}

				_setLoadingAnnouncements(false)
			} catch (error) {}
		}

		const fetchCategories = async () => {
			_setLoadingCategories(true)
			try {
				const response = await getAnnouncementCategories()
				setCategories(response)
				_setLoadingCategories(false)
			} catch {}
		}

		loadAnnouncements()
		fetchCategories()
	}, [])

	var lastViewedSliderSettings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		initialSlide: 0,
		nextArrow: <SlidereNextArrow />,
		prevArrow: <SliderPrevArrow />,

		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					initialSlide: 2,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	}

	return (
		<>
			<Searchbar />
			<div className='pb-4'>
				{/* <article>
					{_loadingAnnouncements ? (
						<LoadingLastViewedAnnouncements />
					) : (
						<>
							{announcementsData.recent_announcements.length > 0 && (
								<article>
									<h2 className='announcements-section-title text-center pt-3'>
										Twoje ostatnie wyszukiwania
									</h2>
									<Slider {...lastViewedSliderSettings}>
										{announcementsData.recent_announcements.map(a => (
											<div key={a.id} className='py-3'>
												<LastViewedAnnouncement
													id={a.id}
													image={a.first_image}
													title={a.title}
													price={a.price}
													price_type={a.price_type}
												/>
											</div>
										))}
									</Slider>
								</article>
							)}
						</>
					)}
				</article> */}

				{/* <h2 className='announcements-section-title text-center mt-5'>To może Cię zainteresować</h2>
				<p className='text-center announcements-section-subtitle'>
					Sprawdź ofertę naszych partnerów
				</p> */}

				<section className='container px-xl-5'>
					{_loadingAnnouncements ? (
						<LoadingAnnouncement />
					) : (
						<article>
							<div className='d-flex align-items-end justify-content-between flex-wrap mt-3'>
								<div>
									<h2 className='announcements-section-title'>Najnowsze ogłoszenia</h2>
									<p className='text-sm color-gray m-0'>Ogłoszenia dodane do 24 godzin</p>
								</div>

								<div className='d-none d-md-block text-sm me-2 cursor-pointer'>
									<span className='me-2'>Zobacz więcej</span>
									<i>
										<FontAwesomeIcon icon='fa-solid fa-arrow-right' />
									</i>
								</div>
							</div>
							{/* <AnnouncementSlider data={announcementsData.latest_announcements} /> */}

							<div className='row'>
								{announcementsData.latest_announcements.map(a => (
									<div
										className='col-xl-3 col-md-4 col-sm-6 col-xs-12 col-6 mt-3 px-1 px-md-2 p-0'
										key={a.id}>
										<SquareAnnouncement
											key={a.id}
											id={a.id}
											user_id={a.user_id}
											title={a.title}
											price={a.price}
											price_type={a.price_type}
											created_at={a.created_at}
											image={a.first_image}
											location={a.location}
											category={a.category}
											favorite_count={a.favorite_count}
											is_favorited={a.is_favorited}
											item={a}
										/>
									</div>
								))}
							</div>
						</article>
					)}
				</section>

				{_loadingAnnouncements ? (
					<LoadingAnnouncement />
				) : (
					<section className='second-background py-4 mt-4'>
						<div className='container px-xl-5'>
							{announcementsData.nearby_announcements.length > 0 && (
								<article>
									<div className='d-flex align-items-end justify-content-between flex-wrap mt-3'>
										<div>
											<h2 className='announcements-section-title'>W twojej okolicy</h2>
										</div>

										<div className='d-none d-md-block text-sm me-2 cursor-pointer'>
											<span className='me-2'>Zobacz więcej</span>
											<i>
												<FontAwesomeIcon icon='fa-solid fa-arrow-right' />
											</i>
										</div>
									</div>
									<div className='row'>
										{announcementsData.nearby_announcements.map(a => (
											<div className='col-xl-3 col-md-4 col-sm-6 col-xs-12 col-6 mt-3' key={a.id}>
												<SquareAnnouncement
													key={a.id}
													id={a.id}
													user_id={a.user_id}
													title={a.title}
													price={a.price}
													price_type={a.price_type}
													created_at={a.created_at}
													image={a.first_image}
													location={a.location}
													category={a.category}
													favorite_count={a.favorite_count}
													is_favorited={a.is_favorited}
													item={a}
												/>
											</div>
										))}
									</div>
								</article>
							)}
						</div>
					</section>
				)}

				{_loadingAnnouncements ? (
					<>
						<LoadingFeaturedAnnouncements />
					</>
				) : (
					<>
						<section className='container px-xl-5'>
							<article>
								<div className='d-flex align-items-end justify-content-between flex-wrap mt-3'>
									<div>
										<h2 className='announcements-section-title'>Wyróżnione ogłoszenia</h2>
										<p className='text-sm color-gray m-0'>Ogłoszenia użytkowników Tradely +</p>
									</div>

									<div className='d-none d-md-block text-sm me-2 cursor-pointer'>
										<span className='me-2'>Zobacz więcej</span>
										<i>
											<FontAwesomeIcon icon='fa-solid fa-arrow-right' />
										</i>
									</div>
								</div>
								<div className='row px-2 '>
									<FeaturedAnnouncements data={announcementsData.recent_announcements} />
								</div>
							</article>
						</section>
					</>
				)}
			</div>
		</>
	)
}
