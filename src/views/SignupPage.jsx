import React, { useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { signup } from '../redux/actions/authActions'

export default function SignupPage() {
	const dispatch = useDispatch()

	const loginRef = useRef()
	const emailRef = useRef()
	const passwordRef = useRef()
	const confirmPasswordRef = useRef()

	const handleSubmit = async e => {
		e.preventDefault()
		const login = loginRef.current.value
		const email = emailRef.current.value
		const password = passwordRef.current.value
		dispatch(signup(login, email, password))
			.then(() => {
				console.log(`Rejestracja się udała`)
			})
			.catch(error => {
				console.log(`Nie udało się zarejestrować:`, error)
			})
	}

	return (
		<div className='auth-form animated fadeInDown'>
			<div className='form'>
				<form onSubmit={handleSubmit}>
					<h2 className='auth-form-logo'>Tradely</h2>
					<p className='auth-form-title'>Dołącz do nas</p>
					<hr />
					<div className='form-content'>
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Nazwa uzytkownika</p>
							<input ref={loginRef} type='text' placeholder='Wprowadź nazwę uzytkownika...' />
						</div>
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Adres Email</p>
							<input ref={emailRef} type='text' placeholder='Wprowadź adres email...' />
						</div>
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Hasło</p>
							<input ref={passwordRef} type='password' placeholder='Wprowadź hasło...' />
						</div>
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Powtórz hasło</p>
							<input ref={confirmPasswordRef} type='password' placeholder='Wprowadź ponownie hasło...' />
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
