import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Searchbar() {
	return (
		<div className='search-input-box pt-3'>
			<div className='search-input'>
				<div className='location-input'>
					<i>
						<FontAwesomeIcon icon='fa-solid fa-location-dot' />
					</i>
					<select name='location' className='location'>
						<option value='default'>Lokalizacja</option>
					</select>
				</div>
				<div className='category-input'>
					<i>
						<FontAwesomeIcon icon='fa-solid fa-shapes' />
					</i>
					<select name='category' className='category'>
						<option value='default'>Wszystkie kategorie</option>
					</select>
				</div>

				<input className='main-input' type='text' placeholder='Szukaj spośród 13 549 323 ogłoszeń...' />
				<button className='submit-search-input'>
					<i>
						<FontAwesomeIcon icon='fa-solid fa-magnifying-glass' />
					</i>
					Wyszukaj
				</button>
			</div>
		</div>
	)
}
