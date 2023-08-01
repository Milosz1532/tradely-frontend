import React from 'react'
import Select from 'react-select'

const selectStyle = {
	control: provided => ({
		...provided,
		border: 'none',
		borderRadius: '10px',
		padding: '5px 5px',
		margin: '0',
		boxShadow: '0px 0px 10px 0px rgba(237, 237, 237, 1)',
		opacity: 0.8,
		transition: 'opacity 0.4s',
		'&:focus': {
			outline: 'none',
			opacity: 1,
			boxShadow: '0px 0px 10px 0px rgba(0, 0, 255, 0.7)',
			zIndex: '100',
		},
	}),
	menu: provided => ({ ...provided, zIndex: 5 }),
}

export default function CustomSelect({ options, placeholder, value, onChange, isDisabled }) {
	return (
		<Select
			options={options}
			placeholder={placeholder}
			styles={selectStyle}
			value={value}
			onChange={onChange}
			isDisabled={isDisabled}
		/>
	)
}
