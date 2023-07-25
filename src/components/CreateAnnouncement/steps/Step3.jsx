import React, { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const Step3 = ({ description, setDescription, tagsArray, setTagsArray, tagInput, setTagInput }) => {
	// DESCRIPTION:

	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'], // toggled buttons

		[{ header: 1 }, { header: 2 }], // custom button values
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ indent: '-1' }, { indent: '+1' }], // outdent/indent

		[{ size: ['small', false, 'large'] }], // custom dropdown

		[{ color: [] }, { background: [] }], // dropdown with defaults from theme
		[{ align: [] }],

		['clean'], // remove formatting button
	]
	const module = {
		toolbar: toolbarOptions,
	}

	// TAGS
	const tagsInput = useRef()

	const handleChangeTagInput = e => {
		if (tagsArray.length >= 5) return
		setTagInput(e.target.value)
	}

	const handleKeyDown = e => {
		if (e.key === 'Enter') {
			e.preventDefault()
			if (tagInput.trim() !== '') {
				setTagsArray([...tagsArray, { id: tagsArray.length++, name: tagInput }])
				setTagInput('')
			}
		}
	}

	const handleTagRemove = tagId => {
		const updatedTagsArray = tagsArray.filter(tag => tag.id !== tagId)
		setTagsArray(updatedTagsArray)
	}

	const quillText = useRef(null)

	return (
		<>
			<div className='row'>
				<div className='col-md-12 '>
					<div className='form-input'>
						<label className='required' htmlFor='title'>
							Opis ogłoszenia
						</label>

						<ReactQuill
							// style={{ maxHeight: '500px', overflow: 'scroll' }}
							className='quill'
							theme='snow'
							modules={module}
							value={description}
							onChange={setDescription}
							ref={quillText}
						/>
						<span className='text-end mt-1'>
							{' '}
							{quillText?.current?.selection?.index || 0} / 5000
						</span>
					</div>
				</div>
				<div className='mt-3'>
					<div className='tag-input-title'>
						<p className='title'>Tagi</p>

						<span className='tag-info'>
							{tagsArray.length >= 5 && 'Możesz dodać maksymalnie 5 tagów'}
							{tagInput && `Zatwierdź tag klikając Enter`}
						</span>
					</div>

					<div className='tag-container mb-3'>
						{tagsArray.map(tag => (
							<div key={tag.id} className='tag'>
								<i onClick={() => handleTagRemove(tag.id)}>
									<FontAwesomeIcon icon='fa-regular fa-circle-xmark' />
								</i>
								<span>{tag.name}</span>
							</div>
						))}

						<input
							type='text'
							ref={tagsInput}
							value={tagInput}
							onChange={handleChangeTagInput}
							onKeyDown={handleKeyDown}
							placeholder={tagsArray.length > 0 ? '' : 'np. Gwarancja'}
						/>
					</div>
				</div>
			</div>
		</>
	)
}
export default Step3
