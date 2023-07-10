import React, { useState, useEffect, useRef } from 'react'
import { getConversations, getMessages, sendMessage } from '../../services/Api'
import { useSelector } from 'react-redux'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import Cookies from 'js-cookie'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import noImages from '/images/no-image.png'
import defaultUserIcon from '/images/user.png'

const formatDate = (date, small) => {
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')

	if (small) {
		const sec = String(date.getSeconds()).padStart(2, '0')
		return `${hours}:${minutes}:${sec}`
	}
	return `${day}.${month}.${year} ${hours}:${minutes}`
}

const isHourApart = (date1, date2) => {
	let diff = (date2.getTime() - date1.getTime()) / 1000
	diff /= 60 * 60
	console.log(Math.abs(Math.round(diff)))
	return Math.abs(Math.round(diff))
}

export default function ChatPage() {
	const [conversations, setConversations] = useState([])
	const [selectedConversation, setSelectedConversation] = useState(null)
	const [messages, setMessages] = useState([])
	const [newMessage, setNewMessage] = useState('')
	const user = useSelector(state => state.auth.user)
	const messagesContainerRef = useRef(null)

	const selectedConversationRef = useRef(null)

	useEffect(() => {
		selectedConversationRef.current = selectedConversation
	}, [selectedConversation])

	useEffect(() => {
		const echo = new Echo({
			broadcaster: 'pusher',
			cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
			key: import.meta.env.VITE_PUSHER_APP_KEY,
			wsHost: window.location.hostname,
			wsPort: 6001,
			forceTLS: false,
			disableStats: true,
			enabledTransports: ['ws', 'wss'],
			authEndpoint: import.meta.env.VITE_API_BASE_URL + '/broadcasting/auth',
			auth: {
				headers: {
					Authorization: `Bearer ${Cookies.get('ACCESS_TOKEN')}`,
				},
			},
		})

		// Nasłuchiwanie wiadomości
		const listenForMessages = () => {
			echo.private(`messanger_user.${user.id}`).listen('MessageSent', e => {
				console.log(selectedConversationRef.current)
				console.log(`e.data.conversation_id = ${e.data.conversation_id}`)
				if (
					selectedConversationRef.current &&
					e.data.conversation_id === selectedConversationRef.current.id
				) {
					const pushMessage = {
						id: e.data.id,
						content: e.data.content,
						created_at: e.data.created_at,
						user_id: e.data.user_id,
					}
					console.log(`1`)
					setMessages(prevMessages => [...prevMessages, pushMessage])
					console.log(messages)
					updateConversationLatestMessage(selectedConversation.id, pushMessage)
				} else {
					console.log(`2`)
					updateConversationLatestMessage(e.data.conversation_id, {
						id: e.data.id,
						content: e.data.content,
						created_at: e.data.created_at,
						user_id: e.data.user_id,
					})
				}
			})
		}

		listenForMessages()
		console.log(`Połączono`)

		return () => {
			echo.disconnect() // Odłączanie Echo
			console.log(`Rozłączono`)
		}
	}, [])

	useEffect(() => {
		fetchConversations()
	}, [])

	const fetchConversations = async () => {
		try {
			const response = await getConversations()
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

	const handleSendMessage = async e => {
		e.preventDefault()
		if (!newMessage.trim()) return
		try {
			const data = {
				conversation_id: selectedConversation.id,
				content: newMessage,
			}
			const response = await sendMessage(data)

			const pushMessage = {
				id: response.id,
				content: response.content,
				created_at: response.created_at,
				user_id: response.user_id,
			}

			setMessages(prevMessages => [...prevMessages, pushMessage])
			setNewMessage('')

			updateConversationLatestMessage(selectedConversation.id, pushMessage)
		} catch (error) {
			console.error(error)
		}
	}

	const updateConversationLatestMessage = (conversationId, message) => {
		setConversations(prevConversations =>
			prevConversations.map(conversation => {
				if (conversation.id === conversationId) {
					return {
						...conversation,
						latest_message: message,
					}
				}
				return conversation
			})
		)
	}

	const handleConversationClick = conversation => {
		setSelectedConversation(conversation)
		console.log(conversation)
		fetchMessages(conversation.id)
	}

	useEffect(() => {
		const lastChildElement = messagesContainerRef.current?.lastElementChild
		lastChildElement?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const isMessageSentByUser = message => {
		return message.user_id === user.id
	}

	return (
		<div className='chatPage-container'>
			<div className='chat-menu'>
				<ul className='chat-menu-list'>
					{conversations.map(conversation => (
						<li key={conversation.id} onClick={() => handleConversationClick(conversation)}>
							<div
								className={`chat-menu-item ${
									selectedConversation?.id === conversation.id ? 'selected' : ''
								}`}>
								<img
									src={
										conversation.announcement_first_image
											? conversation.announcement_first_image
											: noImages
									}
									alt='Zdjęcie ogłoszenia'
									draggable={false}
								/>
								<div className='chat-menu-item-content'>
									<p className='title'>{conversation.announcement_title}</p>
									<p className='content'>{`${
										conversation?.latest_message?.user_id === user?.id ? 'Ty' : 'Sprzedający'
									}: ${conversation.latest_message?.content}`}</p>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
			{selectedConversation && (
				<div className='chat-content'>
					<div className='chat-content-top'>
						<div className='chat-content-top-content'>
							<div>
								<p className='title'>{selectedConversation.announcement_title}</p>
								<div className='user-active'>
									<span className='user-active-dot'> </span>
									<p>Ostatnio aktywny: 10 minut temu</p>
								</div>
							</div>
							<p className='price'>3000 zł</p>
						</div>
					</div>
					<div className='chat-content-messages' ref={messagesContainerRef}>
						{messages.map((message, index) => {
							const previousMessage = messages[index - 1]
							const showSenderInfo = !previousMessage || previousMessage.user_id !== message.user_id
							const showDate =
								previousMessage &&
								isHourApart(new Date(previousMessage.created_at), new Date(message.created_at))

							return (
								<div className='d-block message' key={`messanger-chat-${message.id}`}>
									{showDate > 0 && (
										<div className='message-date'>{formatDate(new Date(message.created_at))}</div>
									)}

									<div
										className={`message-area ${
											isMessageSentByUser(message) ? 'sent' : 'received'
										}`}>
										{showSenderInfo && (
											<p className='message-user'>
												{isMessageSentByUser(message) ? 'Ty' : 'Sprzedający'}
											</p>
										)}
										<div className='message-content'>
											<p>{message.content}</p>
										</div>

										<div className='message-small-date'>
											<span>{formatDate(new Date(message.created_at), true)}</span>
										</div>
									</div>
								</div>
							)
						})}
					</div>

					<div className='chat-content-bottom'>
						<hr className='my-2' />
						<form onSubmit={handleSendMessage}>
							<input
								placeholder='Twoja wiadomość...'
								type='text'
								value={newMessage}
								onChange={e => setNewMessage(e.target.value)}
							/>

							<button>
								<i>
									<FontAwesomeIcon icon='fa-regular fa-paper-plane' />
								</i>
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}
