import React from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet'

const CityMarker = ({ position }) => {
	return <Circle center={position} radius={2500} />
}

const Map = ({ city = null, latitude, longitude }) => {
	const cityPosition = [latitude, longitude]

	if (!cityPosition) {
		return <p>City not found</p>
	}

	return (
		<div>
			<MapContainer center={cityPosition} zoom={11} scrollWheelZoom={false}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				<CityMarker position={cityPosition} />
			</MapContainer>
		</div>
	)
}

export default Map
