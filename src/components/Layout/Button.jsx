import React from 'react'

export default function Button({
	text,
	size,
	color,
	rounded,
	className,
	disabled,
	onClick,
	transparent,
}) {
	return (
		<button
			className={`btn-design btn-size-${size}  ${color ? 'btn-color' : ''} ${
				disabled ? 'disabled' : ''
			} ${rounded ? 'btn-rounded' : ''} ${className ? className : ''} ${
				transparent ? 'btn-transparent' : ''
			}`}
			onClick={!disabled && onClick}>
			{text}
		</button>
	)
}
