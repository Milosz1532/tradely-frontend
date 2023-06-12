import React from 'react'
import ScrollLock from '../ScrollLock'
import ReactLoading from 'react-loading'

export default function LoadingPage({ fullSize, text }) {
	return (
		<>
			<ScrollLock />

			<div className={`LoadingPageContainer ${fullSize ? 'full-load' : ''}`}>
				<div className='loading-content'>
					<ReactLoading type={'spinningBubbles'} color={'#00A2FF'} width={'200px'} height={'200px'} />
					<span>{text}</span>
				</div>
			</div>
		</>
	)
}

{
	/* <>
			<ScrollLock />

			<div className='LoadingPageContainer'>
				<div className='loading-content'>
					<ReactLoading type={'bubbles'} color={'#fff'} width={'200px'} height={'200px'} />
					<span>Dodawanie ogłoszenia</span>
				</div>
			</div>
		</> */
}
