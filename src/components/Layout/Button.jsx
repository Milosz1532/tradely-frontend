import React from 'react'

export default function Button({ text, size, color, className, onClick }) {
	return (
		<button
			className={`btn-design btn-size-${size}  ${color ? 'btn-color' : ''} ${
				className ? className : ''
			}`}
			onClick={onClick}>
			{text}
		</button>
	)
}
