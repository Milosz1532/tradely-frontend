import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { searchAnnouncements } from '../services/SearchService'

import SearchBar from '../components/Searchbar'
import Skeleton from 'react-loading-skeleton'

import {
	RectangularAnnouncement,
	RectangularAnnouncementLoading,
} from '../components/RectangularAnnouncement'
import { SquareAnnouncement } from '../components/SquareAnnouncement'

import NoAnnouncementsImg from '/images/noAnnouncements.svg'

const LoadingAnnouncementsScreen = () => {
	return (
		<>
			<div className='row'>
				<div className='col-5'>
					<Skeleton height={40} />
				</div>
				<div className='mt-2'>
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
		/>
	))

	const generatePageNumbers = () => {
		const pageNumbers = []
		const maxPageButtonsToShow = 5 // Maksymalna liczba wyświetlanych przycisków strony

		if (currentPage <= 4) {
			// Jeśli jesteś na początkowych stronach
			for (let i = 1; i <= Math.min(totalPages, maxPageButtonsToShow); i++) {
				pageNumbers.push(i)
			}
		} else if (currentPage >= totalPages - 3) {
			// Jeśli jesteś na ostatnich stronach
			for (
				let i = totalPages - Math.min(totalPages, maxPageButtonsToShow) + 1;
				i <= totalPages;
				i++
			) {
				pageNumbers.push(i)
			}
		} else {
			// Jeśli jesteś gdzieś po środku
			for (let i = currentPage - 3; i <= currentPage + 3; i++) {
				pageNumbers.push(i)
			}
		}

		return pageNumbers
	}

	const pageNumbers = generatePageNumbers()

	return (
		<>
			<div className='search-announcements-filters'>
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
			</div>
			<div className='sort-announcements d-flex justify-content-between'>
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

			<div className='row'>{announcementsList}</div>

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
								<li className='pagination-page-number'>
									<Link
										className={`pagination-number-btn ${
											pageNumber === currentPage ? 'active' : ''
										}`}
										to={`?page=${pageNumber}`}
										key={pageNumber}>
										{pageNumber}
									</Link>
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

const NoAnnouncements = () => {
	return (
		<div className='no-announcements d-flex align-items-center flex-column'>
			<h3>Nie znaleziono żadnych ogłoszeń</h3>
			<img
				className='mt-3'
				style={{ maxWidth: '400px', maxHeight: '400px' }}
				src={NoAnnouncementsImg}
				alt='Brak ogłoszeń zdjęcie'
			/>
		</div>
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

	console.log(currentPage)

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
	}, [location, category, keyword, currentPage])

	const totalPages = announcements ? announcements.meta.last_page : maxPages

	return (
		<>
			<section className='preview-announcement-search-section mb-3'>
				<div className='container'>
					<h2>Wyszukaj ogłoszenie</h2>
					<SearchBar />
				</div>
			</section>
			<section className='search-announcements container mt-5' style={{ minHeight: '400px' }}>
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
					<NoAnnouncements />
				)}
			</section>
		</>
	)
}

export default SearchAnnouncements