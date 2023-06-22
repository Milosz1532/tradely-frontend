import React, { useState } from 'react'

const TabControl = ({ children }) => {
	const [toggleState, setToggleState] = useState(1)

	const toggleTab = index => {
		setToggleState(index)
	}

	return (
		<>
			<div className='tab-controll-bloc-tabs'>
				{React.Children.map(children, (child, index) => (
					<button
						className={toggleState === index + 1 ? 'tabs active-tabs' : 'tabs'}
						onClick={() => toggleTab(index + 1)}>
						{child.props.title}
					</button>
				))}
			</div>

			<div className='content-tabs'>
				{React.Children.map(children, (child, index) => (
					<div
						className={
							toggleState === index + 1
								? 'tab-controll-content active-content'
								: 'tab-controll-content'
						}>
						{child}
					</div>
				))}
			</div>
		</>
	)
}

export default TabControl
