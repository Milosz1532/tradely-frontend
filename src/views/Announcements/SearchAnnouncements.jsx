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
import CustomSelect from '../../components/Layout/CustomSelect'

const LoadingAnnouncementsScreen = () => {
	return (
		<>
			<div className='row'>
				<div className='col-5'>
					<Skeleton height={40} />
				</div>
			</div>
			<div className='row'>
				<div className='col-lg-3 mt-3'>
					<section className='search-filters '>
						<Skeleton width={120} />
						<div className='filter mt-3'>
							<div className='filter-title'>
								<div className='d-flex'>
									<Skeleton width={15} height={15} borderRadius={'50%'} />
									<Skeleton className='ms-2' width={130} />
								</div>

								<Skeleton width={20} />
							</div>
							<Skeleton className='mt-3' height={30} />
						</div>
						<div className='filter mt-3'>
							<div className='filter-title'>
								<div className='d-flex'>
									<Skeleton width={15} height={15} borderRadius={'50%'} />
									<Skeleton className='ms-2' width={130} />
								</div>

								<Skeleton width={20} />
							</div>
							<Skeleton className='mt-3' height={30} />
						</div>
						<div className='filter mt-3'>
							<div className='filter-title'>
								<div className='d-flex'>
									<Skeleton width={15} height={15} borderRadius={'50%'} />
									<Skeleton className='ms-2' width={130} />
								</div>

								<Skeleton width={20} />
							</div>
							<Skeleton className='mt-3' height={30} />
						</div>
						<div className='filter mt-3'>
							<div className='filter-title'>
								<div className='d-flex'>
									<Skeleton width={15} height={15} borderRadius={'50%'} />
									<Skeleton className='ms-2' width={130} />
								</div>

								<Skeleton width={20} />
							</div>
							<Skeleton className='mt-3' height={30} />
						</div>
						<Skeleton height={30} className='mt-3' />
					</section>
				</div>
				<div className='col-lg-9 mt-2'>
					<RectangularAnnouncementLoading />
					<RectangularAnnouncementLoading />
					<RectangularAnnouncementLoading />
					<RectangularAnnouncementLoading />
					<RectangularAnnouncementLoading />
					<RectangularAnnouncementLoading />
				</div>
			</div>
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
				setCategories(categoriesData.categories)
				setSubcategories(categoriesData.subcategories)
			} catch {
				setCategories([])
			}
		}
		if (categories.length === 0) {
			getCategoriesList()
		}
	}, [])

	const AnnouncementComponent = sortType ? RectangularAnnouncement : SquareAnnouncement
	const announcementsList = announcements.data.map(a => (
		<AnnouncementComponent
			key={a.id}
			id={a.id}
			image={a.first_image}
			title={a.title}
			price={a.price}
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

	const handleFilterChange = (filterId, value) => {
		setFilterValues(prevFilterValues => ({
			...prevFilterValues,
			[filterId]: { filter_id: filterId, value },
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

	const categoryOptions = categories.map(category => ({
		value: category.id,
		label: category.name,
	}))

	const [subcategoriesOptions, setSubcategoryOptions] = useState(null)

	useEffect(() => {
		const fetchSubcategoryFilters = async () => {
			if (!selectedSubcategory) return
			try {
				const response = await getSubcategoryFilters(selectedSubcategory.value)
				setSubcategoryFiltersList(response.filters)
			} catch (error) {
				console.log(error)
			}
		}
		fetchSubcategoryFilters()
	}, [selectedSubcategory])

	useEffect(() => {
		if (selectedCategory) {
			const filteredSubcategories = subcategories.filter(
				subcategory => subcategory.category_id === selectedCategory.value
			)
			setSubcategoryOptions(
				filteredSubcategories.map(subcategory => ({
					value: subcategory.id,
					label: subcategory.name,
				}))
			)
		}
	}, [selectedCategory])

	useEffect(() => {
		const selectedCat = categories.find(cat => cat.name === category)
		setSelectedCategory(selectedCat ? { value: selectedCat.id, label: selectedCat.name } : null)

		const selectedSubCat = subcategories.find(subcat => subcat.name === subcategory)
		setSelectedSubcategory(
			selectedSubCat ? { value: selectedSubCat.id, label: selectedSubCat.name } : null
		)
	}, [category, subcategory, categories])

	const pageLocation = useLocation()
	const navigate = useNavigate()

	const handleApplyFilters = () => {
		const filtersCategory = selectedCategory ? selectedCategory.label : category
		const filtersSubcategory = selectedSubcategory ? selectedSubcategory.label : 'all_subcategories'

		let newPath = `/announcements/${location}/${filtersCategory}/${filtersSubcategory}/${
			keyword ? keyword : ''
		}`

		const filtersSearchParams = new URLSearchParams()
		Object.entries(filterValues).forEach(([filterId, value]) => {
			if (value) {
				filtersSearchParams.set(filterId, value.value)
			}
		})

		const filtersQueryString = filtersSearchParams.toString()

		if (filtersQueryString) {
			newPath += `?filters=${filtersQueryString}`
		}

		navigate(newPath)
	}

	const handleChangeSelectedCategory = e => {
		setSelectedCategory(e)
		setSelectedSubcategory(null)
		setSubcategoryFiltersList(null)
		setFilterValues({})
	}

	return (
		<>
			<div className='search-sort-by-element d-flex justify-content-end me-1'>
				<span>
					Sortuj po: <strong>Trafność</strong>
				</span>
			</div>
			<section className='section-element p-4'>
				<div className='row'>
					<div>
						<div className='mobile-section-buttons mb-3'>
							<Button text='Filtry' size={'medium'} onClick={() => setMobileFilters(true)} />
						</div>
					</div>
					<div
						className={`col-lg-3 search-filters-container ${
							mobileFilters ? 'mobile-container' : ''
						} `}>
						<div className='d-flex justify-content-between align-items-center'>
							<h5 className='header-title'>Filtry</h5>
							<i
								onClick={() => setMobileFilters(false)}
								className='search-filters-filters-menu-close-btn me-3'>
								<FontAwesomeIcon icon='fa-solid fa-xmark' />
							</i>
						</div>
						<section className='search-filters mt-4'>
							<div className='search-filters-filter'>
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
									<label className='form-check-label' htmlFor='search-filters-price-free-checkbox'>
										Oddam za darmo
									</label>
								</div>
							</div>
							<div className='search-filters-filter mt-3'>
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

							<div className='search-filters-filter mt-3'>
								<h5>Kategoria</h5>

								<div className='form-input'>
									<CustomSelect
										options={categoryOptions}
										placeholder={'Wybierz kategorię'}
										value={selectedCategory}
										onChange={e => handleChangeSelectedCategory(e)}
									/>
								</div>
							</div>
							<div className='search-filters-filter mt-3'>
								<h5>Podkategoria</h5>

								<div className='form-input'>
									<CustomSelect
										options={subcategoriesOptions}
										placeholder={'Wybierz podkategorie'}
										value={selectedSubcategory}
										onChange={e => setSelectedSubcategory(e)}
										isDisabled={!selectedCategory && true}
									/>
								</div>
							</div>
							<div className='search-filters-filter mt-3'>
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
							<div className='search-filters-filter mt-3'>
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
										<div key={filter.id} className='search-filters-filter mt-3'>
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
															filterValues[filter.id] ? filter.values[filterValues[filter.id]] : ''
														}
														onChange={value => handleFilterChange(filter.id, value.value)}
													/>
												)}
												{filter.input_type === 'input' && (
													<>
														<input
															type='text'
															placeholder={filter.placeholder}
															value={filterValues[filter.id]?.value || ''}
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
															<label className='form-check-label' htmlFor={`flexRadio-${value.id}`}>
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

							<div className='text-center mt-3'>
								<Button text={'Zatwierdź'} size={'medium'} onClick={handleApplyFilters} />
							</div>
						</section>
					</div>
					<div className='col-lg-9'>
						<section className='d-flex flex-column justify-content-between h-100'>
							<div>
								<h5 className='header-title'>
									Znalezione ogłoszenia: <strong>{announcements.meta.total}</strong>
								</h5>

								<div className='row'>{announcementsList}</div>
							</div>

							<div className='row mt-3 px-2'>
								<span className='pagination-total'>
									Znalezione ogłoszenia: {announcements.meta.total}
								</span>
								<div className='pagination'>
									<div className='pagination-content'>
										<ul>
											<li className={currentPage <= 1 ? 'disable' : ''}>
												<Link className='pagination-btn ' to={`?page=${prevPage}`}>
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
															to={`?page=${pageNumber}`}
															key={pageNumber}>
															{pageNumber}
														</Link>
													</div>
												</li>
											))}
											<li className={currentPage >= totalPages ? 'disable' : ''}>
												<Link className='pagination-btn' to={`?page=${nextPage}`}>
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

	const [announcements, setAnnouncements] = useState(false)
	const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)

	const page_location = useLocation()

	const searchParams = new URLSearchParams(page_location.search)
	const currentPage = parseInt(searchParams.get('page')) || 1
	const nextPage = currentPage + 1
	const prevPage = currentPage - 1

	const maxPages = 10

	const filtersQueryString = searchParams.get('filters')

	let filtersObject = {}
	if (filtersQueryString) {
		const parsedFilters = new URLSearchParams(filtersQueryString)
		parsedFilters.forEach((value, key) => {
			filtersObject[key] = value
			console.log(`Filter_ID: ${key} : ${value}`)
		})
	}

	useEffect(() => {
		const fetchAnnouncements = async () => {
			try {
				const announcementsData = await searchAnnouncements(
					location,
					category,
					keyword,
					currentPage
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
	}, [location, subcategory, category, keyword, currentPage])

	const totalPages = announcements ? announcements.meta.last_page : maxPages

	return (
		<>
			<SearchBar keywords={keyword} />

			<h2 className='announcements-section-title text-center mt-5 mb-3'>Wyniki wyszukiwania</h2>

			<section className='search-announcements container px-4' style={{ minHeight: '400px' }}>
				{loadingAnnouncements ? (
					<LoadingAnnouncementsScreen />
				) : announcements && announcements.data.length > 0 ? (
					<ShowAnnouncements
						announcements={announcements}
						nextPage={nextPage}
						prevPage={prevPage}
						currentPage={currentPage}
						totalPages={totalPages}
					/>
				) : (
					<AnnouncementNotFound />
				)}
			</section>
		</>
	)
}

export default SearchAnnouncements
