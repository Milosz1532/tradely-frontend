import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SearchService from '../services/SearchService'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Searchbar() {
	const [category, setCategory] = useState('Samochody osobowe')
	const [location, setLocation] = useState('Włocławek')
	const [keyword, setKeyword] = useState('')
	const navigate = useNavigate()

	const handleSearch = () => {
		let url = `/announcements/${location}/${category}`

		if (keyword.trim() !== '') {
			url += `/${keyword}`
		}

		navigate(url)
	}

	const handleKeyDown = event => {
		if (event.key === 'Enter') {
			handleSearch()
		}
	}

	return (
		<div className='search-input-box pt-3'>
			<div className='search-input'>
				<div className='location-input'>
					<i>
						<FontAwesomeIcon icon='fa-solid fa-location-dot' />
					</i>
					{/* <select name='location' className='location'>
						<option value='default'>Lokalizacja</option>
					</select> */}
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
					<select name='category' className='category'>
						<option value='default'>Wszystkie kategorie</option>
					</select>
				</div>

				<input
					onChange={e => setKeyword(e.target.value)}
					onKeyDown={handleKeyDown}
					value={keyword}
					className='main-input'
					type='text'
					placeholder='Szukaj spośród 13 549 323 ogłoszeń...'
				/>
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
