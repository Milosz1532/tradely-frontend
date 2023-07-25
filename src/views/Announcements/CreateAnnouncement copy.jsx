import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axiosClient from '../../services/Api'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'

import '../../assets/styles/CreateAnnouncement.scss'

import withReactContent from 'sweetalert2-react-content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactLoading from 'react-loading'
import ScrollLock from '../../ScrollLock'
import { getAnnouncementCategories } from '../../services/AnnouncementService'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const IMAGES_LIMIT = 5

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
					<input
						ref={fileInput}
						type='file'
						accept='image/*'
						multiple
						hidden
						onChange={handleChange}
					/>
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
									onError={null}
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
	const [categories, setCategories] = useState([])
	const [selectedCategory, setSelectedCategory] = useState(0)
	const user = useSelector(state => state.auth.user)

	useEffect(() => {
		const getCategoriesList = async () => {
			try {
				const categoriesData = await getAnnouncementCategories()
				setCategories(categoriesData)
			} catch {
				setCategories([])
			}
		}
		getCategoriesList()
	}, [])

	const addImage = file => {
		setImages(prevImages => {
			if (prevImages.length < IMAGES_LIMIT) {
				const newImage = {
					id: prevImages.length + 1,
					file: URL.createObjectURL(file),
				}
				return [...prevImages, newImage]
			} else {
				return prevImages
			}
		})
	}

	const deleteImage = id => {
		setImages(prevImages => prevImages.filter(image => image.id !== id))
	}

	const titleInput = useRef()
	const categoryInput = useRef()
	const priceInput = useRef()
	const tagsInput = useRef()
	const cityInput = useRef()
	const zipCodeInput = useRef()
	const emailInput = useRef()
	const phoneNumberInput = useRef()

	let navigate = useNavigate()

	const handleSubmitAnnouncement = async () => {
		console.log(description)

		const fields = [titleInput, priceInput, cityInput, zipCodeInput, emailInput, phoneNumberInput]
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

		if (selectedCategory === 0) {
			Swal.fire({
				icon: 'error',
				title: 'Wypełnij wszystkie pola',
				text: 'Wybierz kategorię ogłoszenia',
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

		const tagsData = tagsArray.map(tag => tag.name)

		const formData = new FormData()
		formData.append('title', titleInput.current.value)
		formData.append('description', description)
		formData.append('price', priceInput.current.value)
		formData.append('user_id', user.id)
		formData.append('category_id', selectedCategory)
		formData.append('location', cityInput.current.value)
		formData.append('postal_code', zipCodeInput.current.value)
		formData.append('phone_number', phoneNumberInput.current.value)
		tagsData.forEach((tag, index) => {
			formData.append(`tags[${index}]`, tag)
		})

		convertedImages.forEach((image, index) => {
			formData.append(`images[${index}]`, image)
		})

		setLoadingScreen(true)

		axiosClient
			.post('/announcements', formData)
			.then(({ data }) => {
				console.log(data)
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
				console.log(response)

				if (response && response.status === 422) {
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

	const [tagsArray, setTagsArray] = useState([])
	const [tagInput, setTagInput] = useState('')

	const handleChangeTagInput = e => {
		if (tagsArray.length >= 5) return
		setTagInput(e.target.value)
	}

	const handleKeyDown = e => {
		if (e.key === 'Enter') {
			e.preventDefault()
			if (tagInput.trim() !== '') {
				setTagsArray([...tagsArray, { id: tagsArray.length++, name: tagInput }])
				setTagInput('')
			}
		}
	}

	const handleTagRemove = tagId => {
		const updatedTagsArray = tagsArray.filter(tag => tag.id !== tagId)
		setTagsArray(updatedTagsArray)
	}

	// DESCRIPTION:

	const [description, setDescription] = useState('')
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'], // toggled buttons

		[{ header: 1 }, { header: 2 }], // custom button values
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ indent: '-1' }, { indent: '+1' }], // outdent/indent

		[{ size: ['small', false, 'large'] }], // custom dropdown

		[{ color: [] }, { background: [] }], // dropdown with defaults from theme
		[{ align: [] }],

		['clean'], // remove formatting button
	]
	const module = {
		toolbar: toolbarOptions,
	}

	return (
		<>
			<div className='container mt-5'>
				<h3 className='create-announcement-title'>Dodaj ogłoszenie</h3>

				<section className='create-announcement-section'>
					<div className='row'>
						<div className='col-md-6 standard-input-design mt-2'>
							<p>Tytuł</p>
							<input ref={titleInput} type='text' placeholder='np. Konsola PS4 Pro' />
						</div>
						<div className='col-md-6 standard-input-design mt-2'>
							<p>Cena</p>
							<input ref={priceInput} type='number' min={0} placeholder='np. 1200' />
						</div>
						<div className='col-md-6 standard-input-design mt-2'>
							<p>Kategoria</p>
							<select
								onChange={e => setSelectedCategory(e.target.value)}
								name='category'
								className='category'>
								<option value={0}>Wybierz kategorie</option>
								{categories.map(option => (
									<option key={option.id} value={option.id}>
										{option.name}
									</option>
								))}
							</select>
						</div>

						<div className='col-md-6 mt-2'>
							<div className='tag-input-title'>
								<p className='title'>Tagi</p>

								<span className='tag-info'>
									{tagsArray.length >= 5 && 'Możesz dodać maksymalnie 5 tagów'}
									{tagInput && `Zatwierdź tag klikając Enter`}
								</span>
							</div>

							<div className='tag-container'>
								{tagsArray.map(tag => (
									<div key={tag.id} className='tag'>
										<i onClick={() => handleTagRemove(tag.id)}>
											<FontAwesomeIcon icon='fa-regular fa-circle-xmark' />
										</i>
										<span>{tag.name}</span>
									</div>
								))}

								<input
									type='text'
									ref={tagsInput}
									value={tagInput}
									onChange={handleChangeTagInput}
									onKeyDown={handleKeyDown}
									placeholder={tagsArray.length > 0 ? '' : 'Np. Gwarancja'}
								/>
							</div>
						</div>
					</div>
				</section>
				<section className='create-announcement-section'>
					<h3 className='create-announcement-title'>Zdjęcia</h3>

					<div className='row'>
						{images.map((image, index) => (
							<ImageUploader
								key={index}
								image={image.file}
								onDelete={() => deleteImage(image.id)}
							/>
						))}
						<EmptyImageUploader addImage={addImage} />
					</div>
					<span className='create-announcement-images-count d-flex justify-content-end me-2'>
						<i className='me-2'>
							<FontAwesomeIcon icon='camera-retro' />
						</i>
						{images.length} / {IMAGES_LIMIT}
					</span>
				</section>

				<section className='create-announcement-section description-section'>
					<h3 className='create-announcement-title'>Opis</h3>

					<div className='row'>
						<div className='col-md-12 '>
							<ReactQuill
								// style={{ maxHeight: '500px', overflow: 'scroll' }}
								theme='snow'
								modules={module}
								value={description}
								onChange={setDescription}
							/>
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
						<button className='btn-design white me-2'>Podgląd ogłoszenia</button>
						<button onClick={handleSubmitAnnouncement} className='btn-design'>
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
