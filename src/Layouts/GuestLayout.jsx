import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function GuestLayout() {

	return (
		<div>
			<Outlet />
		</div>
	)
}
