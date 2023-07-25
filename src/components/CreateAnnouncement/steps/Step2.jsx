import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ReactLoading from 'react-loading'
import { useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const EmptyImageUploader = ({ addImage }) => {
	const fileInput = useRef()

	const handleClick = () => {
		fileInput.current.click()
	}

	const handleChange = ({ target: { files } }) => {
		if (files) {
			for (let index = 0; index < files.length; index++) {
				addImage(files[index])
			}
		}
	}

	return (
		<div className='col-md-3 mt-3'>
			<div className='create-announcement-image-box' onClick={handleClick}>
				<div className='create-announcement-image-box-content'>
					<i>
						<FontAwesomeIcon icon='plus' />
					</i>
					<p>Dodaj zdjęcie</p>
					<input
						ref={fileInput}
						type='file'
						accept='image/*'
						multiple
						hidden
						onChange={handleChange}
					/>
				</div>
			</div>
		</div>
	)
}

const ImageUploader = ({ image, onDelete, index, moveImage }) => {
	const [loading, setLoading] = useState(true)
	const ref = useRef(null)

	const [, drop] = useDrop({
		accept: 'ImageUploader',
		hover(item, monitor) {
			if (!ref.current) {
				return
			}
			const dragIndex = item.index
			const hoverIndex = index
			if (dragIndex === hoverIndex) {
				return
			}
			moveImage(dragIndex, hoverIndex)
			item.index = hoverIndex
		},
	})

	const [{ isDragging }, drag] = useDrag({
		type: 'ImageUploader',
		item: { id: image.id, index },
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	})

	const handleImageClick = () => {
		onDelete()
	}

	const handleImageLoad = () => {
		setLoading(false)
	}

	drag(drop(ref))

	return (
		<div ref={ref} className={`col-md-3 mt-3 `}>
			<div className={`create-announcement-image-box ${isDragging ? 'dragging' : ''}`}>
				{(index === 0 && !isDragging) && (
					<div className='main-image-box'>
						<span>Główne zdjęie</span>
					</div>
				)}
				<div className='create-announcement-image-box-content'>
					{image ? (
						<div className='image-preview'>
							{loading && <LoadingImage />}
							<>
								<img
									className={loading ? 'loading-image' : ''}
									src={image}
									alt='preview'
									onLoad={handleImageLoad}
									draggable={false}
									onError={null}
								/>
								<div className='image-overlay'>
									<i onClick={handleImageClick}>
										<FontAwesomeIcon icon='trash-alt' />
									</i>
								</div>
							</>
						</div>
					) : (
						<>
							<i>
								<FontAwesomeIcon icon='camera-retro' />
							</i>
							<p>Brak zdjęcia</p>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

const LoadingImage = () => (
	<div className='d-flex flex-column justify-content-center align-items-center '>
		<ReactLoading type={'bubbles'} color={'#00A2FF'} width={'100px'} />
		<p>Wczytywanie</p>
	</div>
)

const Step2 = ({ images, setImages, IMAGES_LIMIT }) => {
	const addImage = file => {
		setImages(prevImages => {
			if (prevImages.length < IMAGES_LIMIT) {
				const newImage = {
					id: prevImages.length + 1,
					file: URL.createObjectURL(file),
				}
				return [...prevImages, newImage]
			} else {
				return prevImages
			}
		})
	}

	const deleteImage = id => {
		setImages(prevImages => prevImages.filter(image => image.id !== id))
	}

	const moveImage = (fromIndex, toIndex) => {
		const newImages = [...images]
		const [movedImage] = newImages.splice(fromIndex, 1)
		newImages.splice(toIndex, 0, movedImage)
		setImages(newImages)
	}

	return (
		<>
			<article>
				<span>
					Możesz ustawić kolejnosć wyświetlanych zdjęc przeciągając je między sobą. Pierwsze zdjęcie
					będzie zdjęciem głównym twojego ogłoszenia.
				</span>
				<div className='row'>
					{images.length > 0 && (
						<DndProvider backend={HTML5Backend}>
							{images.map((image, index) => (
								<ImageUploader
									key={image.id}
									image={image.file}
									onDelete={() => deleteImage(image.id)}
									index={index}
									moveImage={moveImage}
								/>
							))}
						</DndProvider>
					)}
					<EmptyImageUploader addImage={addImage} />
				</div>
				<span className='create-announcement-images-count d-flex justify-content-end me-2 mt-2'>
					<i className='me-2'>
						<FontAwesomeIcon icon='camera-retro' />
					</i>
					{images.length} / {IMAGES_LIMIT}
				</span>
			</article>
		</>
	)
}

export default Step2
