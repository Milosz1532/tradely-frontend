import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ReactLoading from 'react-loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getSuggestions } from '../../services/Api'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Select from 'react-select'
import '../../assets/styles/CreateAnnouncement.scss'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import { useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const IMAGES_LIMIT = 8

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
			boxShadow: '0px 0px 10px 0px rgba(0, 0, 255, 0.7)',
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
			<article>
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
						<Select
							options={categoryOptions}
							placeholder={'np. Elektronika'}
							styles={selectStyle}
						/>
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
			</article>

			<div className='create-announcement-bottom-buttons single'>
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

const ImageUploader = ({ image, onDelete, index, moveImage }) => {
	const [loading, setLoading] = useState(true)
	const ref = useRef(null)

	const [, drop] = useDrop({
		accept: 'ImageUploader',
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
		type: 'ImageUploader',
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
		<div ref={ref} className={`col-md-3 mt-3 `}>
			<div className={`create-announcement-image-box ${isDragging ? 'dragging' : ''}`}>
				{index === 0 && (
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

const Step2 = () => {
	const [images, setImages] = useState([])

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

	const moveImage = (fromIndex, toIndex) => {
		const newImages = [...images]
		const [movedImage] = newImages.splice(fromIndex, 1)
		newImages.splice(toIndex, 0, movedImage)
		setImages(newImages)
	}

	return (
		<>
			<article>
				<span>
					Możesz ustawić kolejnosć wyświetlanych zdjęc przeciągając je między sobą. Pierwsze zdjęcie
					będzie zdjęciem głównym twojego ogłoszenia.
				</span>
				<div className='row'>
					{images.length > 0 && (
						<DndProvider backend={HTML5Backend}>
							{images.map((image, index) => (
								<ImageUploader
									key={image.id}
									image={image.file}
									onDelete={() => deleteImage(image.id)}
									index={index}
									moveImage={moveImage}
								/>
							))}
						</DndProvider>
					)}
					<EmptyImageUploader addImage={addImage} />
				</div>
				<span className='create-announcement-images-count d-flex justify-content-end me-2 mt-2'>
					<i className='me-2'>
						<FontAwesomeIcon icon='camera-retro' />
					</i>
					{images.length} / {IMAGES_LIMIT}
				</span>
			</article>
		</>
	)
}

const Step3 = () => {
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

	// TAGS

	const tagsInput = useRef()
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

	return (
		<>
			<div className='row'>
				<div className='col-md-12 '>
					<div className='form-input'>
						<label htmlFor='title'>Opis ogłoszenia:</label>

						<ReactQuill
							// style={{ maxHeight: '500px', overflow: 'scroll' }}
							className='quill'
							theme='snow'
							modules={module}
							value={description}
							onChange={setDescription}
						/>
					</div>
				</div>
				<div className='mt-3'>
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
							placeholder={tagsArray.length > 0 ? '' : 'np. Gwarancja'}
						/>
					</div>
				</div>
			</div>
			<div className='create-announcement-bottom-buttons'>
				<button type='submit' className='btn-design btn-long'>
					<i className='me-2'>
						<FontAwesomeIcon icon='fa-solid fa-angle-left' />
					</i>
					Wróć
				</button>
				<button type='submit' className='btn-design btn-long'>
					Dalej
					<i className='ms-2'>
						<FontAwesomeIcon icon='fa-solid fa-chevron-right' />
					</i>
				</button>
			</div>
		</>
	)
}

const Step4 = () => {
	const [selectedOption, setSelectedOption] = useState(0)

	const formatValue = value => {
		if (isNaN(value)) return ''

		const parts = value.toString().split('.')
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

		return parts.join(',')
	}

	const [inputValue, setInputValue] = useState(0)

	const handleChange = event => {
		const { value } = event.target
		const numericValue = value.replace(/[^\d]/g, '')
		if (Number(numericValue) >= 0 && Number(numericValue) <= 1000000) {
			setInputValue(Number(numericValue))
		}
	}

	return (
		<>
			<div className='row px-3'>
				<p className='create-announement-tab-title p-0'>Wybierz rodzaj płatności</p>
				<div className='create-announcement-price-buttons'>
					<button
						className={`${selectedOption === 1 && 'active'}`}
						onClick={() => setSelectedOption(1)}>
						Kwota
					</button>
					<button
						className={`${selectedOption === 2 && 'active'}`}
						onClick={() => setSelectedOption(2)}>
						Zamienię
					</button>
					<button
						className={`${selectedOption === 3 && 'active'}`}
						onClick={() => setSelectedOption(3)}>
						Oddam za darmo
					</button>
				</div>

				<div className='mt-3'>
					{selectedOption === 1 && (
						<div className='form-input'>
							<label>Kwota</label>
							<input
								type='text'
								placeholder='Wprowadź kwotę...'
								value={formatValue(inputValue)}
								onChange={handleChange}
							/>
						</div>
					)}
				</div>
			</div>
			<div className='create-announcement-bottom-buttons'>
				<button type='submit' className='btn-design btn-long'>
					<i className='me-2'>
						<FontAwesomeIcon icon='fa-solid fa-angle-left' />
					</i>
					Wróć
				</button>
				<button type='submit' className='btn-design btn-long'>
					Dalej
					<i className='ms-2'>
						<FontAwesomeIcon icon='fa-solid fa-chevron-right' />
					</i>
				</button>
			</div>
		</>
	)
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
							</article>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default CreateAnnouncement
