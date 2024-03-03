import React, { useState, useEffect, useRef } from 'react'

export default function Select({
	options,
	defaultOption,
	value,
	disabled,
	onChange,
	renderOption,
	renderDefaultOption,
	className,
}) {
	const [open, setOpen] = useState(false)
	const [selectedOption, setSelectedOption] = useState(value)
	const dropdownRef = useRef(null)

	const handleOptionClick = option => {
		setSelectedOption(option)
		setOpen(false)
		if (onChange) {
			onChange(option)
		}
	}

	const handleClickOutside = event => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		setSelectedOption(value)
	}, [value])

	return (
		<div
			className={`dropdown ${disabled ? 'disabled' : ''} ${className ? className : ''}`}
			ref={dropdownRef}>
			<div className={`select ${open ? 'select-clicked' : ''}`} onClick={() => setOpen(!open)}>
				<span className='selected'>
					{selectedOption
						? renderOption(selectedOption)
						: renderDefaultOption
						? renderDefaultOption(defaultOption)
						: defaultOption?.name || options[0]?.name || ''}
				</span>
				<div className={`caret ${open ? 'caret-rotate' : ''}`}></div>
			</div>
			<ul className={`menu ${open ? 'menu-open' : ''}`}>
				{defaultOption === undefined ? null : (
					<li onClick={() => handleOptionClick(defaultOption)}>
						{renderDefaultOption ? renderDefaultOption(defaultOption) : defaultOption.name}
					</li>
				)}

				{options &&
					options.map(option => (
						<li
							key={option.id}
							onClick={() => handleOptionClick(option)}
							className={selectedOption === option ? 'active' : ''}>
							{renderOption(option)}
						</li>
					))}
			</ul>
		</div>
	)
}
