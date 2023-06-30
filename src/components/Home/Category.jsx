import React from 'react'

export default function Category() {
	return (
		// <div className='col-md-3 col-sm-4 col-xl-2'>
		<div className='px-3 py-2'>
			<div className='category-box'>
				<div className='image-box color-3'>
					<img draggable='false' src='/images/categories_icons/cars.png' alt='Elektronika' />
				</div>
				<div className='title'>Motoryzacja</div>
				<p className='count'>13 543 ogłoszeń</p>
			</div>
		</div>
	)
}
