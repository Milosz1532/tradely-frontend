import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'

import { fetchUserCompletedAnnouncements } from '../../services/Api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
	RectangularCompletedAnnouncement,
	RectangularCompletedAnnouncementLoading,
} from '../../components/Announcements/RectangularCompletedAnnouncement'
import Button from '../../components/Layout/Button'

export default function ProfileCompletedAnnouncements() {
	const [userAnnouncementsList, setUserAnnouncementsList] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	const page_location = useLocation()
	const totalPages = userAnnouncementsList?.meta?.last_page || 0

	const searchParams = new URLSearchParams(page_location.search)
	const currentPage = parseInt(searchParams.get('page')) || 1
	const nextPage = currentPage + 1
	const prevPage = currentPage - 1

	useEffect(() => {
		const getUserAnnouncements = async () => {
			try {
				const announcementsData = await fetchUserCompletedAnnouncements(currentPage)
				setUserAnnouncementsList(announcementsData)
			} catch {
				setUserAnnouncementsList([])
			} finally {
				setIsLoading(false)
			}
		}
		getUserAnnouncements()
	}, [currentPage])

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

	return (
		<>
			<div className='main-content-header pb-3'>
				<h5 className='m-0 ms-2'>Moje zakończone ogłoszenia</h5>
			</div>

			<div className='row px-2'>
				{isLoading ? (
					<>
						{[...Array(3)].map((_, index) => (
							<div key={index}>
								<RectangularCompletedAnnouncementLoading />
							</div>
						))}
					</>
				) : userAnnouncementsList?.data?.length > 0 ? (
					<>
						{userAnnouncementsList?.data.map(announcement => (
							<div key={announcement.id} className='mt-2'>
								<RectangularCompletedAnnouncement
									id={announcement.id}
									image={announcement.first_image}
									title={announcement.title}
									price={announcement.price}
									price_type={announcement.price_type}
									city={announcement.city}
									created_at={announcement.created_at}
									tags={announcement.tags}
								/>
							</div>
						))}

						<div className='mt-3'>
							<span className='pagination-total text-sm'>
								Znalezione ogłoszenia: {userAnnouncementsList?.meta?.total || '0'}
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
									<span className='pagination-total-pages me-2 text-sm'>
										Wyniki: 1 - {totalPages}
									</span>
								</div>
							</div>
						</div>
					</>
				) : (
					<div className='text-center mt-4'>
						<p className='color-gray'>W tej chwili nie masz żadnych zakończonych ogłoszeń.</p>
					</div>
				)}
			</div>
		</>
	)
}
