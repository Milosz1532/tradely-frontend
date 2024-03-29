import { useEffect, useState } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollToTop from '../../ScrollToTop'

import { searchAnnouncements, getSubcategoryFilters } from '../../services/Api'

import SearchBar from '../../components/Layout/Searchbar'
import Skeleton from 'react-loading-skeleton'

import { getAnnouncementCategories } from '../../services/Api'

import {
	RectangularAnnouncement,
	RectangularAnnouncementLoading,
} from '../../components/Announcements/RectangularAnnouncement'
import { SquareAnnouncement } from '../../components/Announcements/SquareAnnouncement'
import AnnouncementNotFound from '../../components/Announcements/AnnouuncementNotFound'

import ReactSlider from 'react-slider'

import Button from '../../components/Layout/Button'
import Select from '../../components/Layout/Select'
import CustomSelect from '../../components/Layout/CustomSelect'

const LoadingAnnouncementsScreen = () => {
	const skeletonArray = Array.from({ length: 5 })

	return (
		<>
			<div className='row'>
				<div className='col-5'>
					<Skeleton height={40} />
				</div>
			</div>
			<section className='section-element mt-3 pb-4'>
				<div className='row'>
					<div className='col-lg-3 search-filters-container mt-3 px-4'>
						<section className='search-filters '>
							{skeletonArray.map((_, index) => (
								<div key={index}>
									<div className='w-100 mt-2'>
										<Skeleton height={28} />
									</div>
									<div className='filter mt-3'>
										<div className='filter-title'>
											<div className='d-flex'>
												<Skeleton width={15} height={15} borderRadius={'50%'} />
												<Skeleton className='ms-2' width={160} />
											</div>
											<div className='d-flex mt-1'>
												<Skeleton width={15} height={15} borderRadius={'50%'} />
												<Skeleton className='ms-2' width={160} />
											</div>
											<div className='d-flex mt-1'>
												<Skeleton width={15} height={15} borderRadius={'50%'} />
												<Skeleton className='ms-2' width={160} />
											</div>
											<div className='d-flex mt-1'>
												<Skeleton width={15} height={15} borderRadius={'50%'} />
												<Skeleton className='ms-2' width={160} />
											</div>
										</div>
									</div>
								</div>
							))}

							<div className='w-75 m-auto'>
								<Skeleton height={40} className='mt-3' />
							</div>
						</section>
					</div>
					<div className='col-lg-9 mt-2 px-4'>
						<RectangularAnnouncementLoading />
						<RectangularAnnouncementLoading />
						<RectangularAnnouncementLoading />
						<RectangularAnnouncementLoading />
						<RectangularAnnouncementLoading />
						<RectangularAnnouncementLoading />
					</div>
				</div>
			</section>
		</>
	)
}

const ShowAnnouncements = ({ announcements, nextPage, prevPage, currentPage, totalPages }) => {
	const { location, category, subcategory, keyword } = useParams()

	const [sortType, setSortType] = useState(true)

	const [categories, setCategories] = useState([])
	const [subcategories, setSubcategories] = useState([])

	useEffect(() => {
		const getCategoriesList = async () => {
			try {
				const categoriesData = await getAnnouncementCategories()
				setCategories(categoriesData)
				// setSubcategories(categoriesData.subcategories)
			} catch {
				setCategories([])
			}
		}
		if (categories.length === 0) {
			getCategoriesList()
		}
	}, [])

	const AnnouncementComponent = sortType ? RectangularAnnouncement : SquareAnnouncement
	const announcementsList =
		announcements?.data.length > 0 &&
		announcements.data.map(a => (
			<AnnouncementComponent
				key={a.id}
				id={a.id}
				image={a.first_image}
				title={a.title}
				price={a.price}
				city={a.location}
				price_type={a.price_type}
				created_at={a.created_at}
				tags={a.tags}
				item={a}
				is_favorited={a.is_favorited}
			/>
		))

	const generatePageNumbers = () => {
		const pageNumbers = []
		const maxPageButtonsToShow = 5

		if (currentPage <= 4) {
			for (let i = 1; i <= Math.min(totalPages, maxPageButtonsToShow); i++) {
				pageNumbers.push(i)
			}
		} else if (currentPage >= totalPages - 3) {
			for (
				let i = totalPages - Math.min(totalPages, maxPageButtonsToShow) + 1;
				i <= totalPages;
				i++
			) {
				pageNumbers.push(i)
			}
		} else {
			for (let i = currentPage - 3; i <= currentPage + 3; i++) {
				pageNumbers.push(i)
			}
		}

		return pageNumbers
	}

	const pageNumbers = generatePageNumbers()

	// FILTERS

	const [selectedCategory, setSelectedCategory] = useState(false)
	const [selectedSubcategory, setSelectedSubcategory] = useState(false)

	const [subcategoryFiltersList, setSubcategoryFiltersList] = useState(false)
	const [filterValues, setFilterValues] = useState({})

	const [progressDistance, setProgressDistance] = useState(0)
	const [sliderAmountMax, setSliderAmountMax] = useState(1000)
	const [amountFrom, setAmountFrom] = useState(null)
	const [amountTo, setAmountTo] = useState(null)
	const [mobileFilters, setMobileFilters] = useState(false)

	const handleFilterChange = (filterId, selectedValue) => {
		setFilterValues(prevFilterValues => ({
			...prevFilterValues,
			[filterId]: selectedValue,
		}))
	}

	const handleChangeAmountRange = values => {
		setAmountFrom(parseInt(values[0]))
		setAmountTo(parseInt(values[1]))
	}

	useEffect(() => {
		if (amountTo && sliderAmountMax - amountTo <= 200) {
			setSliderAmountMax(prevMax => prevMax + 1000)
		}
		if (amountTo && amountTo + 2000 < sliderAmountMax) {
			setSliderAmountMax(prevMax => prevMax - 1000)
		}
	}, [amountTo])

	const handleAmountFromChange = value => {
		const newValue = Math.max(0, parseInt(value))
		setAmountFrom(newValue)
	}

	const handleAmountToChange = value => {
		const newValue = Math.max(0, parseInt(value))
		setAmountTo(newValue)
	}

	useEffect(() => {
		const fetchSubcategoryFilters = async () => {
			if (!selectedSubcategory) return
			try {
				const response = await getSubcategoryFilters(selectedSubcategory.id, 'search')
				setSubcategoryFiltersList(response.filters)
			} catch (error) {}
		}
		fetchSubcategoryFilters()
	}, [selectedSubcategory])

	const pageLocation = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		const selectedCat = categories.find(cat => cat.name === category)
		setSelectedCategory(selectedCat ? selectedCat : null)

		const selectedSubCat = selectedCat?.subcategories.find(subcat => subcat.name === subcategory)
		setSelectedSubcategory(selectedSubCat ? selectedSubCat : null)

		const queryParams = new URLSearchParams(pageLocation.search)

		const filtersQueryParam = queryParams.get('filters')

		if (queryParams.get('distance')) {
			setProgressDistance(queryParams.get('distance'))
		}
		if (queryParams.get('amountFrom')) {
			setAmountFrom(queryParams.get('amountFrom'))
		}
		if (queryParams.get('amountTo')) {
			setAmountTo(queryParams.get('amountTo'))
		}

		const filters = filtersQueryParam ? JSON.parse(decodeURIComponent(filtersQueryParam)) : {}
		for (const filterId in filters) {
			handleFilterChange(filterId, filters[filterId])
		}
	}, [categories, pageLocation])

	const handleApplyFilters = () => {
		const filtersCategory = selectedCategory?.id ? selectedCategory.name : 'all_categories'
		const filtersSubcategory = selectedSubcategory?.id
			? selectedSubcategory.name
			: 'all_subcategories'

		// Dodane zmienne dla dystansu, kwoty od i kwoty do
		const _distance = progressDistance || null
		const _amountFrom = amountFrom || null
		const _amountTo = amountTo || null

		const filters = {}

		for (const filterId in filterValues) {
			filters[filterId] = filterValues[filterId]
		}

		const filtersQueryParam = encodeURIComponent(JSON.stringify(filters))

		const newPath = `/announcements/${location}/${filtersCategory}/${filtersSubcategory}/${
			keyword ? keyword : ''
		}?filters=${filtersQueryParam}${_distance ? `&distance=${_distance}` : ''}${
			_amountFrom ? `&amountFrom=${_amountFrom}` : ''
		}${_amountTo ? `&amountTo=${_amountTo}` : ''}`

		navigate(newPath)
	}

	const handleChangeSelectedCategory = category => {
		setSelectedCategory(category)
		setSelectedSubcategory(null)
		setSubcategoryFiltersList(null)
		setFilterValues({})
	}

	function handleChangeSelectedSubcategory(selectedValue) {
		setSelectedSubcategory(selectedValue)
	}

	function updatePageParameter(newPage) {
		const currentURL = window.location.href
		const urlObj = new URL(currentURL)
		const searchParams = new URLSearchParams(urlObj.search)

		if (searchParams.has('page')) {
			searchParams.set('page', newPage)
		} else {
			searchParams.append('page', newPage)
		}

		urlObj.search = searchParams.toString()
		const updatedURL = urlObj.toString()

		return updatedURL
	}

	const [displayStyle, setDisplayStyle] = useState(1)

	return (
		<>
			{/* <div className='search-sort-by-element d-flex justify-content-end '>
				 <span>
					Sortuj po: <strong>Trafność</strong>
				</span> 
			</div> */}
			<section className=''>
				<div className='row'>
					<div>
						<div className='mobile-section-buttons mb-3 '>
							<Button text='Filtry' size={'medium'} onClick={() => setMobileFilters(true)} />
						</div>
					</div>
					<div className='row mb-3'>
						<div className='d-flex justify-content-between align-items-center'>
							<div>
								{announcements?.data.length > 0 && (
									<h5 className='m-0'>
										Znalezione ogłoszenia:{' '}
										<span className='color-gray'>{announcements?.meta?.total || '0'}</span>
									</h5>
								)}
							</div>

							<div className='d-flex align-items-center'>
								<select>
									<option>Wybrane dla Ciebie</option>
									<option>Wybrane dla Ciebie</option>
									<option>Wybrane dla Ciebie</option>
								</select>

								<div className='item-type-panel ms-2'>
									<div
										className={`item-type-panel-element ${displayStyle === 2 ? 'active' : ''}`}
										onClick={() => setDisplayStyle(2)}>
										<i>
											<FontAwesomeIcon icon='fa-solid fa-layer-group' />
										</i>
									</div>
									<div
										className={`item-type-panel-element ${displayStyle === 1 ? 'active' : ''}`}
										onClick={() => setDisplayStyle(1)}>
										<i>
											<FontAwesomeIcon icon='fa-solid fa-bars-staggered' />
										</i>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
						className={`col-xl-3 col-lg-4 search-filters-container ${
							mobileFilters ? 'mobile-container' : ''
						} `}>
						<div className='section-element p-0'>
							<div className='d-flex justify-content-between align-items-center'>
								<i
									onClick={() => setMobileFilters(false)}
									className='search-filters-filters-menu-close-btn me-3'>
									<FontAwesomeIcon icon='fa-solid fa-xmark' />
								</i>
							</div>

							<section className='search-filters mt-4'>
								<div className='search-filters-filter px-3'>
									<h5>Rodzaje oferty</h5>

									<div className='form-check'>
										<input
											className='form-check-input'
											type='checkbox'
											value=''
											id='search-filters-price-amount-checkbox'
										/>
										<label
											className='form-check-label'
											htmlFor='search-filters-price-amount-checkbox'>
											Kwota
										</label>
									</div>
									<div className='form-check mt-2'>
										<input
											className='form-check-input'
											type='checkbox'
											value=''
											id='search-filters-price-replace-checkbox'
										/>
										<label
											className='form-check-label'
											htmlFor='search-filters-price-replace-checkbox'>
											Zamienię
										</label>
									</div>
									<div className='form-check mt-2'>
										<input
											className='form-check-input'
											type='checkbox'
											id='search-filters-price-free-checkbox'
										/>
										<label
											className='form-check-label'
											htmlFor='search-filters-price-free-checkbox'>
											Oddam za darmo
										</label>
									</div>
								</div>
								<div className='search-filters-filter mt-3 px-3'>
									<h5>Stan produktu</h5>

									<div className='form-check'>
										<input
											className='form-check-input'
											type='checkbox'
											value=''
											id='search-filters-productType-new-checkbox'
										/>
										<label
											className='form-check-label'
											htmlFor='search-filters-productType-new-checkbox'>
											Nowe
										</label>
									</div>
									<div className='form-check mt-2'>
										<input
											className='form-check-input'
											type='checkbox'
											value=''
											id='search-filters-productType-used-checkbox'
										/>
										<label
											className='form-check-label'
											htmlFor='search-filters-productType-used-checkbox'>
											Używane
										</label>
									</div>
									<div className='form-check mt-2'>
										<input
											className='form-check-input'
											type='checkbox'
											id='search-filters-productType-damaged-checkbox'
										/>
										<label
											className='form-check-label'
											htmlFor='search-filters-productType-damaged-checkbox'>
											Uszkodzone
										</label>
									</div>
								</div>

								<div className='search-filters-filter mt-3 px-3'>
									<h5>Kategoria</h5>

									<div className='form-input'>
										<Select
											options={categories}
											defaultOption={{ name: 'Wszystkie kategorie', value: 'all_categories' }}
											value={selectedCategory}
											onChange={selectedOption => {
												handleChangeSelectedCategory(selectedOption)
											}}
											renderOption={option => <>{option.name}</>}
										/>
									</div>
								</div>
								<div className='search-filters-filter mt-3 px-3'>
									<h5>Podkategoria</h5>

									<div className='form-input'>
										<Select
											disabled={!selectedCategory}
											value={selectedSubcategory}
											options={selectedCategory?.subcategories && selectedCategory?.subcategories}
											defaultOption={{ name: 'Wszystkie podkategorie', value: 'all_subcategories' }}
											onChange={selectedOption => {
												handleChangeSelectedSubcategory(selectedOption)
											}}
											renderOption={option => <>{option.name}</>}
										/>
									</div>
								</div>
								<div className='search-filters-filter mt-3 px-3'>
									<h5>Odległość </h5>

									<div className='mt-4'>
										<ReactSlider
											value={progressDistance}
											onChange={e => setProgressDistance(e)}
											className='standard-slider'
											thumbClassName='standard-slider-thumb'
											trackClassName='standard-slider-track'
											max={100}
											renderThumb={(props, state) => (
												<div {...props}>
													<div className='standard-slider-value'>
														<span>{state.valueNow}km</span>
													</div>
												</div>
											)}
										/>
									</div>
								</div>
								<div className='search-filters-filter mt-3 px-3'>
									<h5>Kwota </h5>

									<div className='row'>
										<div className='col-6'>
											<div className='form-input'>
												<label htmlFor='title'>Od</label>
												<input
													type='number'
													value={amountFrom}
													placeholder='Od'
													onChange={e => handleAmountFromChange(e.target.value)}
												/>
											</div>
										</div>

										<div className='col-6'>
											<div className='form-input '>
												<label htmlFor='title'>Do</label>
												<input
													type='number'
													placeholder='Do'
													min='0'
													value={amountTo}
													onChange={e => handleAmountToChange(e.target.value)}
												/>
											</div>
										</div>
									</div>

									<div className='mt-4'>
										<ReactSlider
											className='range-slider'
											thumbClassName='range-slider-thumb'
											trackClassName='range-slider-track'
											value={[amountFrom, amountTo]}
											onChange={handleChangeAmountRange}
											pearling
											minDistance={1}
											max={sliderAmountMax}
										/>
									</div>
								</div>

								{subcategoryFiltersList && subcategoryFiltersList.length > 0 && (
									<>
										{subcategoryFiltersList.map(filter => (
											<div key={filter.id} className='search-filters-filter mt-3 px-3'>
												<h5>{filter.name}</h5>

												<div className='form-input'>
													{filter.input_type === 'select' && (
														<CustomSelect
															placeholder={filter.placeholder}
															options={filter.values.map(value => ({
																value: value.id,
																label: value.value,
															}))}
															value={
																filterValues[filter.id]
																	? {
																			value: filterValues[filter.id],
																			label: filter.values.find(
																				value => value.id === filterValues[filter.id]
																			)?.value,
																	  }
																	: null
															}
															onChange={selectedOption =>
																handleFilterChange(
																	filter.id,
																	selectedOption ? selectedOption.value : null
																)
															}
														/>
													)}
													{filter.input_type === 'input' && (
														<>
															<input
																type='text'
																placeholder={filter.placeholder}
																value={filterValues[filter.id] || ''}
																onChange={e => handleFilterChange(filter.id, e.target.value)}
															/>
														</>
													)}
												</div>

												{filter.input_type === 'radio' && (
													<>
														{filter.values.map(value => (
															<div key={value.id} className='form-check mt-2'>
																<input
																	className='form-check-input'
																	type='radio'
																	name={`flexRadioDefault-${filter.id}`}
																	id={`flexRadio-${value.id}`}
																	checked={filterValues[filter.id]?.value === value.id}
																	onChange={() => handleFilterChange(filter.id, value.id)}
																/>
																<label
																	className='form-check-label'
																	htmlFor={`flexRadio-${value.id}`}>
																	{value.value}
																</label>
															</div>
														))}
													</>
												)}
											</div>
										))}
									</>
								)}

								<div className='text-center mt-3 mb-3'>
									{/* <Button text={'Zatwierdź'} size={'medium'} onClick={handleApplyFilters} /> */}
									<Button
										color={true}
										rounded={true}
										className={'text-md'}
										onClick={handleApplyFilters}
										text={'Zatwierdź filtry'}></Button>
								</div>
							</section>
						</div>
					</div>
					<div className='section-element px-4 pb-3 col-xl-9 col-lg-8 '>
						<section className='d-flex flex-column justify-content-between h-100'>
							<div>
								{announcements?.data.length > 0 ? (
									<div className='row'>{announcementsList}</div>
								) : (
									<AnnouncementNotFound />
								)}
							</div>

							<div className='row mt-3 px-2'>
								<span className='pagination-total'>
									Znalezione ogłoszenia: {announcements?.meta?.total || '0'}
								</span>

								<div className='pagination'>
									<div className='pagination-content'>
										<ul>
											<li className={currentPage <= 1 ? 'disable' : ''}>
												<Link className='pagination-btn ' to={updatePageParameter(prevPage)}>
													<FontAwesomeIcon icon='fa-solid fa-angle-left' />
												</Link>
											</li>
											{pageNumbers.map(pageNumber => (
												<li key={pageNumber}>
													<div
														className={`pagination-page-number ${
															pageNumber === currentPage ? 'active' : ''
														}`}>
														<Link
															className={`pagination-number-btn`}
															to={updatePageParameter(pageNumber)}
															key={pageNumber}>
															{pageNumber}
														</Link>
													</div>
												</li>
											))}
											<li className={currentPage >= totalPages ? 'disable' : ''}>
												<Link className='pagination-btn' to={updatePageParameter(nextPage)}>
													<FontAwesomeIcon icon='fa-solid fa-angle-right' />
												</Link>
											</li>
										</ul>
										<span className='pagination-total-pages'>Wyniki: 1 - {totalPages}</span>
									</div>
								</div>
							</div>
						</section>
					</div>
				</div>
			</section>
		</>
	)
}

function SearchAnnouncements() {
	const { location, category, subcategory, keyword } = useParams()

	const [announcements, setAnnouncements] = useState([])
	const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)

	const page_location = useLocation()

	const searchParams = new URLSearchParams(page_location.search)
	const currentPage = parseInt(searchParams.get('page')) || 1
	const nextPage = currentPage + 1
	const prevPage = currentPage - 1

	const maxPages = 10

	useEffect(() => {
		const fetchAnnouncements = async () => {
			try {
				const queryParams = new URLSearchParams(page_location.search)

				const filtersQueryParam = queryParams.get('filters')
				const distanceQueryParam = queryParams.get('distance')
				const amountFromsQueryParam = queryParams.get('amountFrom')
				const amountToQueryParam = queryParams.get('amountTo')
				const announcementsData = await searchAnnouncements(
					location,
					category,
					subcategory,
					keyword,
					currentPage,
					filtersQueryParam,
					distanceQueryParam,
					amountFromsQueryParam,
					amountToQueryParam
				)
				setTimeout(() => {
					setAnnouncements(announcementsData)
					setLoadingAnnouncements(false)
				}, 500)
			} catch (error) {
				setLoadingAnnouncements(false)
			}
		}

		setLoadingAnnouncements(true)
		fetchAnnouncements()
		window.scrollTo(0, 0)
	}, [page_location])

	const totalPages = announcements?.data?.length > 0 ? announcements.meta.last_page : 0

	return (
		<>
			<SearchBar keywords={keyword} />

			{/* <h2 className='announcements-section-title text-center mt-5 mb-3'>Wyniki wyszukiwania</h2> */}

			<section
				className='search-announcements container px-xl-4 pb-3'
				style={{ minHeight: '400px' }}>
				{loadingAnnouncements ? (
					<LoadingAnnouncementsScreen />
				) : (
					<ShowAnnouncements
						announcements={announcements}
						nextPage={nextPage}
						prevPage={prevPage}
						currentPage={currentPage}
						totalPages={totalPages}
					/>
				)}
			</section>
		</>
	)
}

export default SearchAnnouncements
