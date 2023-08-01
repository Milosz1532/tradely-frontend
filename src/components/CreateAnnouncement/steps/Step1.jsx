import { useRef, useState } from 'react'
import { getSuggestions } from '../../../services/Api'

import CustomSelect from '../../Layout/CustomSelect'

const Step1 = ({
	titleInput,
	setTitleInput,
	selectedCategory,
	setSelectedCategory,
	selectedSubCategory,
	setSelectedSubCategory,
	categories,
}) => {
	const titleInputRef = useRef(null)

	const [titleError, setTitleError] = useState('')

	const [suggestions, setSuggestions] = useState([])
	const [typingTimer, setTypingTimer] = useState(null)
	const [hasFocus, setHasFocus] = useState(false)
	const [blurTimer, setBlurTimer] = useState(null)

	const categoryOptions = categories.map(category => ({
		value: category.id,
		label: category.name,
	}))

	const handleInputFocus = () => {
		clearTimeout(blurTimer)
		setHasFocus(true)
	}

	const handleInputBlur = () => {
		setBlurTimer(setTimeout(() => setHasFocus(false), 300))
	}

	const fetchSuggestions = async value => {
		try {
			const response = await getSuggestions(value)
			setSuggestions(response)
		} catch (error) {
			setSuggestions([])
		}
	}
	const handleChangeTitleInput = e => {
		setTitleInput(e.target.value)
		clearTimeout(typingTimer)
		setTypingTimer(
			setTimeout(() => {
				fetchSuggestions(e.target.value)
			}, 100)
		)
	}

	const handleSuggestionClick = suggestion => {
		setTitleInput(suggestion)
		setSuggestions([])
		titleInputRef.current.focus()
	}

	return (
		<>
			<article>
				<div className='form-group mt-2'>
					<div className='form-input'>
						<label className='required' htmlFor='title'>
							Tytuł ogłoszenia
						</label>

						<div className='sugestion-input'>
							<input
								type='text'
								id='title'
								name='title'
								placeholder='np. Konsola PlayStation 4'
								value={titleInput}
								onChange={handleChangeTitleInput}
								onFocus={handleInputFocus}
								onBlur={handleInputBlur}
								ref={titleInputRef}
							/>
							{hasFocus && titleInput && suggestions?.length > 0 && (
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
							)}
						</div>
					</div>
				</div>

				<div className='form-group mt-3'>
					<div className='form-input'>
						<label className='required' htmlFor='category'>
							Kategoria Ogłoszenia
						</label>

						<CustomSelect
							options={categoryOptions}
							placeholder={'Wybierz kategorię'}
							value={selectedCategory}
							onChange={e => setSelectedCategory(e)}
						/>
					</div>
				</div>
				<div className='form-group mt-3'>
					<div className='form-input'>
						<label className='required' htmlFor='subcategory'>
							Podkategoria Ogłoszenia
						</label>
						<CustomSelect options={categoryOptions} placeholder={'Wybierz podkategorię'} />
					</div>
				</div>
			</article>
		</>
	)
}
export default Step1
