import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../axios-client'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import '../assets/styles/CreateAnnouncement.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import TopCategories from '../components/TopCategories'

const EmptyImageUploader = ({ onAddImage }) => {
	return (
		<div className='col-md-2 mt-3'>
			<div className='create-announcement-image-box' onClick={onAddImage}>
				<div className='create-announcement-image-box-content'>
					<i>
						<FontAwesomeIcon icon='plus' />
					</i>
					<p>Dodaj następne</p>
				</div>
			</div>
		</div>
	)
}

const ImageUploader = ({ image, onChange, onDelete }) => {
	const fileInput = useRef()

	const handleClick = () => {
		if (image != null) return
		fileInput.current.click()
	}

	const handleChange = ({ target: { files } }) => {
		if (files) {
			onChange(files[0])
		}
	}

	const handleImageClick = () => {
		onDelete()
	}

	return (
		<div className='col-md-2 mt-3'>
			<div onClick={handleClick} className='create-announcement-image-box'>
				<div className='create-announcement-image-box-content'>
					{image ? (
						<div className='image-preview' onClick={handleImageClick}>
							<img src={image} alt='preview' />
							<div className='image-overlay'>
								<FontAwesomeIcon icon='trash-alt' />
							</div>
						</div>
					) : (
						<>
							<i>
								<FontAwesomeIcon icon='camera-retro' />
							</i>
							<p>Dodaj zdjęcie</p>
						</>
					)}
				</div>
				<input ref={fileInput} type='file' accept='image/*' hidden onChange={handleChange} />
			</div>
		</div>
	)
}

const CreateAnnouncement = () => {
	const [images, setImages] = useState([])

	const addImage = () => {
		setImages([...images, null])
	}

	const handleImageChange = (index, file) => {
		const updatedImages = [...images]
		updatedImages[index] = URL.createObjectURL(file)
		setImages(updatedImages)
	}

	const deleteImage = index => {
		const updatedImages = [...images]
		updatedImages.splice(index, 1)
		setImages(updatedImages)
	}

	const titleInput = useRef()
	const categoryInput = useRef()
	const priceInput = useRef()
	const tagsInput = useRef()
	const descriptionInput = useRef()
	const cityInput = useRef()
	const zipCodeInput = useRef()
	const emailInput = useRef()
	const phoneNumberInput = useRef()

	let navigate = useNavigate()

	const handleSubmitAnnouncement = async () => {
		const convertedImages = await Promise.all(
			images.map(async blobURL => {
				const response = await fetch(blobURL)
				const blob = await response.blob()
				return blob
			})
		)

		const formData = new FormData()
		formData.append('title', titleInput.current.value)
		formData.append('description', descriptionInput.current.value)
		formData.append('price', priceInput.current.value)
		formData.append('user_id', 1)
		convertedImages.forEach((image, index) => {
			formData.append(`images[${index}]`, image)
		})

		axiosClient
			.post('/announcements', formData)
			.then(({ data }) => {
				Swal.fire({
					icon: 'success',
					title: 'Ogłoszenie dodane',
					text: 'Twoje ogłoszenie zostało pomyślnie dodane',
					showCloseButton: true,
					showCancelButton: true,
					focusConfirm: false,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#D9D9D9',
					confirmButtonText: 'Przejdź do ogłoszenia',
					cancelButtonText: 'Powrót do strony',
				}).then(result => {
					if (result.isConfirmed) {
						navigate(`/announcement/${data.id}`)
					} else if (result.isDismissed) {
						navigate('/')
					}
				})
			})
			.catch(err => {
				const response = err.response
				if (response && response.status === 422) {
					console.log(response.data.errors)
				}
			})
	}

	return (
		<>
			<TopCategories />
			<div className='container mt-5'>
				<h3 className='home-title'>Dodaj ogłoszenie</h3>

				<section className='create-announcement-section'>
					<div className='row'>
						<div className='col-md-6 standard-input-design mt-2'>
							<p>Tytuł</p>
							<input ref={titleInput} type='text' placeholder='np. Konsola PS4 Pro' />
						</div>
						<div className='col-md-6 standard-input-design mt-2'>
							<p>Cena</p>
							<input ref={priceInput} type='text' placeholder='np. Konsola PS4 Pro' />
						</div>
						<div className='col-md-6 standard-input-design mt-2'>
							<p>Kategoria</p>
							<input ref={categoryInput} type='text' placeholder='np. Konsola PS4 Pro' />
						</div>
						<div className='col-md-6 standard-input-design mt-2'>
							<p>Tagi</p>
							<input ref={tagsInput} type='text' placeholder='np. Konsola PS4 Pro' />
						</div>
					</div>
				</section>
				<section className='create-announcement-section'>
					<h3 className='create-announcement-title'>Zdjęcia</h3>
					<div className='row'>
						{images.map((image, index) => (
							<ImageUploader
								key={index}
								image={image}
								onChange={file => handleImageChange(index, file)}
								onDelete={() => deleteImage(index)}
							/>
						))}
						<EmptyImageUploader onAddImage={addImage} />
					</div>
				</section>

				<section className='create-announcement-section'>
					<h3 className='create-announcement-title'>Opis</h3>

					<div className='row'>
						<div className='col-md-12 '>
							<textarea
								placeholder='Opisz dokładnie produkt, który chcesz sprzedać...'
								className='text-area-design'
								ref={descriptionInput}
								name=''
								id=''
								cols='30'
								rows='10'></textarea>
						</div>
					</div>
				</section>

				<section className='create-announcement-section'>
					<h3 className='create-announcement-title'>Lokalizacja</h3>

					<div className='row'>
						<div className='col-md-6 standard-input-design mt-2'>
							<p>Miasto</p>
							<input ref={cityInput} type='text' placeholder='np. Warszawa' />
						</div>
						<div className='col-md-6 standard-input-design mt-2'>
							<p>Kod pocztowy</p>
							<input ref={zipCodeInput} type='text' placeholder='np. 00-001' />
						</div>
					</div>
				</section>
				<section className='create-announcement-section'>
					<h3 className='create-announcement-title'>Dane osobowe</h3>

					<div className='row'>
						<div className='col-md-6 standard-input-design mt-2'>
							<p>Adres e-mail</p>
							<input ref={emailInput} type='text' placeholder='twojemail@poczta.pl' />
						</div>
						<div className='col-md-6 standard-input-design mt-2'>
							<p>Numer telefonu</p>
							<input ref={phoneNumberInput} type='text' placeholder='Twój numer telefonu...' />
						</div>
					</div>
				</section>

				<section className='create-announcement-section'>
					<div className='create-announcement-buttons'>
						<button className='white-button-design'>Podgląd ogłoszenia</button>
						<button onClick={handleSubmitAnnouncement} className='color-button-design'>
							Dodaj ogłoszenie
						</button>
					</div>
				</section>
			</div>
		</>
	)
}

export default CreateAnnouncement
