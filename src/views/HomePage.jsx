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

const AnnouncementSlider = ({ data }) => {
	var sliderSettings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 4,
		initialSlide: 0,
		nextArrow: <SlidereNextArrow />,
		prevArrow: <SliderPrevArrow />,

		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					infinite: true,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
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

	const announcementsList = data.map(a => (
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
	))

	return (
		<>
			{data.length !== 0 && (
				<>
					<div className='row mt-3'>
						<Slider {...sliderSettings}>{announcementsList}</Slider>
					</div>
				</>
			)}
		</>
	)
}

const FeaturedAnnouncements = ({ data }) => {
	const announcementslist = data.map((a, index) => (
		<div
			className={`featured-announcement-col ${
				index < 2 ? 'col-xl-6 col-md-6 col-sm-6 col-xs-12' : 'col-xl-4 col-md-4 col-sm-4 col-xs-12 '
			} px-3 py-2 mt-2`}
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

const AnnouncementList = ({ data }) => {
	var sliderSettings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 4,
		initialSlide: 0,
		nextArrow: <SlidereNextArrow />,
		prevArrow: <SliderPrevArrow />,

		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					infinite: true,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
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

	const newAnnouncementsList = data.latest_announcements.map(a => (
		<SquareAnnouncement
			key={a.id}
			id={a.id}
			user_id={a.user_id}
			title={a.title}
			price={a.price}
			created_at={a.created_at}
			image={a.first_image}
			location={a.location}
			category={a.category}
			favorite_count={a.favorite_count}
			is_favorited={a.is_favorited}
			item={a}
		/>
	))

	const featuredAnnouncements = data.latest_announcements.map((a, index) => (
		<div
			className={`featured-announcement-col ${
				index < 2 ? 'col-xl-6 col-md-6 col-sm-6 col-xs-12' : 'col-xl-4 col-md-4 col-sm-4 col-xs-12 '
			} px-3 py-2 mt-2`}
			key={a.id}>
			<FeaturedAnnouncement
				id={a.id}
				title={a.title}
				price={a.price}
				image={a.first_image}
				location={a.location}
				category={a.category}
			/>
		</div>
	))

	const categoryAnnouncementsList = data.category_announcements.map(a => (
		<SquareAnnouncement
			key={a.id}
			id={a.id}
			user_id={a.user_id}
			title={a.title}
			price={a.price}
			created_at={a.created_at}
			image={a.first_image}
			location={a.location}
			category={a.category}
			favorite_count={a.favorite_count}
			is_favorited={a.is_favorited}
			item={a}
		/>
	))

	if (data.location_announcements.length !== 0) {
		const locationAnnouncementsList = data.location_announcements.map(a => (
			<SquareAnnouncement
				key={a.id}
				user_id={a.user_id}
				id={a.id}
				title={a.title}
				price={a.price}
				created_at={a.created_at}
				image={a.first_image}
				favorite_count={a.favorite_count}
				is_favorited={a.is_favorited}
				item={a}
			/>
		))
	}

	return (
		<div>
			<section className='new-announcements'>
				{data.latest_announcements.length !== 0 && (
					<>
						<h2 className='announcements-section-title text-center mt-5'>Najnowsze ogłoszenia</h2>

						{/* <div className='row'>{newAnnouncementsList}</div> */}
						<div className='row mt-3'>
							<Slider {...sliderSettings}>{newAnnouncementsList}</Slider>
						</div>
					</>
				)}
				{data.location_announcements.length !== 0 && (
					<>
						<h2 className='announcements-section-title text-center mt-5'>
							Ogłoszenia w twojej okolicy
						</h2>

						<div className='row'>{locationAnnouncementsList}</div>
					</>
				)}

				{data.category_announcements.length !== 0 && (
					<>
						<h2 className='announcements-section-title text-center mt-5'>Motoryzacja</h2>

						{/* <div className='row'>{categoryAnnouncementsList}</div> */}
						<div className='row mt-3'>
							<Slider {...sliderSettings}>{categoryAnnouncementsList}</Slider>
						</div>
					</>
				)}
			</section>
			<section>
				<h2 className='announcements-section-title text-center mt-5'>Wyróżnione ogłoszenia</h2>
				<p className='text-center announcements-section-subtitle'>
					Ogłoszenia użytkowników Tradely +
				</p>
				<div className='row px-2 '>{featuredAnnouncements}</div>
			</section>
		</div>
	)
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
			<div className='container px-5'>
				<article>
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
				</article>

				{/* <h2 className='announcements-section-title text-center mt-5'>To może Cię zainteresować</h2>
				<p className='text-center announcements-section-subtitle'>
					Sprawdź ofertę naszych partnerów
				</p> */}

				<section>
					{_loadingAnnouncements ? (
						<LoadingAnnouncement />
					) : (
						<article>
							<h2 className='announcements-section-title text-center mt-5'>Najnowsze ogłoszenia</h2>
							<AnnouncementSlider data={announcementsData.latest_announcements} />
						</article>
					)}

					{_loadingAnnouncements ? (
						<LoadingAnnouncement />
					) : (
						<>
							{announcementsData.nearby_announcements.length > 0 && (
								<article>
									<h2 className='announcements-section-title text-center mt-3'>W twojej okolicy</h2>
									<AnnouncementSlider data={announcementsData.nearby_announcements} />
								</article>
							)}
						</>
					)}

					{_loadingAnnouncements ? (
						<>
							<p>Tutaj</p>
							<LoadingFeaturedAnnouncements />
						</>
					) : (
						<article>
							<h2 className='announcements-section-title text-center mt-3'>
								Wyróżnione ogłoszenia
							</h2>
							<p className='text-center announcements-section-subtitle'>
								Ogłoszenia użytkowników Tradely +
							</p>
							<div className='row px-2 '>
								<FeaturedAnnouncements data={announcementsData.recent_announcements} />
							</div>
						</article>
					)}
				</section>
			</div>
		</>
	)
}
