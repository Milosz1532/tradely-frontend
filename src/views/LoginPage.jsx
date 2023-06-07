import React, { useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import '../assets/styles/index.css'
import '../assets/styles/Auth.css'

import axiosClient from '../helpers/axios-client'
import { useSelector, useDispatch } from 'react-redux'

import { loginSuccess, loginFailure } from '../redux/actions/actions'

export default function LoginPage() {
	const emailRef = useRef()
	const passwordRef = useRef()
	const dispatch = useDispatch()

	const handleSubmit = e => {
		e.preventDefault()
		const payload = {
			email: emailRef.current.value,
			password: passwordRef.current.value,
		}

		axiosClient
			.post('/login', payload)
			.then(({ data }) => {
				console.log(`Zgadza się`)
				const user = data.user

				// Wywołaj akcję logowania i przekaż użytkownika
				dispatch(loginSuccess(user))
			})
			.catch(err => {
				const response = err.response
				console.log(err)
				if (response && response.status === 422) {
					if (response.data.errors) {
						console.log('Errors')
					}
					console.log('Error')
				}
			})
	}
	const user = useSelector(state => state.auth.user)

	return (
		<div className='auth-form animated fadeInDown'>
			<div className='form'>
				{user && <p>Z</p>}
				<form onSubmit={handleSubmit}>
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
