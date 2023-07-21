import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getAnnouncementCategories, getSuggestions } from '../../services/Api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Searchbar() {
	const searchInputRef = useRef(null)

	const [category, setCategory] = useState('all_categories')
	const [location, setLocation] = useState('')
	const [keyword, setKeyword] = useState('')
	const [categories, setCategories] = useState([])
	const [typingTimer, setTypingTimer] = useState(null)
	const [suggestions, setSuggestions] = useState([])
	const [hasFocus, setHasFocus] = useState(false)
	const [blurTimer, setBlurTimer] = useState(null)

	const navigate = useNavigate()

	const handleSearch = () => {
		let url = `/announcements/${location ? location : 'all_locations'}/${category}`

		if (keyword.trim() !== '') {
			url += `/${keyword}`
		}

		navigate(url)
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

	useEffect(() => {
		const getCategoriesList = async () => {
			try {
				const categoriesData = await getAnnouncementCategories()
				setCategories(categoriesData)
			} catch {
				setCategories([])
			}
		}
		if (categories.length === 0) {
			getCategoriesList()
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
		<div className='search-input-box pt-3'>
			<div className='search-input'>
				<div className='search-input-filters'>
					<div className='location-input'>
						<i>
							<FontAwesomeIcon icon='fa-solid fa-location-dot' />
						</i>

						<input
							onChange={e => setLocation(e.target.value)}
							value={location}
							className='location'
							type='text'
							placeholder='Wszystkie miasta'
						/>
					</div>
					<div className='category-input'>
						<i>
							<FontAwesomeIcon icon='fa-solid fa-shapes' />
						</i>
						<select
							onChange={e => setCategory(e.target.value)}
							name='category'
							className='category'>
							<option value='all_categories'>Wszystkie kategorie</option>
							{categories.map(option => (
								<option key={option.id} value={option.name}>
									{option.name}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* <input
					onChange={e => handleChangeKeywordInput(e)}
					onKeyDown={handleKeyDown}
					value={keyword}
					className='main-input'
					type='text'
					placeholder='Szukaj spośród 13 549 323 ogłoszeń...'
				/> */}
				<div className={`search-bar-suggestions-input`}>
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
				<button onClick={handleSearch} className='submit-search-input'>
					<i>
						<FontAwesomeIcon icon='fa-solid fa-magnifying-glass' />
					</i>
					Wyszukaj
				</button>
			</div>
		</div>
	)
}
