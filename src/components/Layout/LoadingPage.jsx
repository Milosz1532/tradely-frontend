import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ScrollLock from '../../ScrollLock'

export default function LoadingPage({ fullSize }) {
	const isLoading = useSelector(state => state.loading.isLoading)
	const [isShowing, setIsShowing] = useState(false)
	const [isHiding, setIsHiding] = useState(false)

	useEffect(() => {
		if (isLoading) {
			setIsHiding(false)
			setIsShowing(true)
		} else {
			setIsHiding(true)
		}
	}, [isLoading])

	return (
		<>
			{isShowing && (
				<>
					<ScrollLock />
					<div
						className={`loadingPage ${fullSize ? 'fullSize' : ''} ${isHiding ? 'fade-out' : ''}`}>
						<div className='loading-content'>
							<h5 className='loading-logo'>Tradely</h5>
						</div>
					</div>
				</>
			)}
		</>
	)
}

//{
/* <div className={`LoadingPageContainer ${fullSize ? 'full-load' : ''}`}>
				<div className='loading-content'>
					<ReactLoading type={'spinningBubbles'} color={'#00A2FF'} width={'200px'} height={'200px'} />
					<span>{text}</span>
				</div>
			</div> */
//}
