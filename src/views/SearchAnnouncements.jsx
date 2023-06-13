import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { searchAnnouncements } from '../services/SearchService'

import SearchBar from '../components/Searchbar'

import Skeleton from 'react-loading-skeleton'
import RectangularAnnouncement from '../components/RectangularAnnouncement'
import SquareAnnouncement from '../components/SquareAnnouncement'

const SkelletonAnnouncement = () => {
	return (
		<div className='col-12 rectangular-announcement mt-2'>
			<div className='row'>
				<div className='col-2 rectangular-announcement-image'>
					<div className='ms-3 mt-1'>
						<Skeleton height={100} />
					</div>
				</div>
				<div className='col-10 rectangular-announcement-content'>
					<div className='reactangular-announement-top-section'>
						<h5 className='title'>
							<Skeleton width={200} />
						</h5>
						<h5 className='price'>
							<Skeleton width={100} />
						</h5>
					</div>
					<ul className='tags'>
						<li>
							<Skeleton width={60} />
						</li>
						<li>
							<Skeleton width={80} />
						</li>
						<li>
							<Skeleton width={100} />
						</li>
						<li>
							<Skeleton width={80} />
						</li>
					</ul>
					<div className='location'>
						<span>
							<Skeleton width={120} />
						</span>
						<span>
							<Skeleton width={120} />
						</span>
					</div>
					<i className='favorite-icon'>
						<Skeleton circle={true} height={20} width={20} />
					</i>
				</div>
			</div>
		</div>
	)
}

const LoadingAnnouncementsScreen = () => {
	return (
		<>
			<div className='row'>
				<div className='col-5'>
					<Skeleton height={40} />
				</div>
				<div className='mt-2'>
					<SkelletonAnnouncement />
					<SkelletonAnnouncement />
					<SkelletonAnnouncement />
					<SkelletonAnnouncement />
					<SkelletonAnnouncement />
					<SkelletonAnnouncement />
				</div>
			</div>
		</>
	)
}

const ShowAnnouncements = ({ announcements }) => {
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

	return (
		<>
			<div className='sort-announcements d-flex justify-content-between'>
				<h4>Znalezione ogłoszenia: {announcements.meta.total}</h4>
				<div className='buttons'>
					<i className={`me-3 sort-icon ${sortType && 'active'}`}>
						<FontAwesomeIcon onClick={e => setSortType(true)} icon='fa-solid fa-list' />
					</i>
					<i className={`me-3 sort-icon ${!sortType && 'active'}`}>
						<FontAwesomeIcon onClick={e => setSortType(false)} icon='fa-solid fa-table-cells' />
					</i>
				</div>
			</div>
			<div className='row'>{announcementsList}</div>
		</>
	)
}

function SearchAnnouncements() {
	const { location, category, keyword } = useParams()
	const [announcements, setAnnouncements] = useState(false)
	const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)
	useEffect(() => {
		const fetchAnnouncements = async () => {
			try {
				const announcementsData = await searchAnnouncements(location, '', keyword)
				setAnnouncements(announcementsData)
				setLoadingAnnouncements(false)
			} catch (error) {
				console.error('Wystąpił błąd podczas pobierania ogłoszeń:', error)
			}
		}

		fetchAnnouncements()
	}, [location, category, keyword])

	return (
		<>
			<section className='preview-announcement-search-section mb-3'>
				<div className='container'>
					<h2>Wyszukaj ogłoszenie</h2>
					<SearchBar />
				</div>
			</section>
			<section className='search-announcements container mt-5' style={{ minHeight: '400px' }}>
				{loadingAnnouncements ? <LoadingAnnouncementsScreen /> : <ShowAnnouncements announcements={announcements} />}
			</section>
		</>
	)
}

export default SearchAnnouncements
