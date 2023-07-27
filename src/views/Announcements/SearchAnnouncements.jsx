import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollToTop from '../../ScrollToTop'

import { searchAnnouncements } from '../../services/Api'

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

	return (
		<>
			<section className='section-element p-4'>
				<div className='row'>
					<div className='col-lg-3 '>
						<section className='search-filters'>
							<h5 className='header-title'>Filtry</h5>
						</section>
					</div>
					<div className='col-lg-9'>
						<h5 className='header-title'>
							Znalezione ogłoszenia: <strong>{announcements.meta.total}</strong>
						</h5>

						<div className='row'>{announcementsList}</div>

						<div className='row mt-3 px-2'>
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
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
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
			<SearchBar keywords={keyword} />

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
