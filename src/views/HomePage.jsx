import React, { useState, useEffect } from 'react'
import Searchbar from '../components/Layout/Searchbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
	SquareAnnouncement,
	SquareAnnouncementLoading,
} from '../components/Announcements/SquareAnnouncement'
import FeaturedAnnouncement from '../components/Announcements/FeaturedAnnouncement'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { indexAnnouncements, getAnnouncementCategories } from '../services/Api'

const LoadingAnnouncement = () => {
	return (
		<div className='container mt-5'>
			<div className='row'>
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
			</div>

			<div className='row'>
				<h2 className='home-title'>W twojej okolicy</h2>
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
				<SquareAnnouncementLoading />
			</div>
		</div>
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

const AnnouncementList = ({ data }) => {
	var settings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 4,
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
		<div className='container'>
			<section className='new-announcements'>
				{data.latest_announcements.length !== 0 && (
					<>
						<h2 className='announcements-section-title text-center mt-5'>Najnowsze ogłoszenia</h2>

						{/* <div className='row'>{newAnnouncementsList}</div> */}
						<div className='row mt-3'>
							<Slider {...settings}>{newAnnouncementsList}</Slider>
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
							<Slider {...settings}>{categoryAnnouncementsList}</Slider>
						</div>
					</>
				)}
			</section>
			<section>
				<h2 className='announcements-section-title text-center mt-5'>Wyróżnione ogłoszenia</h2>
				<p className='text-center announcements-section-subtitle'>
					Ogłoszenia użytkowników Tradely +
				</p>
				<div className='row px-5'>{featuredAnnouncements}</div>
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
				const response = await indexAnnouncements()
				setAnnouncementsData(response.data)
				_setLoadingAnnouncements(false)
			} catch {}
		}
		const fetchCategories = async () => {
			_setLoadingCategories(true)
			try {
				const response = await getAnnouncementCategories()
				setCategories(response)
				_setLoadingCategories(false)
				console.log(response)
			} catch {}
		}

		loadAnnouncements()
		fetchCategories()
	}, [])
	return (
		<>
			<Searchbar />
			<div className='container'>
				<h2 className='announcements-section-title text-center '>Twoje ostatnie wyszukiwania</h2>
				<p className='text-center'>Tutaj będą ostatnio wyszukiwane ogłoszenia</p>

				<h2 className='announcements-section-title text-center mt-5'>To może Cię zainteresować</h2>
				<p className='text-center announcements-section-subtitle'>
					Sprawdź ofertę naszych partnerów
				</p>

				<section>
					{_loadingAnnouncements ? (
						<LoadingAnnouncement />
					) : (
						<AnnouncementList data={announcementsData} />
					)}
				</section>
			</div>
		</>
	)
}
