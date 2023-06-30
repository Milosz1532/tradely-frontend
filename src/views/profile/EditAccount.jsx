import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { useSelector } from 'react-redux'

import TabControl from '../../components/Layout/TabControl'

export default function EditAccount() {
	const user = useSelector(state => state.auth.user)

	const handlePersonalDataSubmit = values => {
		console.log('Dane osobowe zostały zapisane:', values)
	}

	const handleEmailSubmit = values => {
		console.log('Adres e-mail został zapisany:', values)
	}

	const handlePasswordSubmit = values => {
		console.log('Hasło zostało zapisane:', values)
	}

	const personalDataValidationSchema = Yup.object({
		username: Yup.string().required('Pole jest wymagane'),
		firstName: Yup.string().required('Pole jest wymagane'),
		lastName: Yup.string().required('Pole jest wymagane'),
		dateOfBirth: Yup.date().required('Pole jest wymagane'),
		city: Yup.string().required('Pole jest wymagane'),
	})

	const emailValidationSchema = Yup.object({
		email: Yup.string().email('Nieprawidłowy format adresu e-mail').required('Pole jest wymagane'),
		password: Yup.string().required('Pole jest wymagane'),
	})

	const passwordValidationSchema = Yup.object({
		currentPassword: Yup.string().required('Pole jest wymagane'),
		newPassword: Yup.string().required('Pole jest wymagane').min(8, 'Hasło musi mieć co najmniej 8 znaków'),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('newPassword'), null], 'Hasła muszą się zgadzać')
			.required('Pole jest wymagane'),
	})

	return (
		<div className='container-fluid'>
			<div className='row'>
				<h5 className='tab-title'>Edycja konta</h5>
				<article className='account-box'>
					<TabControl>
						<div title='Dane osobowe'>
							<h3 className='tab-control-h3'>Twoje dane osobowe</h3>
							<hr />
							<Formik
								initialValues={{
									username: user?.login || '',
									firstName: user?.first_name || '',
									lastName: user?.last_name || '',
									dateOfBirth: user?.birthday || '',
									city: user?.city || '',
								}}
								validationSchema={personalDataValidationSchema}
								onSubmit={handlePersonalDataSubmit}>
								<Form>
									<div className='form-group'>
										<label htmlFor='username'>Nazwa użytkownika:</label>
										<Field disabled type='text' id='username' name='username' className='form-control' />
									</div>
									<div className='form-group'>
										<label htmlFor='firstName'>Imię:</label>
										<Field
											type='text'
											id='firstName'
											name='firstName'
											className='form-control'
											placeholder='Wprowadź imię...'
										/>
										<ErrorMessage name='firstName' component='div' className='error-message' />
									</div>
									<div className='form-group'>
										<label htmlFor='lastName'>Nazwisko:</label>
										<Field
											type='text'
											id='lastName'
											name='lastName'
											className='form-control'
											placeholder='Wprowadź nazwisko...'
										/>
										<ErrorMessage name='lastName' component='div' className='error-message' />
									</div>
									<div className='form-group'>
										<label htmlFor='dateOfBirth'>Data urodzenia:</label>
										<Field
											type='date'
											id='dateOfBirth'
											name='dateOfBirth'
											className='form-control'
											placeholder='Wybierz datę urodzenia...'
										/>
										<ErrorMessage name='dateOfBirth' component='div' className='error-message' />
									</div>
									<div className='form-group'>
										<label htmlFor='city'>Miasto:</label>
										<Field
											type='text'
											id='city'
											name='city'
											className='form-control'
											placeholder='Wprowadź miasto...'
										/>
										<ErrorMessage name='city' component='div' className='error-message' />
									</div>
									<div className='d-flex mt-3 justify-content-end'>
										<button type='submit' className='btn-design'>
											Uaktualnij
										</button>
									</div>
								</Form>
							</Formik>
						</div>
						<div title='Wyświetlane informacje'>
							<h3>Wyświetlane informacje</h3>
							<hr />
						</div>
						<div title='Adres e-mail i hasło'>
							<h3>Adres e-mail i hasło</h3>
							<hr />

							<div className='profile-form-box'>
								<h5 className='form-title'>Zmiana adresu e-mail: </h5>
								<Formik
									initialValues={{
										email: user?.email || '',
										password: '',
									}}
									validationSchema={emailValidationSchema}
									onSubmit={handleEmailSubmit}>
									<Form className='mt-2'>
										<div className='form-group'>
											<label htmlFor='email'>Nowy adres e-mail:</label>
											<Field type='email' id='email' name='email' className='form-control' />
											<ErrorMessage name='email' component='div' className='error-message' />
										</div>
										<div className='form-group'>
											<label htmlFor='email'>Hasło: </label>
											<Field type='password' id='password' name='password' className='form-control' />
											<ErrorMessage name='password' component='div' className='error-message' />
										</div>
										<div className='d-flex mt-3 justify-content-end'>
											<button type='submit' className='btn-design'>
												Zmień adres e-mail
											</button>
										</div>
									</Form>
								</Formik>
							</div>

							<div className='profile-form-box mt-3'>
								<h5 className='form-title'>Zmiana hasła: </h5>

								<Formik
									initialValues={{
										currentPassword: '',
										newPassword: '',
										confirmPassword: '',
									}}
									validationSchema={passwordValidationSchema}
									onSubmit={handlePasswordSubmit}>
									<Form>
										<div className='form-group'>
											<label htmlFor='currentPassword'>Obecne hasło:</label>
											<Field type='password' id='currentPassword' name='currentPassword' className='form-control' />
											<ErrorMessage name='currentPassword' component='div' className='error-message' />
										</div>
										<div className='form-group'>
											<label htmlFor='newPassword'>Nowe hasło:</label>
											<Field type='password' id='newPassword' name='newPassword' className='form-control' />
											<ErrorMessage name='newPassword' component='div' className='error-message' />
										</div>
										<div className='form-group'>
											<label htmlFor='confirmPassword'>Potwierdź nowe hasło:</label>
											<Field type='password' id='confirmPassword' name='confirmPassword' className='form-control' />
											<ErrorMessage name='confirmPassword' component='div' className='error-message' />
										</div>
										<div className='d-flex mt-3 justify-content-end'>
											<button type='submit' className='btn-design'>
												Zmień hasło
											</button>
										</div>
									</Form>
								</Formik>
							</div>
						</div>
					</TabControl>
				</article>
			</div>
		</div>
	)
}
