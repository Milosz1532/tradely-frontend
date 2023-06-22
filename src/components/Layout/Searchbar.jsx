import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { searchCategories } from '../../services/SearchService'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Searchbar() {
	const [category, setCategory] = useState('all_categories')
	const [location, setLocation] = useState('')
	const [keyword, setKeyword] = useState('')
	const navigate = useNavigate()
	const [categories, setCategories] = useState([])

	const handleSearch = () => {
		let url = `/announcements/${location ? location : 'all_locations'}/${category}`

		if (keyword.trim() !== '') {
			url += `/${keyword}`
		}

		navigate(url)
	}

	useEffect(() => {
		const getCategoriesList = async () => {
			try {
				const categoriesData = await searchCategories()
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
