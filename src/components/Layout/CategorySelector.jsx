import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CategorySelector = ({
	categories,
	selectedCategory,
	selectedSubcategory,
	handleSelectCategory,
	handleSelectSubcategory,
}) => {
	console.log(selectedCategory)
	return (
		<div className='category-selector-box'>
			{!selectedCategory || selectedCategory.subcategories.length <= 0 ? (
				<>
					<ul>
						{categories.map(element => (
							<li key={element.id}>
								<div
									onClick={e => handleSelectCategory(element)}
									className='d-flex align-items-center justify-content-between px-2'>
									<div className='d-flex align-items-center'>
										<i style={{ width: '30px', textAlign: 'center' }}>
											<FontAwesomeIcon icon={element.icon} />
										</i>
										<p>{element.name}</p>
									</div>
									<span>
										{element.subcategories.length > 0 && (
											<i className='icon-sm'>
												<FontAwesomeIcon icon='fa-solid fa-angle-right' />
											</i>
										)}
									</span>
								</div>
							</li>
						))}
					</ul>
				</>
			) : (
				<div>
					<div className='category-selector-selected-category'>
						<p className='clickable-label p-2 m-0' onClick={e => handleSelectCategory(null)}>
							<i className='icon-md me-2'>
								<FontAwesomeIcon icon='fa-solid fa-angle-left' />
							</i>
							Powrót do wszyskich kategorii
						</p>
						<div className='d-flex align-items-center border-top'>
							<div className='d-flex align-items-center p-2'>
								<i className='icon-lg color-main'>
									<FontAwesomeIcon icon={selectedCategory.icon} />
								</i>
								<p className='ms-2 category-title'>{selectedCategory.name}</p>
							</div>
						</div>
					</div>
					<ul className=''>
						{selectedCategory.subcategories.map(element => (
							<li key={element.id}>
								<p onClick={e => handleSelectSubcategory(element)}>{element.name}</p>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}

export default CategorySelector
