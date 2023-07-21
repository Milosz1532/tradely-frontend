import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Step4 = ({ priceInput, setPriceInput, selectedPriceType, setSelectedPriceType }) => {
	const formatValue = value => {
		if (isNaN(value)) return ''

		const parts = value.toString().split('.')
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

		return parts.join(',')
	}

	const handleChange = event => {
		const { value } = event.target
		const numericValue = value.replace(/[^\d]/g, '')
		if (Number(numericValue) >= 0 && Number(numericValue) <= 1000000) {
			setPriceInput(Number(numericValue))
		}
	}

	return (
		<>
			<div className='row px-3'>
				<p className='create-announement-tab-title p-0'>Wybierz rodzaj płatności</p>
				<div className='create-announcement-price-buttons'>
					<button
						className={`${selectedPriceType === 1 && 'active'}`}
						onClick={() => setSelectedPriceType(1)}>
						Kwota
					</button>
					<button
						className={`${selectedPriceType === 2 && 'active'}`}
						onClick={() => setSelectedPriceType(2)}>
						Zamienię
					</button>
					<button
						className={`${selectedPriceType === 3 && 'active'}`}
						onClick={() => setSelectedPriceType(3)}>
						Oddam za darmo
					</button>
				</div>

				<div className='mt-3'>
					{selectedPriceType === 1 && (
						<div className='form-input'>
							<label className='required'>Kwota</label>
							<input
								type='text'
								placeholder='Wprowadź kwotę...'
								value={formatValue(priceInput)}
								onChange={handleChange}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default Step4
