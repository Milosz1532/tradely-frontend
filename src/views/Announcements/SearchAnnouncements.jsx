import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollToTop from '../../ScrollToTop'

import { searchAnnouncements } from '../../services/SearchService'

import SearchBar from '../../components/Layout/Searchbar'
import Skeleton from 'react-loading-skeleton'

import {
	RectangularAnnouncement,
	RectangularAnnouncementLoading,
} from '../../components/Announcements/RectangularAnnouncement'
import { SquareAnnouncement } from '../../components/Announcements/SquareAnnouncement'
import AnnouncementNotFound from '../../components/Announcements/AnnouuncementNotFound'

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
	const [sortType, setSortType] = useState(true)
	const AnnouncementComponent = sortType ? RectangularAnnouncement : SquareAnnouncement
	const announcementsList = announcements.data.map(a => (
		<AnnouncementComponent
			key={a.id}
			id={a.id}
			image={a.first_image}
			title={a.title}
			price={a.price}
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

	return (
		<>
			<div className='sort-announcements d-flex justify-content-between align-items-center'>
				<h4 className='home-title'>
					Znalezione ogłoszenia: <strong>{announcements.meta.total}</strong>
				</h4>
				<div className='buttons'>
					<i className={`me-3 sort-icon ${sortType && 'active'}`}>
						<FontAwesomeIcon onClick={e => setSortType(true)} icon='fa-solid fa-list' />
					</i>
					<i className={`me-3 sort-icon ${!sortType && 'active'}`}>
						<FontAwesomeIcon onClick={e => setSortType(false)} icon='fa-solid fa-table-cells' />
					</i>
				</div>
			</div>
			<hr />

			<div className='row'>
				<div className='col-lg-3 pt-2'>
					<section className='search-filters '>
						<h5>Filtry: </h5>
						<div className='filter mt-3'>
							<div className='filter-title'>
								<h5>
									<FontAwesomeIcon icon='fa-solid fa-location-dot' className='me-2' />
									Lokalizacja
								</h5>
								<FontAwesomeIcon className='filter-icon' icon='fa-solid fa-angle-up' />
							</div>
							<input className='filter-input' type='text' placeholder='Wpisz lokalizacje...' />
						</div>
						<div className='filter mt-4'>
							<div className='filter-title'>
								<h5>
									<FontAwesomeIcon className='me-2' icon='fa-solid fa-shapes' />
									Podkategoria
								</h5>
								<FontAwesomeIcon className='filter-icon' icon='fa-solid fa-angle-up' />
							</div>
							<select className='filter-input medium'>
								<option>Wszystkie podkategorie</option>
							</select>
						</div>
						<div className='filter mt-4'>
							<div className='filter-title'>
								<h5>
									<FontAwesomeIcon icon='fa-solid fa-coins' className='me-2' />
									Cena
								</h5>
								<FontAwesomeIcon className='filter-icon' icon='fa-solid fa-angle-up' />
							</div>
							<div className='row'>
								<div className='col-6'>
									<input className='filter-input' min={0} type='number' placeholder='OD' />
								</div>

								<div className='col-6'>
									<input className='filter-input' min={0} type='number' placeholder='DO' />
								</div>
							</div>
						</div>
						<button className='btn-design white btn-md w-100 mt-4'>Zatwierdź</button>
					</section>
				</div>
				<div className='col-lg-9'>
					<div className='row'>{announcementsList}</div>
				</div>
			</div>

			<div className='row'>
				<div className='pagination mt-3'>
					<div className='pagination-content'>
						<ul>
							<li className={currentPage <= 1 ? 'disable' : ''}>
								<Link className='pagination-btn' to={`?page=${prevPage}`}>
									<FontAwesomeIcon icon='fa-solid fa-angles-left' />
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
									<FontAwesomeIcon icon='fa-solid fa-angles-right' />
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</>
	)
}

function SearchAnnouncements() {
	const { location, category, keyword } = useParams()
	const [announcements, setAnnouncements] = useState(false)
	const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)

	const page_location = useLocation()

	const searchParams = new URLSearchParams(page_location.search)
	const currentPage = parseInt(searchParams.get('page')) || 1
	const nextPage = currentPage + 1
	const prevPage = currentPage - 1

	const maxPages = 10 // Maksymalna liczba stron

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
				console.error('Wystąpił błąd podczas pobierania ogłoszeń:', error)
				setLoadingAnnouncements(false)
			}
		}

		setLoadingAnnouncements(true)
		fetchAnnouncements()
		window.scrollTo(0, 0)
	}, [location, category, keyword, currentPage])

	const totalPages = announcements ? announcements.meta.last_page : maxPages

	return (
		<>
			<section className='preview-announcement-search-section mb-3'>
				<div className='container'>
					<h2>Wyszukaj ogłoszenie</h2>
					<SearchBar shadow={true} />
				</div>
			</section>
			<section className='search-announcements container ' style={{ minHeight: '400px' }}>
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

// Filters
{
	/* <div className='search-announcements-filters'>
				<div className='row mb-4'>
					<h4 className='home-title mt-0'>Filtry</h4>
					<div className='col-2'>
						<div className='standard-input-design'>
							<p>Cena od:</p>
							<input type='number' min={0} style={{ height: '40px' }} />
						</div>
					</div>
					<div className='col-2 '>
						<div className='standard-input-design'>
							<p>Cena do:</p>
							<input type='number' min={0} style={{ height: '40px' }} />
						</div>
					</div>
					<div className='col-2 align-self-end'>
						<button className='btn-design btn-sm'>Zastosuj filtry</button>
					</div>
				</div>
			</div> */
}
