import React from 'react'

export default function Button({ text, size, color, className }) {
	return (
		<button
			className={`btn-design btn-size-${size}  ${color ? 'btn-color' : ''} ${
				className ? className : ''
			}`}>
			{text}
		</button>
	)
}
