import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const getLocation = (setCityInput, setLocationData) => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			position => {
				const { latitude, longitude } = position.coords
				const endpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=500&limit=1`

				axios
					.get(endpoint)
					.then(response => {
						setCityInput(response.data.display_name)
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

const Step5 = ({ locationData, setLocationData, phoneNumber, setPhoneNumber }) => {
	const [cityInput, setCityInput] = useState('')
	const locationInputRef = useRef(null)
	// const [phoneNumber, setPhoneNumber] = useState('')

	// const [locationData, setLocationData] = useState(null)
	const [suggestions, setSuggestions] = useState([])

	const [typingTimer, setTypingTimer] = useState(null)
	const [hasFocus, setHasFocus] = useState(false)
	const [blurTimer, setBlurTimer] = useState(null)

	useEffect(() => {
		getLocation(setCityInput, setLocationData)
		locationData && setCityInput(locationData.display_name)
	}, [])

	const formatPhoneNumber = value => {
		const phoneNumberWithoutSpaces = value.replace(/\s/g, '')
		const formattedPhoneNumber = phoneNumberWithoutSpaces.replace(/(\d{3})(?=\d)/g, '$1 ')
		return formattedPhoneNumber
	}

	const handleChange = e => {
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

	return (
		<>
			<div className='row'>
				<div className='form-input'>
					<label className='required'>Miasto lub kod pocztowy</label>

					<div className='sugestion-input'>
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
						className='input-message'>
						Kliknij tutaj, aby wyszukać automatycznie
					</span>
				</div>
				<div className='form-input mt-3'>
					<label>Number telefonu</label>
					<input
						type='text'
						value={formatPhoneNumber(phoneNumber)}
						onChange={handleChange}
						placeholder='Wprowadź numer telefonu...'
					/>
				</div>
			</div>
		</>
	)
}

export default Step5

// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// // Funkcja pobierająca automatycznie lokalizację
// const getLocation = (setCityInput, setLocationData) => {
// 	if (navigator.geolocation) {
// 		navigator.geolocation.getCurrentPosition(
// 			position => {
// 				const { latitude, longitude } = position.coords
// 				const endpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&limit=1`

// 				axios
// 					.get(endpoint)
// 					.then(response => {
// 						const cityName = response.data.address.village
// 						const municipality = response.data.address.municipality
// 						const location = `${cityName}, ${municipality}`
// 						setCityInput(location)
// 						setLocationData(response.data)
// 					})
// 					.catch(error => console.error('Błąd pobierania danych o lokalizacji:', error))
// 			},
// 			error => console.error('Błąd geolokalizacji:', error)
// 		)
// 	}
// }

// const Step5 = () => {
// 	const [cityInput, setCityInput] = useState('')
// 	const [locationData, setLocationData] = useState(null)

// 	const handleSearch = e => {
// 		e.preventDefault()
// 		// Twój endpoint do geokodowania z wykorzystaniem kodu pocztowego lub nazwy miasta
// 		const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
// 			cityInput
// 		)}&limit=1`

// 		axios
// 			.get(endpoint)
// 			.then(response => {
// 				setLocationData(response.data[0])
// 			})
// 			.catch(error => console.error('Błąd pobierania danych o lokalizacji:', error))
// 	}

// 	useEffect(() => {
// 		getLocation(setCityInput, setLocationData)
// 	}, [])

// 	const [phoneNumber, setPhoneNumber] = useState('')

// 	const formatPhoneNumber = value => {
// 		const phoneNumberWithoutSpaces = value.replace(/\s/g, '')
// 		const formattedPhoneNumber = phoneNumberWithoutSpaces.replace(/(\d{3})(?=\d)/g, '$1 ')
// 		return formattedPhoneNumber
// 	}

// 	const handleChange = e => {
// 		const { value } = e.target

// 		// Usuń spacje z wprowadzonej wartości
// 		const phoneNumberWithoutSpaces = value.replace(/\s/g, '')

// 		// Sprawdź, czy wprowadzono dokładnie 10 cyfr
// 		if (/^[0-9]{0,10}$/.test(phoneNumberWithoutSpaces)) {
// 			setPhoneNumber(phoneNumberWithoutSpaces)
// 		}
// 	}

// 	return (
// 		<>
// 			<div className='row'>
// 				<div className={`form-input ${locationData ? 'success' : ''}`}>
// 					<label>Miasto lub kod pocztowy</label>

// 					<form onSubmit={handleSearch}>
// 						<div className='search-input '>
// 							<input
// 								type='text'
// 								value={cityInput}
// 								onChange={e => setCityInput(e.target.value)}
// 								placeholder='Wprowadź kod pocztowy lub nazwę miasta'
// 							/>

// 							<button>
// 								<FontAwesomeIcon
// 									icon={`fa-solid ${locationData ? 'fa-check' : 'fa-magnifying-glass'}`}
// 								/>
// 							</button>
// 						</div>
// 						<span
// 							className='input-message'
// 							style={{ cursor: 'pointer' }}
// 							onClick={() => getLocation(setCityInput, setLocationData)}>
// 							Kliknij tutaj, aby automatycznie zlokalizować
// 						</span>
// 					</form>
// 				</div>
// 				<div className='form-input mt-3'>
// 					<label>Number telefonu</label>
// 					<input
// 						type='text'
// 						value={formatPhoneNumber(phoneNumber)}
// 						onChange={handleChange}
// 						placeholder='Wprowadź numer telefonu...'
// 					/>
// 				</div>
// 			</div>
// 		</>
// 	)
// }

// export default Step5
