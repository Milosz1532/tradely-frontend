import React from 'react'
import Skeleton from 'react-loading-skeleton'

import noImage from '/images/no-image.png'

export function Category({ id, name, image }) {
	return (
		// <div className='col-md-3 col-sm-4 col-xl-2'>
		<div className='px-3 py-2'>
			<div className='category-box'>
				<div className='image-box color-3'>
					{image ? (
						<img draggable='false' src={image} alt='Zdjęcie popularnej kategori' />
					) : (
						<div className='image-box-empty-image'></div>
					)}
				</div>
				<div className='title'>{name}</div>
				<p className='count'>13 543 ogłoszeń</p>
			</div>
		</div>
	)
}

export function LoadingCategory() {
	return (
		// <div className='col-sm-6 col-md-4 col-sm-4 col-xl-2'>
		<div className='px-3 py-2'>
			<div className='category-box'>
				<div>
					<Skeleton circle={true} height={100} width={100} />
				</div>
				<div className='title w-75'>
					<Skeleton height={20} />
				</div>
				<p className='count w-50'>
					<Skeleton height={20} />
				</p>
			</div>
		</div>
		// </div>
	)
}

export default {
	Category,
	LoadingCategory,
}
