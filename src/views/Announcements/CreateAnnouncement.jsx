import React, { useRef, useState, useEffect } from 'react'
import CategorySelector from '../../components/Layout/CategorySelector'

import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import axiosClient from '../../services/Api'
import { getAnnouncementCategories, getSubcategoryFilters } from '../../services/Api'
import { useSelector } from 'react-redux'

import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { HalfMalf } from 'react-spinner-animated'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'react-spinner-animated/dist/index.css'
import '../../assets/styles/CreateAnnouncement.scss'

import ReactLoading from 'react-loading'
import { useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import Button from '../../components/Layout/Button'
import CustomSelect from '../../components/Layout/CustomSelect'

import PreviewAnnouncement from '../../components/CreateAnnouncement/PreviewAnnouncement'

const EmptyCreateAnnouncementImageBox = ({ addImage }) => {
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
					<i className='color-main'>
						<FontAwesomeIcon icon='plus' />
					</i>
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
const IMAGES_LIMIT = 8

const getLocation = (setCityInput, setLocationData) => {
	if (navigator.geolocation) {
		console.log(`Lokalizuje`)
		navigator.geolocation.getCurrentPosition(
			position => {
				const { latitude, longitude } = position.coords
				const endpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=500&limit=1`

				axios
					.get(endpoint)
					.then(response => {
						const { address } = response.data
						if (address.city) {
							setCityInput(`${address.city}, ${address.state}, ${address.postcode}`)
						} else if (address.village) {
							setCityInput(`${address.village}, ${address.municipality}, ${address.postcode}`)
						} else if (!address.city && !address.village) {
							setCityInput(`Ul. ${address.road}, ${address.municipality}, ${address.postcode}`)
						} else {
							setCityInput(response.data.display_name)
						}
						setLocationData(response.data)
					})
					.catch(error => console.error('Błąd pobierania danych o lokalizacji:', error))
			},
			error => console.error('Błąd geolokalizacji:', error)
		)
	}
}

const getSuggestions = async value => {
	try {
		const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
			value
		)}&limit=5&countrycodes=PL`
		const response = await axios.get(endpoint)
		return response.data
	} catch (error) {
		console.log(error)
		return []
	}
}

const CreateAnnouncementImageBox = ({ image, onDelete, index, moveImage }) => {
	const [loading, setLoading] = useState(true)
	const ref = useRef(null)

	const [, drop] = useDrop({
		accept: 'CreateAnnouncementImageBox',
		hover(item, monitor) {
			if (!ref.current) {
				return
			}
			const dragIndex = item.index
			const hoverIndex = index
			if (dragIndex === hoverIndex) {
				return
			}
			moveImage(dragIndex, hoverIndex)
			item.index = hoverIndex
		},
	})

	const [{ isDragging }, drag] = useDrag({
		type: 'CreateAnnouncementImageBox',
		item: { id: image.id, index },
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	})

	const handleImageClick = () => {
		onDelete()
	}

	const handleImageLoad = () => {
		setLoading(false)
	}

	drag(drop(ref))

	return (
		<div ref={ref} className={`col-md-3 mt-3`}>
			<div className={`create-announcement-image-box ${isDragging ? 'dragging' : ''}`}>
				{index === 0 && !isDragging && (
					<div className='main-image-box'>
						<span>Główne zdjęie</span>
					</div>
				)}
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
									draggable={false}
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

const LoadingImage = () => (
	<div className='d-flex flex-column justify-content-center align-items-center '>
		<ReactLoading type={'bubbles'} color={'#00A2FF'} width={'100px'} />
		<p>Wczytywanie</p>
	</div>
)

const CreateAnnouncementImagesList = ({ images, setImages, addImage }) => {
	const deleteImage = id => {
		setImages(prevImages => prevImages.filter(image => image.id !== id))
	}

	const moveImage = (fromIndex, toIndex) => {
		const newImages = [...images]
		const [movedImage] = newImages.splice(fromIndex, 1)
		newImages.splice(toIndex, 0, movedImage)
		setImages(newImages)
	}

	return (
		<>
			<article>
				<span className='text-xs'>
					Możesz ustawić kolejnosć wyświetlanych zdjęc przeciągając je między sobą. Pierwsze zdjęcie
					będzie zdjęciem głównym twojego ogłoszenia.
				</span>
				<div className='row'>
					{images.length > 0 && (
						<DndProvider backend={HTML5Backend}>
							{images.map((image, index) => (
								<CreateAnnouncementImageBox
									key={image.id}
									image={image.file}
									onDelete={() => deleteImage(image.id)}
									index={index}
									moveImage={moveImage}
								/>
							))}
						</DndProvider>
					)}
					<EmptyCreateAnnouncementImageBox addImage={addImage} />
				</div>
				<span className='create-announcement-images-count d-flex justify-content-end me-2 mt-2 text-sm mb-2'>
					<i className='me-2'>
						<FontAwesomeIcon icon='camera-retro' />
					</i>
					{images.length} / {IMAGES_LIMIT}
				</span>
			</article>
		</>
	)
}

const BoxLoading = ({ text }) => {
	return (
		<>
			<div className='box-loading'>
				<div className='box-loading-content'>
					<h4>{text}</h4>
					<HalfMalf center={false} />
				</div>
			</div>
			<div className='box-loading-shadow'></div>
		</>
	)
}

const CreateAnnouncement = () => {
	// INPUTS //
	const [titleInput, setTitleInput] = useState('')
	const [descriptionInput, setDescriptionInput] = useState('')
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [selectedSubcategory, setSelectedSubcategory] = useState(null)
	const [cityInput, setCityInput] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [selectedProductState, setSelectedProductState] = useState(null)
	const [selectedPriceType, setSelectedPriceType] = useState(null)
	const [priceInput, setPriceInput] = useState(0)

	const [validateForm, setValidateForm] = useState(false)

	// TAGS
	const tagsInput = useRef()
	const [tagsArray, setTagsArray] = useState([])
	const [tagInput, setTagInput] = useState('')

	const handleChangeTagInput = e => {
		if (tagsArray.length >= 5) return
		if (e.target.value.length > 15) return
		setTagInput(e.target.value)
	}

	const handleKeyDown = e => {
		if (e.key === 'Enter') {
			e.preventDefault()
			if (tagInput.trim() !== '' && tagInput.length <= 15) {
				setTagsArray([...tagsArray, { id: tagsArray.length++, name: tagInput }])
				setTagInput('')
			}
		}
	}

	const handleTagRemove = tagId => {
		const updatedTagsArray = tagsArray.filter(tag => tag.id !== tagId)
		setTagsArray(updatedTagsArray)
	}

	const [showCategoriesList, setShowCategoriesList] = useState(false)

	const [loadingPage, setLoadingPage] = useState(false)

	const [categories, setCategories] = useState([])

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

	const handleSelectCategory = category => {
		if (category && category.subcategories.length <= 0) {
			setShowCategoriesList(false)
			setSelectedSubcategory(false)
		}
		setSelectedCategory(category)
	}

	const handleSelectSubcategory = subcategory => {
		setSelectedSubcategory(subcategory)
		setShowCategoriesList(false)
	}

	const productStates = [
		{
			id: 1,
			name: 'Nowy',
			description: 'Nowy, nieużywany przedmiot oryginalnie zapakowany lub z metką',
		},
		{
			id: 2,
			name: 'Używany',
			description:
				'Używany przedmiot w dobrym stanie, z niewielkimi uszkodzeniami i śladami użytkowania',
		},
		{
			id: 3,
			name: 'Uszkodzony',
			description:
				'Używany przedmiot z widocznymi śladami użytkowania i uszkodzeniami, które mogą wpływać na jego funkcjonalność. Opisz w ogłoszeniu wady przedmiotu i dołącz zdjęcia',
		},
	]

	const priceTypes = [
		{
			id: 1,
			name: 'Gotówka',
			icon: 'fa-solid fa-hand-holding-dollar',
			description: 'Nowy, nieużywany przedmiot oryginalnie zapakowany lub z metką daads',
		},
		{
			id: 2,
			name: 'Zamienię',
			icon: 'fa-solid fa-people-arrows',
			description: 'Używany przedmiot w dobrym stanie, z niewielkimi',
		},
		{
			id: 3,
			name: 'Oddam za darmo',
			icon: 'fa-solid fa-gift',
			description:
				'Używany przedmiot z widocznymi śladami użytkowania i uszkodzeniami, które mogą wpływać na jego funkcjonalność. Opisz w ogłoszeniu wady przedmiotu i dołącz zdjęcia',
		},
	]

	const [uploadFiles, setUploadFiles] = useState([])
	const uploadFilesInputRef = useRef()
	const [isDragging, setIsDragging] = useState(false)

	const handleDragOver = e => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = () => {
		setIsDragging(false)
	}

	const handleDrop = e => {
		e.preventDefault()
		setIsDragging(false)
		const files = e.dataTransfer.files
		for (let index = 0; index < files.length; index++) {
			addImage(files[index])
		}
	}

	const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp']
	const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

	const addImage = file => {
		if (file.size <= MAX_FILE_SIZE && ACCEPTED_FORMATS.includes(file.type)) {
			setUploadFiles(prevImages => {
				if (prevImages.length < IMAGES_LIMIT) {
					const newImage = {
						id: prevImages.length + 1,
						file: URL.createObjectURL(file),
					}
					console.log(`Dodaje obraz`)
					return [...prevImages, newImage]
				} else {
					return prevImages
				}
			})
		} else {
			toast.error('Nieprawidłowy format lub rozmiar zdjęcia (maks. 2MB).', { autoClose: 2500 })
		}
	}

	const handleChangeUploadFiles = ({ target: { files } }) => {
		if (files) {
			for (let index = 0; index < files.length; index++) {
				addImage(files[index])
			}
		}
	}

	// LOCATION //

	const [locationData, setLocationData] = useState(null)

	const [suggestions, setSuggestions] = useState([])

	const [typingTimer, setTypingTimer] = useState(null)
	const [hasFocus, setHasFocus] = useState(false)
	const [blurTimer, setBlurTimer] = useState(null)

	const locationInputRef = useRef(null)

	useEffect(() => {
		getLocation(setCityInput, setLocationData)
		locationData && setCityInput(locationData.display_name)
	}, [])

	const formatPhoneNumber = value => {
		const phoneNumberWithoutSpaces = value.replace(/\s/g, '')
		const formattedPhoneNumber = phoneNumberWithoutSpaces.replace(/(\d{3})(?=\d)/g, '$1 ')
		return formattedPhoneNumber
	}

	const handlePhoneNumberChange = e => {
		const { value } = e.target

		const phoneNumberWithoutSpaces = value.replace(/\s/g, '')

		if (/^[0-9]{0,10}$/.test(phoneNumberWithoutSpaces)) {
			setPhoneNumber(phoneNumberWithoutSpaces)
		}
	}

	const fetchSuggestions = async value => {
		const suggestions = await getSuggestions(value)
		setSuggestions(suggestions)
	}

	const handleChangeCityInput = e => {
		const { value } = e.target

		setCityInput(value)
		clearTimeout(typingTimer)
		setTypingTimer(
			setTimeout(() => {
				fetchSuggestions(value)
			}, 500)
		)
	}

	const handleSuggestionClick = suggestion => {
		setCityInput(suggestion.display_name)
		setLocationData(suggestion)
		setSuggestions([])
		locationInputRef.current.focus()
	}

	const handleInputFocus = () => {
		clearTimeout(blurTimer)
		setHasFocus(true)
	}

	const handleInputBlur = () => {
		setBlurTimer(setTimeout(() => setHasFocus(false), 300))
	}

	const [subcategoryFiltersList, setSubcategoryFiltersList] = useState(false)
	const [filterValues, setFilterValues] = useState({})

	useEffect(() => {
		const fetchSubcategoryFilters = async () => {
			if (!selectedSubcategory) return
			// setLoadingFilters(true)
			try {
				const response = await getSubcategoryFilters(selectedSubcategory.id, 'create')
				setSubcategoryFiltersList(response.filters)
				console.log(response.filters)
			} catch (error) {
			} finally {
				// setLoadingFilters(false)
			}
		}
		if (selectedSubcategory) {
			fetchSubcategoryFilters()
		}
	}, [selectedSubcategory])

	const handleFilterChange = (filterId, selectedValue) => {
		setFilterValues(prevFilterValues => ({
			...prevFilterValues,
			[filterId]: selectedValue,
		}))
		console.log(filterValues)
	}

	const handleSubmitAnnouncement = async () => {
		const convertedImages = await Promise.all(
			uploadFiles.map(async blobURL => {
				const response = await fetch(blobURL.file)
				const blob = await response.blob()
				return blob
			})
		)
		const tagsData = tagsArray.map(tag => tag.name)
		const latitude = locationData.lat
		const longitude = locationData.lon
		setLoadingPage(true)
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&limit=1`
			)
			const data = await response.json()
			if (data.address) {
				const city = data.address.city || data.address.town || data.address.village || ''
				let province = data.address.state || data.address.region || ''
				if (province && province.startsWith('województwo')) {
					province = province.replace('województwo', '').trim()
				}
				const filterValuesJSON = JSON.stringify(filterValues)

				const formData = new FormData()
				formData.append('title', titleInput)
				formData.append('description', descriptionInput)
				formData.append('price', priceInput)
				formData.append('price_type', selectedPriceType.id)
				formData.append('category_id', selectedCategory.id)
				formData.append('subcategory_id', selectedSubcategory.id)
				formData.append('location', city)
				formData.append('province', province)
				formData.append('latitude', locationData.lat)
				formData.append('longitude', locationData.lon)
				formData.append('product_state', selectedProductState.id)
				formData.append('phone_number', phoneNumber)
				formData.append('filters', filterValuesJSON)

				tagsData.forEach((tag, index) => {
					formData.append(`tags[${index}]`, tag)
				})
				convertedImages.forEach((image, index) => {
					formData.append(`images[${index}]`, image)
				})

				formData.forEach((value, key) => {
					console.log(key, value)
				})

				axiosClient
					.post('/announcements', formData)
					.then(({ data }) => {
						Swal.fire({
							icon: 'success',
							title: 'Ogłoszenie dodane',
							text: 'Twoje ogłoszenie zostało pomyślnie dodane',
							focusConfirm: false,
							confirmButtonColor: '#3085d6',
							confirmButtonText: 'Przeglądaj ogłoszenia',
						}).then(result => {
							if (result.isConfirmed) {
								navigate('/')
							}
						})
					})
					.catch(err => {
						const response = err.response
						if (response) {
							Swal.fire({
								icon: 'error',
								title: 'Wystąpił błąd',
								text: response.data.message,
								confirmButtonColor: '#3085d6',
							})
						}
					})
					.finally(() => {
						setLoadingPage(false)
					})
			}
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Wystąpił błąd',
				text: 'Spróbuj ponownie za chwile',
				confirmButtonColor: '#3085d6',
			})
			console.log(error)
			setLoadingPage(false)
		}
	}

	useEffect(() => {
		if (
			titleInput &&
			descriptionInput &&
			selectedCategory !== null &&
			locationData &&
			phoneNumber.length >= 9 &&
			selectedProductState !== null &&
			selectedPriceType !== null &&
			(selectedPriceType.id !== 1 || (selectedPriceType.id === 1 && priceInput > 0))
		) {
			setValidateForm(true)
		} else {
			setValidateForm(false)
		}
	}, [
		titleInput,
		descriptionInput,
		selectedCategory,
		selectedSubcategory,
		cityInput,
		phoneNumber,
		selectedProductState,
		selectedPriceType,
		priceInput,
	])

	return (
		<>
			<div className='container mt-5'>
				<div className='row'>
					<div className='col-lg-6 mt-2'>
						<div className='main-content-box'>
							<div className='row'>
								<div className='announcement-add-photos d-flex align-items-center px-4 py-2'>
									<div className='announcement-add-photos-icon color-main'>
										<i className='big-icon'>
											<FontAwesomeIcon icon='fa-solid fa-camera' />
										</i>
									</div>
									<div className='announcement-add-photos-content ms-3'>
										<p className='title'>Dodaj zdjęcia</p>
										<p className='description'>
											Możesz dodać do {IMAGES_LIMIT} zdjęć w formacie JPG, PNG, BMP, WEBP, maks.
											2MB.
										</p>
									</div>
								</div>

								{uploadFiles.length > 0 ? (
									<article className='border-top-bottom'>
										<CreateAnnouncementImagesList
											images={uploadFiles}
											setImages={setUploadFiles}
											addImage={addImage}
										/>
									</article>
								) : (
									<article className='image-uploader-section my-2 border-top-bottom'>
										<div
											className={`image-uploader-drag-section ${isDragging ? 'drag' : ''}`}
											onDragOver={handleDragOver}
											onDrop={handleDrop}
											onDragLeave={handleDragLeave}>
											<input
												type='file'
												multiple
												onChange={handleChangeUploadFiles}
												hidden
												ref={uploadFilesInputRef}
											/>
											{!isDragging ? (
												<div className='image-uploader-drag-content'>
													<h6>Przeciągnij i upuść zdjęcia tutaj</h6>
													<p>lub</p>
													<button onClick={() => uploadFilesInputRef.current.click()}>
														Wybierz zdjęcia z dysku
													</button>
												</div>
											) : (
												<div className='image-uploader-drag-content '>
													<h6>Upuść zdjęcia tutaj</h6>
													<i className='big-icon color-main'>
														<FontAwesomeIcon icon='fa-regular fa-images' />
													</i>
												</div>
											)}
										</div>
									</article>
								)}
								<div className='col-lg-9 col-md-10'>
									<div className='form-input mt-2'>
										<div className='d-flex align-items-center justify-content-between'>
											<label className='required'>Nazwa</label>
											{titleInput.length > 3 && (
												<i className='color-main me-2 icon-sm'>
													<FontAwesomeIcon icon='fa-solid fa-check' />
												</i>
											)}
										</div>
										<input
											type='text'
											value={titleInput}
											onChange={e =>
												setTitleInput(e.target.value.length <= 50 ? e.target.value : titleInput)
											}
											placeholder='Wpisz co chcesz sprzedać...'
										/>
										<span className='text-end me-1 text-xs color-gray'>{titleInput.length}/50</span>
									</div>

									<div className='form-input mt-2'>
										<div className='d-flex align-items-center justify-content-between'>
											<label className='required'>Opis</label>
											{descriptionInput.length > 9 && (
												<i className='color-main me-2 icon-sm'>
													<FontAwesomeIcon icon='fa-solid fa-check' />
												</i>
											)}
										</div>
										<textarea
											value={descriptionInput}
											onChange={e =>
												setDescriptionInput(
													e.target.value.length <= 5000 ? e.target.value : descriptionInput
												)
											}
											type='text'
											placeholder='Opisz dokładnie co chcesz sprzedać'
											rows={4}
										/>
										<span className='text-end me-1 text-xs color-gray'>
											{descriptionInput.length}/5000
										</span>
									</div>

									<div className='mt-3'>
										<div className='tag-input-title'>
											<p className='title'>Tagi</p>

											<span className='tag-info'>
												{tagsArray.length >= 5 && 'Możesz dodać maksymalnie 5 tagów'}
												{tagInput && `Zatwierdź tag klikając Enter`}
											</span>
										</div>

										<div className='tag-container mb-3'>
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
												className={`${tagInput.length >= 15 ? 'color-red' : ''}`}
												ref={tagsInput}
												value={tagInput}
												onChange={handleChangeTagInput}
												onKeyDown={handleKeyDown}
												placeholder={tagsArray.length > 0 ? '' : 'np. Gwarancja'}
											/>
										</div>
									</div>

									<div className='form-input mt-3'>
										<label className='required'>Stan przedmiotu</label>

										{productStates.map(element => (
											<div
												key={element.id}
												onClick={e => setSelectedProductState(element)}
												className={`rectangle-card-element cursor-pointer mt-2 ${
													selectedProductState?.id === element.id ? 'selected' : ''
												}`}>
												<div className='d-flex align-items-center justify-content-between'>
													<p className='title'>{element.name}</p>

													<i className='checked-icon'>
														<FontAwesomeIcon icon='fa-solid fa-check' />
													</i>
												</div>
												<p className='description'>{element.description}</p>
											</div>
										))}
									</div>

									<div className='form-input mt-3'>
										<label className='required'>Kategoria</label>
										{selectedCategory && !showCategoriesList && (
											<div className='selected-category-box'>
												<div className='selected-category-box-content'>
													<i className='icon-md'>
														<FontAwesomeIcon icon={selectedCategory.icon} />
													</i>
													<p>
														{selectedCategory && selectedCategory.name}
														{selectedSubcategory && (
															<span>
																<i className='icon-sm'>
																	<FontAwesomeIcon icon='fa-solid fa-angle-right' />
																</i>
																{selectedSubcategory.name}
															</span>
														)}
													</p>
												</div>
											</div>
										)}

										<p
											className='clickable-label ms-1'
											onClick={e => setShowCategoriesList(!showCategoriesList)}>
											Przeglądaj wszystkie kategorie
										</p>
										{showCategoriesList && (
											<CategorySelector
												categories={categories}
												selectedCategory={selectedCategory}
												handleSelectCategory={handleSelectCategory}
												selectedSubcategory={selectedSubcategory}
												handleSelectSubcategory={handleSelectSubcategory}
											/>
										)}
									</div>

									<div className='form-input mt-2'>
										<label className='required'>Rodzaj płatności</label>

										{priceTypes.map(element => (
											<div
												key={element.id}
												onClick={e => setSelectedPriceType(element)}
												className={`rectangle-card-element cursor-pointer mt-2 ${
													selectedPriceType?.id === element.id ? 'selected color-main' : ''
												}`}>
												<div className='d-flex align-items-center'>
													<div className='p-2'>
														<i className={`rectangle-card-icon`}>
															<FontAwesomeIcon icon={element.icon} />
														</i>
													</div>

													<div className='flex-grow-1'>
														<div className='d-flex align-items-center justify-content-between'>
															<p className='title'>{element.name}</p>

															<i className='checked-icon'>
																<FontAwesomeIcon icon='fa-solid fa-check' />
															</i>
														</div>
														<p className='description'>{element.description}</p>
													</div>
												</div>
											</div>
										))}
									</div>

									{selectedPriceType && selectedPriceType.id === 1 && (
										<div className='form-input mt-3'>
											<div className='d-flex align-items-center justify-content-between'>
												<label className='required'>Cena przedmiotu</label>
												{priceInput.length > 0 && (
													<i className='color-main me-2 icon-sm'>
														<FontAwesomeIcon icon='fa-solid fa-check' />
													</i>
												)}
											</div>
											<input
												value={priceInput}
												onChange={e => {
													const newValue = e.target.value
													if (newValue === '' || (/^\d+$/.test(newValue) && newValue.length <= 7)) {
														setPriceInput(newValue)
													}
												}}
												type='number'
												placeholder='Wprowadź kwotę...'
											/>
										</div>
									)}

									{subcategoryFiltersList && subcategoryFiltersList.length > 0 && (
										<>
											{subcategoryFiltersList.map(filter => (
												<div key={filter.id} className='search-filters-filter mt-3'>
													<div className='form-input'>
														<label>{filter.name}</label>

														{filter.input_type === 'select' && (
															<CustomSelect
																placeholder={filter.placeholder}
																options={filter.values.map(value => ({
																	value: value.id,
																	label: value.value,
																}))}
																value={
																	filterValues[filter.id]
																		? {
																				value: filterValues[filter.id],
																				label: filter.values.find(
																					value => value.id === filterValues[filter.id]
																				)?.value,
																		  }
																		: null
																}
																onChange={selectedOption =>
																	handleFilterChange(
																		filter.id,
																		selectedOption ? selectedOption.value : null
																	)
																}
															/>
														)}
														{filter.input_type === 'input' && (
															<>
																<input
																	type='text'
																	placeholder={filter.placeholder}
																	value={filterValues[filter.id] || ''}
																	onChange={e => handleFilterChange(filter.id, e.target.value)}
																/>
															</>
														)}
													</div>

													{filter.input_type === 'radio' && (
														<>
															{filter.values.map(value => (
																<div key={value.id} className='form-check mt-2'>
																	<input
																		className='form-check-input'
																		type='radio'
																		name={`flexRadioDefault-${filter.id}`}
																		id={`flexRadio-${value.id}`}
																		checked={filterValues[filter.id]?.value === value.id}
																		onChange={() => handleFilterChange(filter.id, value.id)}
																	/>
																	<label
																		className='form-check-label'
																		htmlFor={`flexRadio-${value.id}`}>
																		{value.value}
																	</label>
																</div>
															))}
														</>
													)}
												</div>
											))}
										</>
									)}

									<div className='form-input mt-4'>
										<div className='d-flex justify-content-between'>
											<label className='required'>Twoja lokalizacja</label>
											{locationData && (
												<i className='color-main me-2 icon-sm'>
													<FontAwesomeIcon icon='fa-solid fa-check' />
												</i>
											)}
										</div>

										<div className='sugestion-input checked'>
											<input
												type='text'
												placeholder='Wprowadź miasto lub kod pocztowy...'
												value={cityInput}
												onChange={handleChangeCityInput}
												onFocus={handleInputFocus}
												onBlur={handleInputBlur}
												ref={locationInputRef}
											/>

											{hasFocus && cityInput && suggestions?.length > 0 && (
												<div className='suggestions'>
													{suggestions.map((suggestion, index) => (
														<div
															className='suggestion-element'
															key={index}
															onClick={() => handleSuggestionClick(suggestion)}>
															<p>{suggestion.display_name}</p>
														</div>
													))}
												</div>
											)}
										</div>
										<span
											onClick={e => getLocation(setCityInput, setLocationData)}
											style={{ cursor: 'pointer' }}
											className='ms-1 input-message'>
											Kliknij tutaj, aby wyszukać automatycznie
										</span>
									</div>

									<div className='form-input mt-3'>
										<div className='d-flex align-items-center justify-content-between'>
											<label className='required'>Numer telefonu</label>
											{phoneNumber.length > 8 && (
												<i className='color-main me-2 icon-sm'>
													<FontAwesomeIcon icon='fa-solid fa-check' />
												</i>
											)}
										</div>
										<input
											type='text'
											value={formatPhoneNumber(phoneNumber)}
											onChange={handlePhoneNumberChange}
											placeholder='Wprowadź numer telefonu...'
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='col-lg-6 mt-2 '>
						<div className='main-content-box sticky-column'>
							<h6>Podgląd twojego ogłoszenia</h6>

							<PreviewAnnouncement
								images={uploadFiles}
								title={titleInput}
								description={descriptionInput}
								tagsArray={tagsArray}
								priceInput={priceInput}
								selectedPriceType={selectedPriceType}
								selectedProductState={selectedProductState}
								filterValues={filterValues}
								subcategoryFiltersList={subcategoryFiltersList}
							/>
							<div className='create-announcement-finally mt-4 text-center '>
								<Button
									disabled={!validateForm}
									color={true}
									rounded={true}
									className={'w-50 text-md'}
									onClick={handleSubmitAnnouncement}
									text={'Dodaj ogłoszenie'}></Button>
								<p className='text-sm color-gray mt-2'>
									Wypełnij dokładnie wszystkie pola formularza, aby dodać ogłoszenie
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			{loadingPage && <BoxLoading text={'Przetwarzamy twoje ogłoszenie'} />}
		</>
	)
}

export default CreateAnnouncement
