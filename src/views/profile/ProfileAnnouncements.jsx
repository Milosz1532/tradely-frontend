import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
	RectangularAnnouncement,
	RectangularAnnouncementLoading,
} from '../../components/RectangularAnnouncement'

import TabControl from '../../components/TabControl'

export default function ProfileAnnouncements() {
	const [toggleState, setToggleState] = useState(1)

	const toggleTab = index => {
		setToggleState(index)
	}
	return (
		<div className='container-fluid'>
			<div className='row'>
				<h5 className='tab-title'>Moje ogłoszenia</h5>
				<article className='account-box'>
					<TabControl>
						<div title='Aktywne ogłoszenia'>
							<h3>Twoje aktywne ogłoszenia</h3>
							<hr />
							<div className='container-fluid'>
								<RectangularAnnouncement
									id={1}
									image={null}
									title={'test'}
									price={123}
									created_at={'null'}
									tags={[]}
									edit={true}
								/>
								<hr />
								<RectangularAnnouncement
									id={1}
									image={null}
									title={'test'}
									price={123}
									created_at={'null'}
									tags={[]}
									edit={true}
								/>
							</div>
						</div>
						<div title='Oczekujące ogłoszenia'>
							<h3>Twoje oczekujące ogłoszenia</h3>

							<hr />
							<p>Oczekujące ogłoszenia - Lorem ipsum dolor sit amet.</p>
						</div>
						<div title='Zakończone ogłoszenia'>
							<h3>Twoje zakończone ogłoszenia</h3>

							<hr />
							<p>Zakończone ogłoszenia - Lorem ipsum dolor sit amet.</p>
						</div>
					</TabControl>
				</article>
			</div>
		</div>
	)
}
