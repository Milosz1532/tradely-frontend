import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../axios-client'
import Swal from 'sweetalert2'

import '../assets/styles/CreateAnnouncement.css'

import withReactContent from 'sweetalert2-react-content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TopCategories from '../components/TopCategories'
import ReactLoading from 'react-loading'
import ScrollLock from '../ScrollLock'

const LoadingImage = () => (
	<div className='d-flex flex-column justify-content-center align-items-center '>
		<ReactLoading type={'bubbles'} color={'#00A2FF'} width={'100px'} />
		<p>Wczytywanie</p>
	</div>
)

const EmptyImageUploader = ({ addImage }) => {
	const fileInput = useRef()

	const handleClick = () => {
		fileInput.current.click()
	}

	const handleChange = ({ target: { files } }) => {
		if (files) {
			for (let index = 0; index < files.length; index++) {
				addImage(files[index])
			}
		}
	}

	return (
		<div className='col-md-3 mt-3'>
			<div className='create-announcement-image-box' onClick={handleClick}>
				<div className='create-announcement-image-box-content'>
					<i>
						<FontAwesomeIcon icon='plus' />
					</i>
					<p>Dodaj zdjęcie</p>
					<input ref={fileInput} type='file' accept='image/*' multiple hidden onChange={handleChange} />
				</div>
			</div>
		</div>
	)
}

const ImageUploader = ({ image, onDelete }) => {
	const [loading, setLoading] = useState(true)

	const handleImageClick = () => {
		onDelete()
	}

	const handleImageLoad = () => {
		setLoading(false)
	}

	const handleImageError = () => {
		console.log(`Nie udało się wczytywać zdjęcia`)
	}

	return (
		<div className='col-md-3 mt-3'>
			<div className='create-announcement-image-box'>
				<div className='create-announcement-image-box-content'>
					{image ? (
						<div className='image-preview'>
							{loading && <LoadingImage />}
							<>
								<img
									className={loading ? 'loading-image' : ''}
									src={image}
									alt='preview'
									onLoad={handleImageLoad}
									onError={handleImageError}
								/>
								<div className='image-overlay'>
									<i onClick={handleImageClick}>
										<FontAwesomeIcon icon='trash-alt' />
									</i>
								</div>
							</>
						</div>
					) : (
						<>
							<i>
								<FontAwesomeIcon icon='camera-retro' />
							</i>
							<p>Brak zdjęcia</p>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

const CreateAnnouncement = () => {
	const [images, setImages] = useState([])
	const [loadingScreen, setLoadingScreen] = useState(false)

	const addImage = file => {
		console.log(`wywolanie`)
		setImages(prevImages => {
			const newImage = {
				id: prevImages.length + 1,
				file: URL.createObjectURL(file),
			}
			return [...prevImages, newImage]
		})
	}

	const deleteImage = id => {
		setImages(prevImages => prevImages.filter(image => image.id !== id))
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
		const fields = [
			titleInput,
			// categoryInput,
			priceInput,
			// tagsInput,
			descriptionInput,
			// cityInput,
			// zipCodeInput,
			// emailInput,
			// phoneNumberInput,
		]

		let hasEmptyFields = false

		fields.forEach(field => {
			if (field.current.value === '') {
				field.current.classList.add('empty-field')
				hasEmptyFields = true
			} else {
				field.current.classList.remove('empty-field')
			}
		})

		if (hasEmptyFields) {
			Swal.fire({
				icon: 'error',
				title: 'Wypełnij wszystkie pola',
				text: 'Proszę wypełnić wszystkie pola formularza',
				confirmButtonColor: '#3085d6',
			})
			return
		}

		const convertedImages = await Promise.all(
			images.map(async blobURL => {
				const response = await fetch(blobURL.file)
				const blob = await response.blob()
				return blob
			})
		)

		const formData = new FormData()
		formData.append('title', titleInput.current.value)
		formData.append('description', descriptionInput.current.value)
		formData.append('price', priceInput.current.value)
		formData.append('user_id', 1)
		formData.append('category_id', 1)
		formData.append('location', 'Włocławek')
		formData.append('postal_code', '87-800')
		formData.append('phone_number', '123456789')
		convertedImages.forEach((image, index) => {
			formData.append(`images[${index}]`, image)
		})

		setLoadingScreen(true)

		setTimeout(() => {
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
						setLoadingScreen(false)
					})
				})
				.catch(err => {
					const response = err.response
					if (response && response.status === 422) {
						console.log(response.data.errors)
						Swal.fire({
							icon: 'error',
							title: 'Wystąpił błąd',
							text: 'Przekazane dane nie są prawidłowe',
							confirmButtonColor: '#3085d6',
						})
					} else if (response && response.status === 413) {
						Swal.fire({
							icon: 'error',
							title: 'Wystąpił błąd',
							text: 'Zdjęcia posiadają zbyt wysoką rozdzielczość. Przed dodaniem ogłoszenia, zalecamy skompresowanie zdjęć, aby zmniejszyć ich rozmiar',
							confirmButtonColor: '#3085d6',
						})
					} else {
						Swal.fire({
							icon: 'error',
							title: 'Wystąpił błąd',
							text: 'Nie udało się dodać ogłoszenia. Spróbuj ponownie później',
							confirmButtonColor: '#3085d6',
						})
					}
					setLoadingScreen(false)
				})
		}, 1000)
	}

	const LoadingComponent = () => (
		<>
			<ScrollLock />

			<div className='LoadingPageContainer'>
				<div className='loading-content'>
					<ReactLoading type={'bubbles'} color={'#fff'} width={'200px'} height={'200px'} />
					<span>Dodawanie ogłoszenia</span>
				</div>
			</div>
		</>
	)

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
							<ImageUploader key={index} image={image.file} onDelete={() => deleteImage(image.id)} />
						))}
						<EmptyImageUploader addImage={addImage} />
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
			{loadingScreen && <LoadingComponent />}
		</>
	)
}

export default CreateAnnouncement
