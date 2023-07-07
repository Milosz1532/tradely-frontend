import React, { useState, useEffect } from 'react'
import noImages from '/images/no-image.png'
import { getConversations, getMessages, sendMessage } from '../../services/Api'
import { useSelector, useDispatch } from 'react-redux'

import '../../services/Chat'

export default function ChatPage() {
	const [conversations, setConversations] = useState([])
	const [selectedConversation, setSelectedConversation] = useState(null)
	const [messages, setMessages] = useState([])
	const [newMessage, setNewMessage] = useState('')
	const user = useSelector(state => state.auth.user)
	useEffect(() => {
		// const channel = window.Echo.join(`messanger_user.${user.id}`)

		// channel.listen('MessageSent', e => {
		// 	console.log(e)
		// 	console.log(`Nowa Wiadomość`)
		// })

		Echo.private(`messanger_user.${user.id}`).listen('MessageSent', e => {
			console.log(`Nowa wiadomość`)
		})
	}, [])

	useEffect(() => {
		fetchConversations()
	}, [])

	const fetchConversations = async () => {
		try {
			const response = await getConversations()
			console.log(response)
			setConversations(response.conversations)
		} catch (error) {
			console.error(error)
		}
	}

	const fetchMessages = async conversationId => {
		try {
			const response = await getMessages(conversationId)
			setMessages(response.messages)
		} catch (error) {
			console.error(error)
		}
	}

	const handleSendMessage = async () => {
		if (!newMessage.trim()) return
		try {
			const data = {
				conversation_id: selectedConversation.id,
				content: newMessage,
			}
			const response = await sendMessage(data)
			console.log(response)
		} catch (error) {
			console.error(error)
		}
	}

	const handleConversationClick = conversation => {
		setSelectedConversation(conversation)
		fetchMessages(conversation.id)
	}

	return (
		<div className='chatPage-container'>
			<div className='chat-menu'>
				<ul className='chat-menu-list'>
					{conversations.map(conversation => (
						<li key={conversation.id} onClick={() => handleConversationClick(conversation)}>
							<div className='chat-menu-item'>
								<img src={noImages} alt='Zdjęcie użytkownika' />
								<div className='chat-menu-item-content'>
									<p className='title'>{conversation.title}</p>
									<p className='content'>{`Ty: ${conversation.latest_message?.content}`}</p>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
			{selectedConversation && (
				<div className='chat-content'>
					<div className='chat-content-messages'>
						{messages.map(message => (
							<p key={message.id}>{message.content}</p>
						))}
					</div>
					<div className='chat-content-bottom'>
						<input
							type='text'
							className='w-100'
							value={newMessage}
							onChange={e => setNewMessage(e.target.value)}
						/>
						<button className='w-100' onClick={handleSendMessage}>
							Wyślij
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

// Echo.channel(`messanger`).listen('MessageSent', e => {
// 	console.log(e.message)
// })
// Echo.join(`messanger_chat`)
// 	.here(users => {
// 		//
// 		console.log(users)
// 	})
// 	.joining(user => {
// 		console.log(`Połączono`)
// 	})
// 	.leaving(user => {
// 		console.log(`Rozłączono`)
// 	})
// 	.listen('GroupChatMessage', e => {
// 		// console.log(e.message)
// 		console.log(e)
// 		// console.log(`Wiadomość`)
// 	})
// 	.error(error => {
// 		console.log(error)
// 	})
