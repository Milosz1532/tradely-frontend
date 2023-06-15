import React from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, useMap, Marker, Circle, Pane } from 'react-leaflet'

const CityMarker = ({ position, name }) => {
	const map = useMap()
	map.setView(position, map.getZoom())

	return (
		// <Marker position={position}>
		// 	<Circle center={position} radius={2500} />
		// </Marker>
		<Circle center={position} radius={2500} />
	)
}

const NotFound = () => {
	return <p>City not found</p>
}

const Map = ({ city = null }) => {
	const [cityPosition, setCityPosition] = React.useState(null)
	const [isLoading, setIsLoading] = React.useState(true)
	const cityName = city

	if (city == null) {
		return <NotFound />
	}

	React.useEffect(() => {
		const geocodeCity = async () => {
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
						cityName
					)}&format=json&limit=1`
				)

				const data = await response.json()

				if (data.length > 0) {
					const { lat, lon } = data[0]
					setCityPosition([parseFloat(lat), parseFloat(lon)])
					console.log(`LAT: ${lat} LON: ${lon}`)
				}
			} catch (error) {
				console.log('Błąd geokodowania:', error)
			} finally {
				setIsLoading(false)
			}
		}

		geocodeCity()
	}, [cityName])

	console.log(cityPosition)

	return (
		<>
			{isLoading && <div>Szukam lokalizacji...</div>}
			{!isLoading && !cityPosition && <NotFound />}
			{!isLoading && cityPosition && (
				<MapContainer center={cityPosition} zoom={11} scrollWheelZoom={false}>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					/>
					<CityMarker position={cityPosition} name={cityName} />
				</MapContainer>
			)}
		</>
	)
}

export default Map
