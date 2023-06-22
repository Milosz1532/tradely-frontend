import React, { useState, useEffect } from 'react'

import {
	SquareAnnouncement,
	SquareAnnouncementLoading,
} from '../components/Announcements/SquareAnnouncement'
import Searchbar from '../components/Layout/Searchbar'
import { indexAnnouncements } from '../services/SearchService'

import '../assets/styles/Home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Images //
import searchBackground from '/images/search-background.jpg'
import adBackground from '/images/advertisement.jpg'
import Skeleton from 'react-loading-skeleton'

const LoadingAnnouncement = () => {
	return (
		<div className='container mt-5'>
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

const AnnouncementList = ({ data }) => {
	const newAnnouncementsList = data.latest_announcements.map(a => (
		<SquareAnnouncement
			key={a.id}
			id={a.id}
			title={a.title}
			price={a.price}
			created_at={a.created_at}
			image={a.first_image}
			location={a.location}
			category={a.category}
		/>
	))

	const categoryAnnouncementsList = data.category_announcements.map(a => (
		<SquareAnnouncement
			key={a.id}
			id={a.id}
			title={a.title}
			price={a.price}
			created_at={a.created_at}
			image={a.first_image}
			location={a.location}
			category={a.category}
		/>
	))

	if (data.location_announcements.length !== 0) {
		const locationAnnouncementsList = data.location_announcements.map(a => (
			<SquareAnnouncement
				key={a.id}
				id={a.id}
				title={a.title}
				price={a.price}
				created_at={a.created_at}
				image={a.first_image}
			/>
		))
	}

	return (
		<div className='container'>
			<section className='new-announcements'>
				{data.latest_announcements.length !== 0 && (
					<>
						<h2 className='home-title'>Najnowsze ogłoszenia</h2>

						<div className='row'>{newAnnouncementsList}</div>
					</>
				)}
				{data.location_announcements.length !== 0 && (
					<>
						<h2 className='home-title'>W twojej okolicy</h2>
						<div className='row'>{locationAnnouncementsList}</div>
					</>
				)}

				{data.category_announcements.length !== 0 && (
					<>
						<h2 className='home-title mt-4'>Motoryzacja</h2>

						<div className='row'>{categoryAnnouncementsList}</div>
					</>
				)}
			</section>
		</div>
	)
}

export default function HomePage() {
	const [_loadingAnnouncements, _setLoadingAnnouncements] = useState(true)
	const [announcementsData, setAnnouncementsData] = useState([null])

	useEffect(() => {
		const loadAnnouncements = async () => {
			try {
				const response = await indexAnnouncements()
				setAnnouncementsData(response.data)
				_setLoadingAnnouncements(false)
			} catch {}
		}

		loadAnnouncements()
	}, [])

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
							<div className='col-md-2'>
								<div className='category-box'>
									<div className='image-box color-3'>
										<img
											draggable='false'
											src='/images/categories_icons/cars.png'
											alt='Elektronika'
										/>
									</div>
									<div className='title'>Motoryzacja</div>
									<p className='count'>13 543 ogłoszeń</p>
								</div>
							</div>
							<div className='col-md-2'>
								<div className='category-box'>
									<div className='image-box color-3'>
										<img
											draggable='false'
											src='/images/categories_icons/bikes.png'
											alt='Elektronika'
										/>
									</div>
									<div className='title'>Rowery</div>
									<p className='count'>13 543 ogłoszeń</p>
								</div>
							</div>
							<div className='col-md-2'>
								<div className='category-box'>
									<div className='image-box color-3'>
										<img
											draggable='false'
											src='/images/categories_icons/clothes.png'
											alt='Elektronika'
										/>
									</div>
									<div className='title'>Ubrania</div>
									<p className='count'>13 543 ogłoszeń</p>
								</div>
							</div>
							<div className='col-md-2'>
								<div className='category-box'>
									<div className='image-box color-3'>
										<img src='/images/categories_icons/electronicts.png' alt='Elektronika' />
									</div>
									<div className='title'>Elektronika</div>
									<p className='count'>13 543 ogłoszeń</p>
								</div>
							</div>
							<div className='col-md-2'>
								<div className='category-box'>
									<div className='image-box color-3'>
										<img
											draggable='false'
											src='/images/categories_icons/bikes.png'
											alt='Elektronika'
										/>
									</div>
									<div className='title'>Motoryzacja</div>
									<p className='count'>13 543 ogłoszeń</p>
								</div>
							</div>
							<div className='col-md-2'>
								<div className='category-box'>
									<div className='image-box color-3'>
										<img
											draggable='false'
											src='/images/categories_icons/bikes.png'
											alt='Elektronika'
										/>
									</div>
									<div className='title'>Motoryzacja</div>
									<p className='count'>13 543 ogłoszeń</p>
								</div>
							</div>
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
