import React, { useState } from 'react'
import { motion } from 'framer-motion'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../assets/styles/CreateAnnouncement.scss'

const Step1 = () => {
	return <p>Krok 1</p>
}

const Step2 = () => {
	return <p>Krok 2</p>
}

const Step3 = () => {
	return <p>Krok 3</p>
}

const Step4 = () => {
	return <p>Krok 4</p>
}

const CreateAnnouncement = () => {
	const [activeStep, setActiveStep] = useState(2)

	const progressItems = [
		{
			title: 'Co chcesz sprzedać?',
			subTitle: 'Tutaj decydujesz co chcesz sprzedać',
			icon: 'fa-regular fa-file',
		},
		{
			title: 'Galeria zdjęć',
			subTitle: 'Tutaj możesz dodać zdjęcia i opis do swojego ogłoszenia',
			icon: 'fa-solid fa-images',
		},
		{
			title: 'Twoja wycena',
			subTitle: 'To ty decydujesz ile chcesz zarobić na swoim przedmiocie',
			icon: 'fa-solid fa-coins',
		},
		{
			title: 'Podsumowanie',
			subTitle: 'Podsumowanie',
			icon: 'fa-regular fa-circle-check',
		},
	]

	const getCurrentStepComponent = () => {
		switch (activeStep) {
			case 1:
				return <Step1 />
			case 2:
				return <Step2 />
			case 3:
				return <Step3 />
			case 4:
				return <Step4 />
			default:
				return null
		}
	}

	const handleChangeStep = step => {
		setActiveStep(step)
	}

	return (
		<>
			<div className='container'>
				<div className='col-12 mt-4 createAnnouncement-page-title'>
					<h3 className='title'>Dodaj swoje nowe ogłoszenie</h3>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint alias, architecto est
						minima sequi repudiandae rem pariatur quas magnam ullam dolorem sapiente eius excepturi
						aperiam officiis doloremque distinctio nam aliquam?
					</p>
				</div>
				<div className='createAnnouncement-container mt-3'>
					<div className='fixed-container'>
						<div className='container-content'>
							<h5 className='container-content-title'>Postęp</h5>
							<div className='progress-container'>
								{progressItems.map((item, index) => (
									<div
										key={index}
										className={`progress-item ${activeStep === index + 1 && 'active'} ${
											activeStep > index + 1 && 'completed'
										}`}>
										<div className='description'>
											<p className='title'>{item.title}</p>
											<p className='sub-title'>{item.subTitle}</p>
										</div>
										<div className='step-number' onClick={e => handleChangeStep(index + 1)}>
											<i>
												<FontAwesomeIcon icon={item.icon} />
											</i>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className='scrollable-container'>
						<div className='container-content'>
							<h5 className='container-content-title'>
								Krok {activeStep}: {progressItems[activeStep - 1].title}
							</h5>
							<motion.div
								key={activeStep}
								initial={{ opacity: 0, y: '-100%' }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: '100%' }}
								transition={{ duration: 0.5 }}>
								{getCurrentStepComponent()}{' '}
								{/* Wyświetl odpowiedni komponent dla aktualnego kroku */}
							</motion.div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default CreateAnnouncement
