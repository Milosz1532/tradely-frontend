import React, { useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '../../assets/styles/CreateAnnouncement.scss'

const CreateAnnouncement = () => {
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
								<div className='progress-item completed'>
									<div className='description'>
										<div className='description'>
											<p className='title'>Co chcesz sprzedać?</p>
											<p className='sub-title'>Tutaj decydujesz co chcesz sprzedać</p>
										</div>
									</div>
									<div className='step-number'>
										<i>
											<FontAwesomeIcon icon='fa-regular fa-file' />
										</i>
									</div>
								</div>
								<div className='progress-item active'>
									<div className='description'>
										<p className='title'>Galeria zdjęć</p>
										<p className='sub-title'>
											Tutaj możesz dodać zdjecia i opis do swojego ogłoszenia
										</p>
									</div>
									<div className='step-number'>
										<i>
											<FontAwesomeIcon icon='fa-solid fa-images' />
										</i>
									</div>
								</div>
								<div className='progress-item'>
									<div className='description'>
										<p className='title'>Twoja wycena</p>
										<p className='sub-title'>
											To ty decydujesz ile chcesz zarobić na swoim przedmiocie
										</p>
									</div>
									<div className='step-number'>
										<i>
											<FontAwesomeIcon icon='fa-solid fa-coins' />
										</i>
									</div>
								</div>
								<div className='progress-item'>
									<div className='description'>Podsumowanie</div>
									<div className='step-number'>
										<i>
											<FontAwesomeIcon icon='fa-regular fa-circle-check' />
										</i>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='scrollable-container'>
						<div className='container-content'>
							<h5 className='container-content-title'>Krok 1: Przedmiot sprzedaży</h5>

							<p>
								Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae, excepturi?
								Adipisci deserunt, quibusdam possimus excepturi commodi laborum mollitia quidem,
								saepe necessitatibus quos pariatur nulla aut dolorum modi tenetur nostrum doloribus.
								Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae, excepturi?
								Adipisci deserunt, quibusdam possimus excepturi commodi laborum mollitia quidem,
								saepe necessitatibus quos pariatur nulla aut dolorum modi tenetur nostrum
								doloribus.Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae,
								excepturi? Adipisci deserunt, quibusdam possimus excepturi commodi laborum mollitia
								quidem, saepe necessitatibus quos pariatur nulla aut dolorum modi tenetur nostrum
								doloribus.Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae,
								excepturi? Adipisci deserunt, quibusdam possimus excepturi commodi laborum mollitia
								quidem, saepe necessitatibus quos pariatur nulla aut dolorum modi tenetur nostrum
								doloribus.Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae,
								excepturi? Adipisci deserunt, quibusdam possimus excepturi commodi laborum mollitia
								quidem, saepe necessitatibus quos pariatur nulla aut dolorum modi tenetur nostrum
								doloribus.Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae,
								excepturi? Adipisci deserunt, quibusdam possimus excepturi commodi laborum mollitia
								quidem, saepe necessitatibus quos pariatur nulla aut dolorum modi tenetur nostrum
								doloribus.Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae,
								excepturi? Adipisci deserunt, quibusdam possimus excepturi commodi laborum mollitia
								quidem, saepe necessitatibus quos pariatur nulla aut dolorum modi tenetur nostrum
								doloribus.
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default CreateAnnouncement
