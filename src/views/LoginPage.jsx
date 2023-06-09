import React, { useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import '../assets/styles/index.css'
import '../assets/styles/Auth.css'

import { useSelector, useDispatch } from 'react-redux'
import { login } from '../redux/actions/authActions'

export default function LoginPage() {
	const emailRef = useRef()
	const passwordRef = useRef()
	const dispatch = useDispatch()

	const handleSubmit = e => {
		e.preventDefault()

		dispatch(login(emailRef.current.value, passwordRef.current.value))
	}

	const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

	return (
		<div className='auth-form animated fadeInDown'>
			<div className='form'>
				<form onSubmit={handleSubmit}>
					{isAuthenticated ? 'Login' : 'Nie login'}

					<h2 className='auth-form-logo'>Tradely</h2>
					<p className='auth-form-title'>Panel Logowania</p>
					<hr />
					<div className='form-content'>
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Adres email</p>
							<input ref={emailRef} type='text' placeholder='Wprowadź adres email...' />
						</div>
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Hasło</p>
							<input ref={passwordRef} type='password' placeholder='Wprowadź hasło...' />
						</div>
					</div>
					<button className='form-btn mt-3'>Zaloguj się</button>
					<NavLink to='/signup'>
						<p className='text-start mt-1'>Dołącz do Tradely </p>
					</NavLink>
				</form>
			</div>
		</div>
	)
}
