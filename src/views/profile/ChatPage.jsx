import React, { useState, useEffect, useRef } from 'react'
import { getConversations, getMessages, sendMessage } from '../../services/Api'
import { useSelector } from 'react-redux'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import Cookies from 'js-cookie'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import noImages from '/images/no-image.png'
import defaultUserIcon from '/images/user.png'

const formatDate = date => {
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()
	return `${day}.${month}.${year}`
}

const isSameDay = (date1, date2) => {
	const day1 = date1.getDate()
	const month1 = date1.getMonth()
	const year1 = date1.getFullYear()

	const day2 = date2.getDate()
	const month2 = date2.getMonth()
	const year2 = date2.getFullYear()

	return day1 === day2 && month1 === month2 && year1 === year2
}

export default function ChatPage() {
	const [conversations, setConversations] = useState([])
	const [selectedConversation, setSelectedConversation] = useState(null)
	const [messages, setMessages] = useState([])
	const [newMessage, setNewMessage] = useState('')
	const user = useSelector(state => state.auth.user)
	const messagesContainerRef = useRef(null)

	useEffect(() => {}, [selectedConversation, user.id])

	useEffect(() => {
		// Tworzenie instancji Echo tylko przy wejściu na stronę czatu
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
				if (selectedConversation && e.data.conversation_id === selectedConversation.id) {
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
	}, [user.id])

	useEffect(() => {
		fetchConversations()
	}, [])

	const fetchConversations = async () => {
		try {
			const response = await getConversations()
			console.log(response.conversations)
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
		console.log(selectedConversation)
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
									alt='Zdjęcie użytkownika'
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
					<div className='chat-content-messages' ref={messagesContainerRef}>
						{messages.map((message, index) => {
							const previousMessage = messages[index - 1]
							const showSenderInfo = !previousMessage || previousMessage.user_id !== message.user_id
							const showDate =
								!previousMessage ||
								!isSameDay(new Date(previousMessage.created_at), new Date(message.created_at))

							return (
								<div className='d-block message' key={`messanger-chat-${message.id}`}>
									{showDate && (
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
