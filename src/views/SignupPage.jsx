import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function SignupPage() {
	const handleSubmit = e => {
		e.preventDefault()
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
							<input type='text' placeholder='Wprowadź nazwę uzytkownika...' />
						</div>
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Adres Email</p>
							<input type='text' placeholder='Wprowadź adres email...' />
						</div>
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Hasło</p>
							<input type='password' placeholder='Wprowadź hasło...' />
						</div>
						<div className='standard-input-design mt-2'>
							<p className='text-start'>Powtórz hasło</p>
							<input type='password' placeholder='Wprowadź ponownie hasło...' />
						</div>
					</div>
					<button className='form-btn mt-3'>Dołącz do nas</button>
					<NavLink to='/login'>
						<button className='form-btn empty mt-1'>Mam już konto</button>
					</NavLink>
				</form>
			</div>
		</div>
	)
}
