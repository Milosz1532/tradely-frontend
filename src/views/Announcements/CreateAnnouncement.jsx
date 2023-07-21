import React, { useRef, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getAnnouncementCategories } from '../../services/Api'

import '../../assets/styles/CreateAnnouncement.scss'

// STEPS
import Step1 from '../../components/CreateAnnouncement/steps/Step1'
import Step2 from '../../components/CreateAnnouncement/steps/Step2'
import Step3 from '../../components/CreateAnnouncement/steps/Step3'
import Step4 from '../../components/CreateAnnouncement/steps/Step4'
import Step5 from '../../components/CreateAnnouncement/steps/Step5'

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
		title: 'Podsumowanie',
		subTitle: 'Podsumowanie',
		icon: 'fa-regular fa-circle-check',
	},
]

const CreateAnnouncement = () => {
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
	const [priceInput, setPriceInput] = useState('')
	const [selectedPriceType, setSelectedPriceType] = useState('')

	// STEP 4 //

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
				return <Step5 />
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
		console.log(step)
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
		setActiveStep(step)
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
								{/* <motion.div
									key={activeStep}
									initial={{ opacity: 0, y: '-100%' }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: '100%' }}
									transition={{ duration: 0.5 }}>
									{getCurrentStepComponent()}
								</motion.div> */}
								{getCurrentStepComponent()}
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
							</article>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default CreateAnnouncement
