import React, { useEffect, useState } from 'react'
import CustomSelect from '../../Layout/CustomSelect'
import { getSubcategoryFilters } from '../../../services/Api'

export default function Step5({ selectedSubcategory, filterValues, setFilterValues }) {
	useEffect(() => {
		console.log(selectedSubcategory)
	}, [])

	const [subcategoryFiltersList, setSubcategoryFiltersList] = useState(false)

	useEffect(() => {
		const fetchSubcategoryFilters = async () => {
			if (!selectedSubcategory) return
			// setLoadingFilters(true)
			try {
				const response = await getSubcategoryFilters(selectedSubcategory.value)
				setSubcategoryFiltersList(response.filters)
			} catch (error) {
			} finally {
				// setLoadingFilters(false)
			}
		}
		fetchSubcategoryFilters()
	}, [])

	const handleFilterChange = (filterId, selectedValue) => {
		setFilterValues(prevFilterValues => ({
			...prevFilterValues,
			[filterId]: selectedValue,
		}))
		console.log(filterValues)
	}

	return (
		<>
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
											filterValues[filter.id]
												? {
														value: filterValues[filter.id],
														label: filter.values.find(value => value.id === filterValues[filter.id])
															?.value,
												  }
												: null
										}
										onChange={selectedOption =>
											handleFilterChange(filter.id, selectedOption ? selectedOption.value : null)
										}
									/>
								)}
								{filter.input_type === 'input' && (
									<>
										<input
											type='text'
											placeholder={filter.placeholder}
											value={filterValues[filter.id] || ''}
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
		</>
	)
}
