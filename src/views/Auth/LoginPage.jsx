import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../../assets/styles/Auth.css'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/actions/authActions'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

export default function LoginPage() {
	const dispatch = useDispatch()

	const handleSubmit = (values, { setSubmitting }) => {
		dispatch(login(values.email, values.password))
			.then(() => {
				toast.success('Pomyślnie zalogowano')
			})
			.catch(error => {
				Swal.fire({
					icon: 'error',
					text: error.error,
				})
			})
			.finally(() => {
				setSubmitting(false)
			})
	}

	const validationSchema = Yup.object().shape({
		email: Yup.string().email('Wprowadź poprawny adres email').required('Wprowadź adres email'),
		password: Yup.string().required('Wypełnij to pole'),
	})

	return (
		<div className='auth-form animated fadeInDown'>
			<div className='form'>
				<Formik
					initialValues={{ email: '', password: '' }}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}>
					{({ isSubmitting }) => (
						<Form>
							<br />

							<NavLink to={'/'}>
								<h2 className='auth-form-logo'>Tradely</h2>
							</NavLink>
							<p className='auth-form-title'>Panel Logowania</p>
							<hr />
							<div className='form-content'>
								<div className='standard-input-design mt-2'>
									<p className='text-start'>Adres email</p>
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
							</div>
							<button className='form-btn mt-3' type='submit' disabled={isSubmitting}>
								{isSubmitting ? 'Trwa logowanie...' : 'Zaloguj się'}
							</button>
							<NavLink to='/signup'>
								<button className='form-btn empty mt-2'>Dołącz do Tradely</button>
							</NavLink>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	)
}
