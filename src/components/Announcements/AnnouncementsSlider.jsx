import React from 'react'
import { SquareAnnouncement } from './SquareAnnouncement'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

export default function AnnouncementsSlider({ data }) {
	// const breakpoints = {
	// 	320: {
	// 		slidesPerView: 1,
	// 	},
	// 	480: {
	// 		slidesPerView: 2,
	// 	},
	// 	768: {
	// 		slidesPerView: 3,
	// 	},
	// 	1024: {
	// 		slidesPerView: 5,
	// 	},
	// }

	// return (
	// 	<Swiper
	// 		spaceBetween={100}
	// 		breakpoints={breakpoints}
	// 		onSlideChange={() => console.log('slide change')}
	// 		onSwiper={swiper => console.log(swiper)}>
	// 		{data.map(a => (
	// 			<SwiperSlide key={a.id}>
	// 				<SquareAnnouncement
	// 					id={a.id}
	// 					user_id={a.user_id}
	// 					title={a.title}
	// 					price={a.price}
	// 					price_type={a.price_type}
	// 					created_at={a.created_at}
	// 					image={a.first_image}
	// 					location={a.location}
	// 					category={a.category}
	// 					favorite_count={a.favorite_count}
	// 					is_favorited={a.is_favorited}
	// 					item={a}
	// 				/>
	// 			</SwiperSlide>
	// 		))}
	// 	</Swiper>
	// )
	return true
}
