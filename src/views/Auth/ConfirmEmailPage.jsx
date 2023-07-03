import React, { useState, useEffect } from 'react'
import confirmEmailIcon from '/images/confirm-email-icon.svg'
import { toast } from 'react-toastify'
import '../../assets/styles/ActivateAccount.scss'
import { NavLink, Navigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { resendVerificationEmail, checkVerificationCode } from '../../services/Api'
import ReactLoading from 'react-loading'

export default function ConfirmEmailPage() {
	const { verificationCode } = useParams()
	const [loading, setLoading] = useState(false)
	const [result, setResult] = useState(null)

	const [email, setEmail] = useState(null)

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showTimer, setShowTimer] = useState(false)
	const [remainingTime, setRemainingTime] = useState(10) // 2 minutes in seconds

	useEffect(() => {
		const verifyCode = async () => {
			try {
				const response = await checkVerificationCode(verificationCode)
				console.log(response.status)
				if (response.status === 200) {
					setResult(true)
					setEmail(response.email)
				} else {
					toast.error('Nie udało się wysłać linku aktywacyjnego')
					setResult(false)
				}
			} catch (error) {
				setResult(false)
			} finally {
				// setIsSubmitting(false)
				setLoading(false)
			}
		}
		setLoading(true)
		verifyCode()
	}, [])

	useEffect(() => {
		let timerId

		if (showTimer && remainingTime > 0) {
			timerId = setInterval(() => {
				setRemainingTime(prevTime => prevTime - 1)
			}, 1000)
		}

		if (showTimer && remainingTime <= 0) {
			setShowTimer(false)
		}

		return () => {
			clearInterval(timerId)
		}
	}, [showTimer, remainingTime])

	const handleSubmitAgain = async () => {
		setIsSubmitting(true)
		try {
			const response = await resendVerificationEmail(verificationCode)
			console.log(response.status)
			if (response.status === 200) {
				toast.success('Link aktywacyjny został ponownie wysłany na twój adres mailowy')
				setShowTimer(true)
				setRemainingTime(10) // Reset the remaining time to 2 minutes
			} else {
				toast.error('Nie udało się wysłać linku aktywacyjnego')
			}
		} catch (error) {
			toast.error('Nie udało się wysłać linku aktywacyjnego')
		} finally {
			setIsSubmitting(false)
		}
	}

	const formatTime = time => {
		const minutes = Math.floor(time / 60)
		const seconds = time % 60
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	if (!verificationCode) {
		return <Navigate to={'/'} />
	}

	return (
		<section className='activate-container'>
			<div className='activate-account-box'>
				{loading ? (
					false
				) : (
					<>
						{result === false && <Navigate to={'/'} />}

						<h2 className='logo p-5'>TRADELY</h2>
						<img src={confirmEmailIcon} width={300} />
						<p className='pt-5 activate-email'>Adres email: {email}</p>
						<p className='pt-1'>
							Na twoją skrzynkę mailową został wysłany link aktywacyjny. Potwierdź swój adres email,
							aby móc w pełni korzystać z aplikacji Tradely
						</p>

						<div className='d-flex justify-content-center align-items-center'>
							<NavLink to={'/'}>
								<button className='btn-design me-3' style={{ height: '55px' }}>
									Powrót
								</button>
							</NavLink>
							<button
								onClick={handleSubmitAgain}
								className='btn-design white'
								type='submit'
								disabled={isSubmitting || showTimer}>
								{isSubmitting ? (
									<div
										className='d-flex justify-content-center'
										style={{ marginTop: '-15px', width: '200px', height: '40px' }}>
										<ReactLoading type={'bubbles'} color={'#67ade0'} className='text-center' />
									</div>
								) : showTimer ? (
									// Display the remaining time instead of the button
									`Wyślij ponownie za ${formatTime(remainingTime)}`
								) : (
									'Wyślij ponownie kod'
								)}
							</button>
						</div>
					</>
				)}
			</div>
		</section>
	)
}
