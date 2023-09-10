import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '../../assets/styles/CreateAnnouncement.scss'

import noImage from '/images/no-image.png'

import userIcon from '/images/user.png'
import Skeleton from 'react-loading-skeleton'

import Button from '../Layout/Button'

const PreviewAnnouncement = ({
	images,
	title,
	description,
	tagsArray,
	selectedPriceType,
	priceInput,
	selectedProductState,
	filterValues,
	subcategoryFiltersList,
}) => {
	const formattedAmount = new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency: 'PLN',
		useGrouping: true,
	}).format(priceInput)

	function DisplayFilterValues({ filterValues, subcategoryFiltersList }) {
		const filterElements = []

		// Iteruj przez subcategoryFiltersList
		for (const filter of subcategoryFiltersList) {
			const filterId = filter.id
			const selectedValueId = filterValues[filterId]

			// Szukaj wartości wybranej w filterValues
			if (selectedValueId !== undefined) {
				const selectedValue = filter.values.find(value => value.id === selectedValueId)
				if (selectedValue) {
					filterElements.push(
						<div key={filterId} className='col-6 mt-1'>
							<span className='color-gray'>{filter.name}: </span>
							<span className='ms-1'>{selectedValue.value}</span>
						</div>
					)
				} else {
					filterElements.push(
						<div key={filterId} className='col-6 mt-1'>
							<span className='color-gray'>{filter.name}: </span>
							<span className='ms-1'>{selectedValueId}</span>
						</div>
					)
				}
			}
		}

		return <>{filterElements}</>
	}

	return (
		<section className='main-border-box'>
			<article className='createAnnouncement-preview'>
				<article className='createAnnouncement-preview-images'>
					<div className='main-image'>
						<img
							draggable={false}
							src={images.length > 0 ? images[0].file : noImage}
							alt='Brak zdjęcia ogłoszenia'
						/>
					</div>
					<div className='other-images'>
						{images.map((image, index) => (
							<>
								<img
									className='mt-1'
									draggable={false}
									src={image.file}
									alt='kolejne zdjęcie ogłoszenia'
								/>
							</>
						))}
					</div>
				</article>
				<article className='createAnnouncement-preview-content mt-1'>
					<div className='content-data'>
						<span className='text-xs'>Dodane 24.07.2023 20:48</span>
					</div>
					<h5 className='mt-2'>{title}</h5>
					<h5 className='mt-2 color-main'>
						{selectedPriceType &&
							(selectedPriceType.id != 1 ? selectedPriceType.name : formattedAmount)}
					</h5>

					<ul className='preview-announcement-filters'>
						{/* {selectedProductState && <li>{selectedProductState.name}</li>} */}
						{tagsArray.map(t => (
							<li key={`announcement-${t.id}-tag-id-${t.id}`}>{t.name}</li>
						))}
					</ul>

					<h5 className='mt-3 border-top pt-3 text-md font-600'>O przedmiocie: </h5>
					<pre>{description}</pre>

					<div className='text-sm'>
						{subcategoryFiltersList && (
							<div className='border-top pt-3 mt-3'>
								<div className='row'>
									{selectedProductState && (
										<div className='col-6 mt-1'>
											<span className='color-gray'>Stan: </span>
											<span className='ms-1'>{selectedProductState.name}</span>
										</div>
									)}

									<DisplayFilterValues
										filterValues={filterValues}
										subcategoryFiltersList={subcategoryFiltersList}
									/>
								</div>
							</div>
						)}
					</div>
				</article>
			</article>
		</section>
	)
}
export default PreviewAnnouncement
