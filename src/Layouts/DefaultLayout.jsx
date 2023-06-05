import React, { useEffect } from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTop from '../ScrollToTop'

export default function DefaultLayout() {
	return (
		<div id='defaultLayout'>
			<Navbar />
			<div className='content'>
				<Outlet />
			</div>
			<Footer />
			<ScrollToTop />
		</div>
	)
}
