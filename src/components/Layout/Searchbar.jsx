import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getAnnouncementCategories, getSuggestions } from '../../services/Api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import SearchInput from './SearchInput'

export default function Searchbar() {
	return (
		<div>
			<section className='header-search-section '>
				<div className='container px-xl-4 pt-4'>
					<div className='header-search-section-title'>
						<h1>Kupuj i sprzedawaj co tylko chcesz</h1>
						<p className='header-search-section-subtitle'>
							Znajdź ogłoszenie spośród 13 843 320 ofert
						</p>
						<div className='search-bar-position'>
							<SearchInput />
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
