import React from 'react'
import noImages from '/images/no-image.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ConversationElement({
	id,
	image,
	title,
	price,
	latest_message,
	selected,
	user,
	newMessage,
}) {
	return (
		<div className='col-12 pt-2'>
			<div
				className={`conversation-element  ${newMessage ? 'new-message' : ''} ${
					selected ? 'selected' : 'cursor-pointer'
				}`}>
				<div className='conversation-image'>
					<img src={image || noImages} alt='zdjęcie ogłoszenia' />
				</div>
				<div className='conversation-content ms-2'>
					<p className='text-md m-0'>
						<b>{title}</b>
					</p>
					<p className='text-md m-0 color-main'>{price}</p>
					{latest_message && (
						<p className={`text-xs color-gray ${newMessage ? 'font-weight-bold' : ''}`}>
							{`${latest_message?.user_id === user?.id ? 'Ty' : 'Członek konwersacji'}: ${
								latest_message?.content.slice(0, 10) +
								(latest_message?.content.length > 10 ? '...' : '')
							}`}
						</p>
					)}
				</div>
			</div>
		</div>
	)
}
