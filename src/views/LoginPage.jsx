import React, { useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import '../assets/styles/index.css'
import '../assets/styles/Auth.css'

import { useSelector, useDispatch } from 'react-redux'
import { login } from '../redux/actions/authActions'
import { toast } from 'react-toastify'

export default function LoginPage() {
	const emailRef = useRef()
	const passwordRef = useRef()
	const dispatch = useDispatch()

	const [formErrors, setFormErrors] = useState({
		email: false,
		password: false,
	})

	const validateForm = (email, password) => {
		const errors = {
			email: email === '',
			password: password === '',
		}

		const errorMessages = {
			email: 'Wprowadź adres email',
			password: 'Wprowadź hasło',
		}

		for (const field in errors) {
			if (errors[field]) {
				setFormErrors(prevErrors => ({
					...prevErrors,
					[field]: errorMessages[field],
				}))
				toast.error(errorMessages[field], {
					autoClose: 3000,
				})
			}
		}

		return Object.values(errors).every(error => !error)
	}

	const handleSubmit = e => {
		e.preventDefault()

		const email = emailRef.current.value
		const password = passwordRef.current.value

		if (!validateForm(email, password)) return

		dispatch(login(email, password))
			.then(() => {
				toast.success('Pomyślnie zalogowano')
			})
			.catch(error => {
				toast.error('Wprowadzone dane są nieprawidłowe')
			})
	}

	const handleAnimationEnd = () => {
		setFormErrors(false)
	}

	return (
		<div className='auth-form animated fadeInDown'>
			<div className='form'>
				<form onSubmit={handleSubmit}>
					<br />

					<NavLink to={'/'}>
						<h2 className='auth-form-logo'>Tradely</h2>
					</NavLink>
					<p className='auth-form-title'>Panel Logowania</p>
					<hr />
					<div className='form-content'>
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Adres email</p>
							<input
								ref={emailRef}
								type='text'
								placeholder='Wprowadź adres email...'
								className={formErrors.email ? 'shake' : ''}
								onAnimationEnd={handleAnimationEnd}
							/>
						</div>
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Hasło</p>
							<input
								ref={passwordRef}
								type='password'
								placeholder='Wprowadź hasło...'
								className={formErrors.password ? 'shake' : ''}
								onAnimationEnd={handleAnimationEnd}
							/>
						</div>
					</div>
					<button className='form-btn mt-3'>Zaloguj się</button>
					<NavLink to='/signup'>
						<button className='form-btn empty mt-2'>Dołącz do Tradely</button>
					</NavLink>
				</form>
			</div>
		</div>
	)
}
