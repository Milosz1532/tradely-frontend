import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import axiosClient from '../../services/Api'
import { getAnnouncementCategories } from '../../services/Api'
import { useSelector } from 'react-redux'

import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { HalfMalf } from 'react-spinner-animated'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'react-spinner-animated/dist/index.css'
import '../../assets/styles/CreateAnnouncement.scss'

// STEPS
import Step1 from '../../components/CreateAnnouncement/steps/Step1'
import Step2 from '../../components/CreateAnnouncement/steps/Step2'
import Step3 from '../../components/CreateAnnouncement/steps/Step3'
import Step4 from '../../components/CreateAnnouncement/steps/Step4'
import Step5 from '../../components/CreateAnnouncement/steps/Step5'
import Step6 from '../../components/CreateAnnouncement/steps/Step6'

const IMAGES_LIMIT = 8

const progressItems = [
	{
		title: 'Co chcesz sprzedać?',
		subTitle: 'Tutaj decydujesz co chcesz sprzedać',
		icon: 'fa-regular fa-file',
	},
	{
		title: 'Galeria zdjęć',
		subTitle: 'Tutaj możesz dodać zdjęcia  do swojego ogłoszenia',
		icon: 'fa-solid fa-images',
	},
	{
		title: 'Opis i tagi',
		subTitle: 'Tutaj możesz dodać opis i tagi do swojego ogłoszenia',
		icon: 'fa-solid fa-file-medical',
	},
	{
		title: 'Twoja wycena',
		subTitle: 'To ty decydujesz ile chcesz zarobić na swoim przedmiocie',
		icon: 'fa-solid fa-coins',
	},
	{
		title: 'Dane kontaktowe',
		subTitle: 'Udostępnij twoje dane kontaktowe, aby można było się z tobą skontaktować',
		icon: 'fa-solid fa-route',
	},
	{
		title: 'Podsumowanie',
		subTitle: 'Podsumowanie',
		icon: 'fa-regular fa-circle-check',
	},
]

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
	let navigate = useNavigate()

	const user = useSelector(state => state.auth.user)

	const [activeStep, setActiveStep] = useState(1)

	// STEP 1 //
	const [titleInput, setTitleInput] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('')
	const [selectedSubCategory, setSelectedSubCategory] = useState('')
	const [categories, setCategories] = useState([])
	// STEP 1 //

	// STEP 2 //
	const [images, setImages] = useState([])
	// STEP 2 //

	// STEP 3 //
	const [description, setDescription] = useState('')
	const [tagsArray, setTagsArray] = useState([])
	const [tagInput, setTagInput] = useState('')
	// STEP 3 //

	// STEP 4 //
	const [priceInput, setPriceInput] = useState(0)
	const [selectedPriceType, setSelectedPriceType] = useState('')
	// STEP 4 //

	// STEP 5 //
	const [locationData, setLocationData] = useState(null)
	const [phoneNumber, setPhoneNumber] = useState('')
	// STEP 5 //

	const [loadingPage, setLoadingPage] = useState(false)

	useEffect(() => {
		const getCategoriesList = async () => {
			try {
				const categoriesData = await getAnnouncementCategories()
				setCategories(categoriesData.categories)
			} catch {
				setCategories([])
			}
		}
		getCategoriesList()
	}, [])

	const getCurrentStepComponent = () => {
		switch (activeStep) {
			case 1:
				return (
					<Step1
						titleInput={titleInput}
						setTitleInput={setTitleInput}
						selectedCategory={selectedCategory}
						setSelectedCategory={setSelectedCategory}
						selectedSubCategory={selectedSubCategory}
						setSelectedSubCategory={setSelectedSubCategory}
						categories={categories}
					/>
				)
			case 2:
				return <Step2 images={images} setImages={setImages} IMAGES_LIMIT={IMAGES_LIMIT} />
			case 3:
				return (
					<Step3
						description={description}
						setDescription={setDescription}
						tagsArray={tagsArray}
						setTagsArray={setTagsArray}
						tagInput={tagInput}
						setTagInput={setTagInput}
					/>
				)
			case 4:
				return (
					<Step4
						priceInput={priceInput}
						setPriceInput={setPriceInput}
						selectedPriceType={selectedPriceType}
						setSelectedPriceType={setSelectedPriceType}
					/>
				)
			case 5:
				return (
					<Step5
						locationData={locationData}
						setLocationData={setLocationData}
						phoneNumber={phoneNumber}
						setPhoneNumber={setPhoneNumber}
					/>
				)
			case 6:
				return <Step6 />
			default:
				return null
		}
	}

	const handleChangeStep = step => {
		if (step >= 2) {
			if (!titleInput.trim() || !selectedCategory || selectedCategory <= 0) {
				toast.error('Wypełnij wszystkie wymagane pola', { autoClose: 1500 })
				return
			}
		}
		if (step >= 4) {
			if (description.length < 25) {
				toast.error('Opis ogłoszenia jest zbyt krótki', { autoClose: 1500 })
				return
			}
		}
		if (step >= 5) {
			if (!selectedPriceType || selectedPriceType <= 0) {
				toast.error('Wypełnij wszystkie wymagane pola', { autoClose: 1500 })

				return
			}
			if (selectedPriceType === 1) {
				if (!priceInput || priceInput <= 0) {
					toast.error('Wypełnij wszystkie wymagane pola', { autoClose: 1500 })
					return
				}
			}
		}
		if (step >= 6) {
			if (!locationData) {
				toast.error(
					'Wybierz miasto z wyskakującej listy, lub zezwól na automatyczną lokalizację.',
					{ autoClose: 2500 }
				)
				return
			}
			if (!phoneNumber || phoneNumber.length < 9) {
				toast.error('Wprowadź numer telefonu', { autoClose: 2500 })
				return
			}
		}
		setActiveStep(step)
	}

	const handleAddAnnouncement = async () => {
		const convertedImages = await Promise.all(
			images.map(async blobURL => {
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
				const formData = new FormData()
				formData.append('title', titleInput)
				formData.append('description', description)
				formData.append('price', priceInput)
				formData.append('price_type', selectedPriceType)
				formData.append('category_id', selectedCategory.value)
				formData.append('location', city)
				formData.append('province', province)
				formData.append('latitude', locationData.lat)
				formData.append('longitude', locationData.lon)
				formData.append('phone_number', phoneNumber)
				tagsData.forEach((tag, index) => {
					formData.append(`tags[${index}]`, tag)
				})

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
			setLoadingPage(false)
		}
	}

	return (
		<>
			<div className='container'>
				<div className='col-12 mt-4 createAnnouncement-page-title'>
					<h3 className='title'>Dodaj swoje nowe ogłoszenie</h3>
				</div>
				<div className='createAnnouncement-container mt-3'>
					<div className='fixed-container'>
						<div className='container-content'>
							<h5 className='container-content-title'>Postęp</h5>
							<div className='progress-container'>
								{progressItems.map((item, index) => (
									<div
										key={index}
										className={`progress-item ${activeStep === index + 1 && 'active'} ${
											activeStep > index + 1 && 'completed'
										}`}>
										<div className='description'>
											<p className='title'>{item.title}</p>
											<p className='sub-title'>{item.subTitle}</p>
										</div>
										<div className='step-number' onClick={e => handleChangeStep(index + 1)}>
											<i>
												<FontAwesomeIcon icon={item.icon} />
											</i>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className='scrollable-container'>
						<div className='container-content'>
							<h5 className='container-content-title'>
								Krok {activeStep}: {progressItems[activeStep - 1].title}
							</h5>
							<article className='create-announcement-step-container'>
								<div className='step-container-content'>{getCurrentStepComponent()}</div>
								{activeStep >= 1 && activeStep < progressItems.length ? (
									<div
										className={`create-announcement-bottom-buttons ${
											activeStep > 1 ? '' : 'single'
										}`}>
										{activeStep > 1 && (
											<button
												type='submit'
												className='btn-design btn-long'
												onClick={() => handleChangeStep(activeStep - 1)}>
												<i className='me-2'>
													<FontAwesomeIcon icon='fa-solid fa-angle-left' />
												</i>
												Wróć
											</button>
										)}
										<button
											type='submit'
											className='btn-design btn-long'
											onClick={() => handleChangeStep(activeStep + 1)}>
											Dalej
											<i className='ms-2'>
												<FontAwesomeIcon icon='fa-solid fa-chevron-right' />
											</i>
										</button>
									</div>
								) : (
									<>
										<div className='row'>
											<div className='col-12 text-center'>
												<button onClick={handleAddAnnouncement} className='btn-design'>
													Dodaj ogłoszenie
												</button>
											</div>
										</div>
									</>
								)}
							</article>
						</div>
					</div>
				</div>
			</div>
			{loadingPage && <BoxLoading text={'Dodajemy twoje ogłoszenie'} />}
		</>
	)
}

export default CreateAnnouncement
