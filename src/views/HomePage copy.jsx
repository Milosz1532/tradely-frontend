import React, { useState, useEffect } from 'react'

import {
	SquareAnnouncement,
	SquareAnnouncementLoading,
} from '../components/Announcements/SquareAnnouncement'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Searchbar from '../components/Layout/Searchbar'
import { Category, LoadingCategory } from '../components/Home/Category'

import { indexAnnouncements, getAnnouncementCategories } from '../services/Api'

import '../assets/styles/Home.scss'

// Images //
import searchBackground from '/images/search-background.jpg'
import adBackground from '/images/advertisement.jpg'

const LoadingAnnouncement = () => {
	return (
		<div className='container mt-5'>
			<div className='section-container mt-3 '>
				<h2 className='home-title'>Najnowsze ogłoszenia</h2>

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
			</div>

			<div className='section-container mt-3 '>
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
		</div>
	)
}

const LoadingCategories = () => {
	return <></>
}

const AnnouncementList = ({ data }) => {
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
						<div className='section-container mt-3 '>
							<h2 className='home-title'>Najnowsze ogłoszenia</h2>

							<div className='row'>{newAnnouncementsList}</div>
						</div>
					</>
				)}
				{data.location_announcements.length !== 0 && (
					<>
						<div className='section-container mt-3'>
							<h2 className='home-title'>W twojej okolicy</h2>
							<div className='row'>{locationAnnouncementsList}</div>
						</div>
					</>
				)}

				{data.category_announcements.length !== 0 && (
					<>
						<div className='section-container mt-3'>
							<h2 className='home-title'>Motoryzacja</h2>

							<div className='row'>{categoryAnnouncementsList}</div>
						</div>
					</>
				)}
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

	var settings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		initialSlide: 0,
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

	return (
		<>
			<section className='search-section' style={{ backgroundImage: `url(${searchBackground}` }}>
				<div className='container p-5'>
					<div className='row'>
						<div className='search-section-title'>
							<h1>WORLD’S LARGEST MARKETPLACE</h1>
							<p>The best place to buy your house, sell your car or find a job in Poland</p>
						</div>
						<Searchbar />
					</div>
				</div>
			</section>

			<div className='container '>
				<section className='pupular-categories'>
					<div className='pupular-categories-content'>
						<h2>Popularne kategorie</h2>

						<div className='row mx-auto'>
							{_loadingCategories ? (
								<Slider {...settings}>
									<LoadingCategory />
									<LoadingCategory />
									<LoadingCategory />
									<LoadingCategory />
								</Slider>
							) : (
								<Slider {...settings}>
									{categories.map(category => (
										<Category
											key={category.id}
											id={category.id}
											name={category.name}
											image={category.image_path}
										/>
									))}
								</Slider>
							)}

							{/* <Category />
								<Category bg={`red`} />
								<Category bg={`green`} />
								<Category bg={`yellow`} />
								<Category bg={`blue`} />
								<Category bg={`purple`} />
								<Category bg={`orange`} />
								<Category bg={`green`} />
								<Category bg={`green`} />
								<Category bg={`green`} />
								<Category bg={`green`} />
								<Category bg={`green`} /> */}
						</div>
					</div>
				</section>
			</div>
			<section className='advertisement-section' style={{ backgroundImage: `url(${adBackground}` }}>
				<div className='advertisement-content-company'>
					<h1>Miejsce na twoją reklamę</h1>
				</div>
			</section>

			{_loadingAnnouncements ? (
				<LoadingAnnouncement />
			) : (
				<AnnouncementList data={announcementsData} />
			)}
		</>
	)
}
