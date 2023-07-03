import React, { useState, useEffect } from 'react'
import ReactLoading from 'react-loading'
import { activateAccount } from '../../services/Api'
import '../../assets/styles/ActivateAccount.scss'
import { NavLink, Navigate } from 'react-router-dom'

export default function ActivateAccount() {
	const [loading, setLoading] = useState(true)
	const [result, setResult] = useState(null)

	useEffect(() => {
		const activate = async () => {
			try {
				const urlParams = new URLSearchParams(window.location.search)
				const activation_code = urlParams.get('activation_code')
				if (!activation_code) {
					setResult('invalidToken')
					setLoading(false)
					return
				}
				const response = await activateAccount(activation_code)
				console.log(response.status)
				if (response.status == 200) {
					setResult('success')
				} else if (response.status == 400) {
					setResult('alreadyActivated')
				} else {
					setResult('error')
				}
			} catch (error) {
				setResult('error')
			} finally {
				setLoading(false)
			}
		}
		setLoading(true)
		activate()
	}, [])

	const RenderMessage = () => {
		if (result == 'success') {
			return (
				<>
					<p>Twoje konto zostało pomyślnie aktywowane.</p>
					<p>Możesz teraz zalogować się na swoje konto i rozpocząć korzystanie z TRADELY.</p>
					<NavLink to={'/login'}>
						<button className='btn-design'>Zaloguj się</button>
					</NavLink>
				</>
			)
		} else if (result == 'invalidToken') {
			return (
				<>
					<Navigate to={'/'} />
				</>
			)
		} else if (result == 'error') {
			return (
				<>
					<p>Wystąpił błąd podczas aktywacji konta.</p>
					<p>Sprawdź link aktywacyjny lub skontaktuj się z obsługą klienta.</p>
					<NavLink to={'/'}>
						<button className='btn-design'>Powrót</button>
					</NavLink>
				</>
			)
		}
	}

	return (
		<section className='activate-container'>
			<div className='activate-account-box'>
				<h2 className='logo mb-2'>TRADELY</h2>
				{loading ? (
					<>
						<p className='mb-5'>Trwa weryfikacja twojego konta...</p>
						<ReactLoading
							type={'spinningBubbles'}
							color={'#00A2FF'}
							width={'200px'}
							height={'200px'}
						/>
					</>
				) : (
					<RenderMessage />
				)}
			</div>
		</section>
	)
}
