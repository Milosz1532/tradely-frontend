import React, { useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signup } from '../redux/actions/authActions'
import { toast } from 'react-toastify'
import { startLoading, stopLoading } from '../redux/actions/loadingActions'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

export default function SignupPage() {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const validationSchema = Yup.object().shape({
		login: Yup.string().required('Wprowadź nazwę użytkownika'),
		email: Yup.string().email('Wprowadź poprawny adres email').required('Wprowadź adres email'),
		password: Yup.string().required('Wprowadź hasło'),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('password'), null], 'Hasło musi być takie samo')
			.required('Powtórz hasło'),
	})

	const handleSubmit = (values, { setSubmitting }) => {
		const { login, email, password } = values

		dispatch(startLoading())
		dispatch(signup(login, email, password))
			.then(() => {
				toast.success('Konto zarejestrowane pomyślnie!')
				navigate('/')
			})
			.catch(error => {
				console.log(error)
				toast.error('Nie udało się zarejestrować', {
					autoClose: 2000,
				})
			})
			.finally(() => {
				dispatch(stopLoading())
				setSubmitting(false)
			})
	}

	return (
		<div className='auth-form animated fadeInDown'>
			<div className='form'>
				<Formik
					initialValues={{ login: '', email: '', password: '', confirmPassword: '' }}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}>
					{({ isSubmitting }) => (
						<Form>
							<NavLink to={'/'}>
								<h2 className='auth-form-logo'>Tradely</h2>
							</NavLink>
							<p className='auth-form-title'>Dołącz do nas</p>
							<hr />
							<div className='form-content'>
								<div className='standard-input-design mt-2'>
									<p className='text-start'>Nazwa użytkownika</p>
									<Field type='text' name='login' placeholder='Wprowadź nazwę użytkownika...' />
									<div className='text-start error-box'>
										<ErrorMessage name='login' component='span' className='error-message' />
									</div>
								</div>
								<div className='standard-input-design mt-2'>
									<p className='text-start'>Adres Email</p>
									<Field type='text' name='email' placeholder='Wprowadź adres email...' />
									<div className='text-start error-box'>
										<ErrorMessage name='email' component='span' className='error-message' />
									</div>
								</div>
								<div className='standard-input-design mt-2'>
									<p className='text-start'>Hasło</p>
									<Field type='password' name='password' placeholder='Wprowadź hasło...' />
									<div className='text-start error-box'>
										<ErrorMessage name='password' component='span' className='error-message' />
									</div>
								</div>
								<div className='standard-input-design mt-2'>
									<p className='text-start'>Powtórz hasło</p>
									<Field type='password' name='confirmPassword' placeholder='Wprowadź ponownie hasło...' />
									<div className='text-start error-box'>
										<ErrorMessage name='confirmPassword' component='span' className='error-message' />
									</div>
								</div>
							</div>
							<button className='form-btn mt-3' type='submit' disabled={isSubmitting}>
								{isSubmitting ? 'Trwa rejestracja...' : 'Dołącz do nas'}
							</button>
							<NavLink to='/login'>
								<button className='form-btn empty mt-2'>Mam już konto</button>
							</NavLink>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	)
}
