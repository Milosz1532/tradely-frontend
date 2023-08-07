import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getAnnouncementCategories, getSuggestions } from '../../services/Api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Searchbar({ keywords }) {
	const searchInputRef = useRef(null)

	const [location, setLocation] = useState('')
	const [keyword, setKeyword] = useState('')
	const [categories, setCategories] = useState([])
	const [typingTimer, setTypingTimer] = useState(null)
	const [suggestions, setSuggestions] = useState([])
	const [hasFocus, setHasFocus] = useState(false)
	const [blurTimer, setBlurTimer] = useState(null)

	const navigate = useNavigate()

	const handleSearch = () => {
		let url = `/announcements/${
			location ? location : 'all_locations'
		}/all_categories/all_subcategories`

		if (keyword.trim() !== '') {
			url += `/${keyword}`
		}

		navigate(url)
	}

	const fetchSuggestions = async value => {
		try {
			const response = await getSuggestions(value)
			setSuggestions(response)
		} catch (error) {
			console.log(error)
			setSuggestions([])
		}
	}

	useEffect(() => {
		if (keywords) {
			setKeyword(keywords)
		}
	}, [])

	const handleKeyDown = event => {
		if (event.key === 'Enter') {
			handleSearch()
		}
	}

	const handleChangeKeywordInput = e => {
		setKeyword(e.target.value)
		clearTimeout(typingTimer)
		setTypingTimer(
			setTimeout(() => {
				fetchSuggestions(e.target.value)
			}, 100)
		)
	}

	const handleInputFocus = () => {
		clearTimeout(blurTimer)
		setHasFocus(true)
	}

	const handleInputBlur = () => {
		setBlurTimer(setTimeout(() => setHasFocus(false), 300))
	}

	const handleSuggestionClick = suggestion => {
		setKeyword(suggestion)
		setSuggestions([])
		searchInputRef.current.focus()
	}

	return (
		<div>
			<section className='header-search-section'>
				<div className='container px-4 pt-4'>
					<h1>Kupuj i sprzedawaj co tylko chcesz</h1>
					<p className='header-search-section-subtitle'>
						Znajdź ogłoszenie spośród 13 843 320 ofert
					</p>

					<div
						className={`header-search-section-search-input-container ${
							hasFocus && keyword && suggestions?.length > 0 ? 'header-search-no-border' : ''
						}`}>
						<div className='header-search-section-content'>
							<div className={`header-search-section-search-suggestion-input keywords-input `}>
								<i>
									<FontAwesomeIcon icon='fa-solid fa-magnifying-glass' />
								</i>
								<input
									type='text'
									placeholder='Szukaj spośród 13 549 323 ogłoszeń...'
									value={keyword}
									onKeyDown={handleKeyDown}
									onChange={e => handleChangeKeywordInput(e)}
									onFocus={handleInputFocus}
									onBlur={handleInputBlur}
									ref={searchInputRef}
								/>
								{hasFocus && keyword && suggestions?.length > 0 && (
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
							<div className='header-search-section-search-suggestion-input location-input'>
								<i>
									<FontAwesomeIcon icon='fa-solid fa-location-dot' />
								</i>
								<input
									onChange={e => setLocation(e.target.value)}
									type='text'
									placeholder='Cała polska'
								/>
							</div>
							<div className='header-search-section-search-button'>
								<button onClick={handleSearch}>
									<i>
										<FontAwesomeIcon icon='fa-solid fa-magnifying-glass' />
									</i>
									<span className='ms-3'>Wyszukaj</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
