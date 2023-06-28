import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import moment from 'moment'

import '../../assets/styles/previewAnnouncement.css'
import axiosClient from '../../services/Api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SearchBar from '../../components/Layout/Searchbar'

import noImage from '/images/no-image.png'

import userIcon from '/images/user.png'
import Skeleton from 'react-loading-skeleton'

import Map from '../../components/Announcements/Map'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import NoAnnouncement from '../../components/Announcements/AnnouuncementNotFound'

const LoadingScreen = () => {
	return (
		<div className='container annoucement-section'>
			<div className='row'>
				<div className='col-md-8 p-3'>
					<div className='announcement-images-box p-4'>
						<Skeleton height={350} />
					</div>

					<div className='annoucement-informations'>
						<Skeleton height={30} />
						<Skeleton height={20} width={200} className='mt-3' />
						<Skeleton height={150} className='mt-3' />
					</div>
				</div>

				<div className='col-md-4 p-3'>
					<div className='announcement-user-box'>
						<div className='announcement-user-info'>
							<Skeleton circle={true} width={60} height={60} />
							<div className='annoucement-user-info-user-data p-2'>
								<Skeleton height={10} width={200} />
								<Skeleton height={10} width={150} />
								<Skeleton height={10} width={150} />
							</div>
						</div>
						<div className='p-2'>
							<Skeleton height={90} />
						</div>
					</div>

					<div className='annoucement-user-contact'>
						<Skeleton height={120} />
					</div>
				</div>
			</div>
		</div>
	)
}

const ShowAnnouncement = ({ data }) => {
	const [images, setImages] = useState(data.images)
	const [selectedImage, setSelectedImages] = useState(0)

	const handleChangePhoto = e => {
		if (e === 'next') {
			let IMG_COUNT = images.length - 1
			if (selectedImage < IMG_COUNT) {
				setSelectedImages(prev => prev + 1)
			}
		} else if (e === 'previous') {
			if (selectedImage > 0) {
				setSelectedImages(prev => prev - 1)
			}
		}
	}

	const images_dots = images.map((dot, index) => {
		return (
			<i
				onClick={e => setSelectedImages(index)}
				key={index}
				className={`${selectedImage === index ? 'active' : ''}`}>
				{selectedImage === index ? (
					<FontAwesomeIcon icon='fa-regular fa-circle-dot' />
				) : (
					<FontAwesomeIcon icon='fa-regular fa-circle' />
				)}
			</i>
		)
	})

	return (
		<div className='container previewAnnouncement'>
			<div className='row'>
				<div className='top-information'>
					<p className='top-information-category'>Ogłoszenie - Motoryzacja - Samochody osobowe</p>
					<p className='top-information-back'>Wróć</p>
					<p className='top-information-announcement-id'>Ogłoszenie: {data.id}</p>
				</div>
				<div className='col-lg-8'>
					<section className='announcement-section announcement-image-section'>
						<div className='image'>
							<img src={images.length > 0 ? images[selectedImage] : noImage} />
							<div className='image-arrows'>
								<span onClick={e => handleChangePhoto('previous')} className='arrow-left'>
									<FontAwesomeIcon icon='fa-solid fa-chevron-left' />
								</span>
								<span onClick={e => handleChangePhoto('next')} className='arrow-right'>
									<FontAwesomeIcon icon='fa-solid fa-chevron-right' />
								</span>
							</div>
						</div>
						<div className='image-count'>{images_dots}</div>
					</section>
					<section className='announcement-section announcement-description-section mt-3'>
						<div className='announcement-description-top'>
							<p className='date'>
								Dodane {moment(data.created_at, 'DD.MM.YYYY HH:mm:ss').format('DD.MM.YYYY HH:mm')}
							</p>
							<i>
								<FontAwesomeIcon icon='fa-regular fa-heart' />
							</i>
						</div>
						<div className='announcement-description-title'>
							<h4 className='announcement-title'>{data.title}</h4>
							<h4 className='announcement-price'>{data.price} zł</h4>
							<hr />
						</div>
						<div className='announcement-description-content'>
							<h5>Opis: </h5>
							{/* <div
								className='post__description mt-3'
								dangerouslySetInnerHTML={{ __html: data.description }}
							/> */}
							<ReactQuill value={data.description} readOnly={true} theme={'bubble'} />
						</div>
					</section>
				</div>
				<div className='col-lg-4'>
					<div className='announcement-section announcement-user-section'>
						<h5>Osoba prywatna</h5>
						<div className='announcement-user-info-box'>
							<img src={userIcon} alt='user-icon' />
							<div className='announcement-user-info-box-content'>
								<p className='user-first_last_name'>
									{data.user.first_name && data.user.last_name
										? `${data.user.first_name} ${data.user.last_name}`
										: 'Anonimowy uzytkownik'}
								</p>
								<p className='user-date'>
									Sprzedawca od:{' '}
									{moment(data.user.created_at, 'DD.MM.YYYY HH:mm:ss').format('DD.MM.YYYY')}
								</p>

								<p className='user-items'>Wystawione przedmioty: {data.user.total_announcements}</p>
							</div>
						</div>
						<div className='announcement-user-rate'>
							<p className='rate-title'>Opinia sprzedającego</p>
							<p className='rate-text'>
								<b>Bardzo dobrze:</b> Większość kupujących jest zadowolonych z tego sprzedawcy
							</p>
							<div className='rate-stars'>
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

						<div className='announcement-user-note mt-4'>
							<h5>Notatka</h5>
							<p>
								Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
								Ipsum has been the industry's standard dummy text ever since the 1500s, when an
								unknown printer took a galley of type and scrambled it to make a type specimen book.
							</p>
						</div>
						<div className='announcement-user-buttons'>
							<button>
								<FontAwesomeIcon icon='fa-solid fa-phone' /> Zadzwoń
							</button>
							<button>
								<FontAwesomeIcon icon='fa-regular fa-comments' /> Wyślij wiadomość
							</button>
						</div>
					</div>
					<div className='announcement-section announcement-location mt-2'>
						<h5>Lokalizacja</h5>
						<Map city={data.location.location_name} />
						<div className='location-content mt-2'>
							<span>
								{data.location.location_name}, {data.location.postal_code}{' '}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function PreviewAnnouncement() {
	// useEffect
	const { id } = useParams()
	const [loadingAnnouncement, setLoadingAnnouncement] = useState(true)
	const [announcementData, setAnnouncementData] = useState(null)
	const [notFound, setNotFund] = useState(false)

	useEffect(() => {
		setLoadingAnnouncement(true)
		const API_URL = `/announcements/${id}`
		axiosClient
			.get(API_URL)
			.then(({ data }) => {
				setAnnouncementData(data)
				setLoadingAnnouncement(false)
			})
			.catch(error => {
				setLoadingAnnouncement(false)
				setNotFund(true)
			})
	}, [])

	return (
		<>
			<div className='preview-announcement-search-section mb-3'>
				<div className='container'>
					<h2>Wyszukaj ogłoszenie</h2>
					<SearchBar />
				</div>
			</div>
			{loadingAnnouncement ? (
				<LoadingScreen />
			) : announcementData && announcementData.status.id === 2 && !notFound ? (
				<ShowAnnouncement data={announcementData} />
			) : (
				<NoAnnouncement />
			)}
		</>
	)
}
