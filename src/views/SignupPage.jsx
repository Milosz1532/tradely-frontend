import { useRef, useState } from 'react'

import { NavLink, useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { signup } from '../redux/actions/authActions'

import { toast } from 'react-toastify'

import { startLoading, stopLoading } from '../redux/actions/loadingActions'

export default function SignupPage() {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [formErrors, setFormErrors] = useState({
		login: false,
		email: false,
		password: false,
		confirmPassword: false,
	})

	const loginRef = useRef()
	const emailRef = useRef()
	const passwordRef = useRef()
	const confirmPasswordRef = useRef()

	const validateForm = (login, email, password, confirmPassword) => {
		const errors = {
			login: login === '',
			email: email === '',
			password: password === '',
			confirmPassword: confirmPassword === '' || confirmPassword !== password,
		}

		const errorMessages = {
			login: 'Wprowadź nazwę użytkownika',
			email: 'Wprowadź adres email',
			password: 'Wprowadź hasło',
			confirmPassword: 'Hasło musi być takie samo',
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

	const handleSubmit = async e => {
		e.preventDefault()
		const login = loginRef.current.value
		const email = emailRef.current.value
		const password = passwordRef.current.value
		const confirmPassword = confirmPasswordRef.current.value

		const isValid = validateForm(login, email, password, confirmPassword)
		if (!isValid) return

		dispatch(startLoading())
		dispatch(signup(login, email, password))
			.then(() => {
				toast.success('Konto zarejestrowane pomyślnie!')
				navigate('/')
			})
			.catch(() => {
				toast.error('Nie udało się zarejestrować', {
					autoClose: 2000,
				})
			})
			.finally(() => {
				dispatch(stopLoading())
			})
	}

	const handleAnimationEnd = () => {
		setFormErrors(false)
	}

	return (
		<div className='auth-form animated fadeInDown'>
			<div className='form'>
				<form onSubmit={handleSubmit}>
					<NavLink to={'/'}>
						<h2 className='auth-form-logo'>Tradely</h2>
					</NavLink>
					<p className='auth-form-title'>Dołącz do nas</p>
					<hr />
					<div className='form-content'>
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Nazwa uzytkownika</p>
							<input
								ref={loginRef}
								type='text'
								placeholder='Wprowadź nazwę użytkownika...'
								className={formErrors.login ? 'shake' : ''}
								onAnimationEnd={handleAnimationEnd}
							/>
						</div>
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Adres Email</p>
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
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Powtórz hasło</p>
							<input
								ref={confirmPasswordRef}
								type='password'
								placeholder='Wprowadź ponownie hasło...'
								className={formErrors.confirmPassword ? 'shake' : ''}
								onAnimationEnd={handleAnimationEnd}
							/>
						</div>
					</div>
					<button className='form-btn mt-3'>Dołącz do nas</button>
					<NavLink to='/login'>
						<button className='form-btn empty mt-2'>Mam już konto</button>
					</NavLink>
				</form>
			</div>
		</div>
	)
}
