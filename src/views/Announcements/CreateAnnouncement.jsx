import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getSuggestions } from '../../services/Api'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Select from 'react-select'
import '../../assets/styles/CreateAnnouncement.scss'

const selectStyle = {
	control: provided => ({
		...provided,
		border: 'none',
		borderRadius: '10px',
		padding: '10px 15px',
		boxShadow: '0px 0px 10px 0px rgba(237, 237, 237, 1)',
		opacity: 0.6,
		transition: 'opacity 0.4s',
		'&:focus': {
			outline: 'none',
			opacity: 1,
			boxShadow: '0px 0px 10px 0px rgba(0, 0, 255, 0.7)', // Inny shadow dla aktywnego focusu
		},
	}),
}

const Step1 = () => {
	const temporaryCategories = [
		{ id: 1, name: 'Kategoria 1' },
		{ id: 2, name: 'Kategoria 2' },
		{ id: 3, name: 'Kategoria 3' },
		{ id: 4, name: 'Kategoria 4' },
		{ id: 5, name: 'Kategoria 5' },
		{ id: 6, name: 'Kategoria 6' },
	]

	const temporarySubCategories = [
		{ id: 1, categoryId: 1, name: 'Podkategoria 1' },
		{ id: 2, categoryId: 2, name: 'Podkategoria 2' },
		{ id: 3, categoryId: 3, name: 'Podkategoria 3' },
		{ id: 4, categoryId: 4, name: 'Podkategoria 4' },
		{ id: 5, categoryId: 5, name: 'Podkategoria 5' },
		{ id: 6, categoryId: 6, name: 'Podkategoria 6' },
	]

	const categoryOptions = temporaryCategories.map(category => ({
		value: category.id,
		label: category.name,
	}))

	const subcategoryOptions = temporarySubCategories.map(subcategory => ({
		value: subcategory.id,
		label: subcategory.name,
	}))

	const titleInputRef = useRef(null)
	const [titleValue, setTitleValue] = useState('')
	const [titleError, setTitleError] = useState('')

	const [suggestions, setSuggestions] = useState([]) // Stan do przechowywania sugestii
	const [typingTimer, setTypingTimer] = useState(null)
	const [hasFocus, setHasFocus] = useState(false)
	const [blurTimer, setBlurTimer] = useState(null)

	const handleInputFocus = () => {
		clearTimeout(blurTimer)
		setHasFocus(true)
	}

	const handleInputBlur = () => {
		setBlurTimer(setTimeout(() => setHasFocus(false), 200))
	}

	const fetchSuggestions = async value => {
		try {
			const response = await getSuggestions(value)
			console.log(response)
			setSuggestions(response)
		} catch (error) {
			console.log(error)
			setSuggestions([])
		}
	}
	const handleChangeTitleInput = e => {
		setTitleValue(e.target.value)
		clearTimeout(typingTimer)
		setTypingTimer(
			setTimeout(() => {
				fetchSuggestions(e.target.value)
			}, 200)
		)
	}

	const handleSuggestionClick = suggestion => {
		setTitleValue(suggestion)
		setSuggestions([])
		titleInputRef.current.focus()
	}

	const handleNextStep = () => {
		if (!titleValue.trim()) {
			setTitleError('Pole Tytuł ogłoszenia jest wymagane.')
		} else {
			// Możesz przenieść funkcjonalność obsługi przycisku "Dalej" tutaj
			// np. przechodzenie do kolejnego kroku itp.
			console.log('Submit Step 1:', titleValue)
			setTitleError('')
		}
	}

	return (
		<>
			<div className='form-group mt-2'>
				<div className='form-input'>
					<label htmlFor='title'>Tytuł ogłoszenia:</label>

					<div className='sugestion-input active'>
						<input
							type='text'
							id='title'
							name='title'
							placeholder='np. Konsola PlayStation 4'
							value={titleValue}
							onChange={handleChangeTitleInput}
							onFocus={handleInputFocus}
							onBlur={handleInputBlur}
							ref={titleInputRef}
						/>
						{titleError && <div className='error-message'>{titleError}</div>}
						{hasFocus && titleValue && suggestions?.length > 0 && (
							<div className={`sugestion-input`}>
								<div className='suggestions'>
									{suggestions.map((suggestion, index) => (
										<div
											className='suggestion-element'
											key={index}
											onClick={() => handleSuggestionClick(suggestion)}>
											<p>{suggestion}</p>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className='form-group mt-3'>
				<div className='form-input'>
					<label htmlFor='category'>Kategoria Ogłoszenia:</label>
					<Select options={categoryOptions} placeholder={'np. Elektronika'} styles={selectStyle} />
				</div>
			</div>
			<div className='form-group mt-3'>
				<div className='form-input'>
					<label htmlFor='subcategory'>Podkategoria Ogłoszenia:</label>
					<Select
						options={categoryOptions}
						placeholder={'np. Konsole PlayStation'}
						styles={selectStyle}
					/>
				</div>
			</div>
			<div className='d-flex mt-3 justify-content-end'>
				<button type='submit' className='btn-design btn-long' onClick={handleNextStep}>
					Dalej
					<i>
						<FontAwesomeIcon icon='fa-solid fa-chevron-right' />
					</i>
				</button>
			</div>
		</>
	)
}

const Step2 = () => {
	return <p>Krok 2</p>
}

const Step3 = () => {
	return <p>Krok 3</p>
}

const Step4 = () => {
	return <p>Krok 4</p>
}

const CreateAnnouncement = () => {
	const [activeStep, setActiveStep] = useState(1)

	const progressItems = [
		{
			title: 'Co chcesz sprzedać?',
			subTitle: 'Tutaj decydujesz co chcesz sprzedać',
			icon: 'fa-regular fa-file',
		},
		{
			title: 'Galeria zdjęć',
			subTitle: 'Tutaj możesz dodać zdjęcia i opis do swojego ogłoszenia',
			icon: 'fa-solid fa-images',
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

	const getCurrentStepComponent = () => {
		switch (activeStep) {
			case 1:
				return <Step1 />
			case 2:
				return <Step2 />
			case 3:
				return <Step3 />
			case 4:
				return <Step4 />
			default:
				return null
		}
	}

	const handleChangeStep = step => {
		setActiveStep(step)
	}

	return (
		<>
			<div className='container'>
				<div className='col-12 mt-4 createAnnouncement-page-title'>
					<h3 className='title'>Dodaj swoje nowe ogłoszenie</h3>
					<p>
						Cieszymy się, że wybrałeś naszą platformę, która ułatwi Ci tworzenie interesujących
						ogłoszeń. Nasz kreator pomoże Ci w kilku prostych krokach stworzyć wyjątkowe ogłoszenie,
						które przyciągnie uwagę potencjalnych klientów.
					</p>
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
								<motion.div
									key={activeStep}
									initial={{ opacity: 0, y: '-100%' }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: '100%' }}
									transition={{ duration: 0.5 }}>
									{getCurrentStepComponent()}
								</motion.div>
							</article>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default CreateAnnouncement
