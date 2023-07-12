import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
	getConversations,
	getMessages,
	sendMessage,
	markMessageAsRead,
	markMessageAsDelivered,
	getNewConversationData,
	createNewConversation,
} from '../../services/Api'
import { useSelector } from 'react-redux'
import Pusher from 'pusher-js'

import Echo from 'laravel-echo'
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
	return Math.abs(Math.round(diff))
}

export default function ChatPage() {
	const { announcement_id } = useParams()
	const navigate = useNavigate()

	const [conversations, setConversations] = useState([])
	const [newConversation, setNewConversation] = useState(false)
	const [selectedConversation, setSelectedConversation] = useState(null)
	const [messages, setMessages] = useState([])
	const [newMessage, setNewMessage] = useState('')
	const user = useSelector(state => state.auth.user)
	const messagesContainerRef = useRef(null)

	const selectedConversationRef = useRef(null)
	useEffect(() => {
		if (!announcement_id) {
			navigate('/account/chat')
			return
		}
		const fetchAnnouncement = async () => {
			if (announcement_id) {
				try {
					const response = await getNewConversationData(announcement_id)
					setNewConversation(response.data)
					if (response.status === 202) {
						handleConversationClick(response.data)
						setNewConversation(false)
						navigate('/account/chat')
					}
					if (response.error) {
						setNewConversation(false)
						navigate('/account/chat')
					}
				} catch (error) {
					console.error(error)
				}
			}
		}

		fetchAnnouncement()
	}, [announcement_id])

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
					setMessages(prevMessages => [...prevMessages, pushMessage])
					updateConversationLatestMessage(selectedConversationRef.current.id, pushMessage)
					handleSetMessageAsRead(e.data.id)
				} else {
					const hasConversationInState = conversations.some(
						conversation => conversation.id === e.data.conversation_id
					)
					if (!hasConversationInState) {
						fetchConversations()
					}

					updateConversationLatestMessage(e.data.conversation_id, {
						id: e.data.id,
						content: e.data.content,
						created_at: e.data.created_at,
						user_id: e.data.user_id,
					})
					handleSetMessageAsDelivered(e.data.id)
				}
			})

			echo.private(`messanger_user.${user.id}`).listen('MessageDelivered', e => {
				const messageId = e.messageId
				const conversationId = e.conversationId

				setMessages(prevMessages =>
					prevMessages.map(message => {
						if (message.id === messageId) {
							return {
								...message,
								status: 2,
							}
						}
						return message
					})
				)
			})

			echo.private(`messanger_user.${user.id}`).listen('MessageRead', e => {
				const messageId = e.messageId
				const conversationId = e.conversationId

				if (Number.isInteger(messageId)) {
					setMessages(prevMessages =>
						prevMessages.map(message => {
							if (message.id === messageId) {
								return {
									...message,
									status: 3,
								}
							}
							return message
						})
					)
				} else if (messageId === 'all') {
					setMessages(prevMessages =>
						prevMessages.map(message => ({
							...message,
							status: 3,
						}))
					)
				}
			})
		}

		const handleSetMessageAsDelivered = async id => {
			await markMessageAsDelivered(id)
		}

		const handleSetMessageAsRead = async id => {
			await markMessageAsRead(id)
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

		if (newConversation) {
			try {
				const data = {
					announcement_id: newConversation.announcement.id,
					content: newMessage,
				}
				const response = await createNewConversation(data)
				setNewConversation(false)
				navigate('/account/chat')
				setSelectedConversation(response.conversation)

				const pushMessage = {
					id: response.message.id,
					content: response.message.content,
					created_at: response.message.created_at,
					user_id: response.message.user_id,
					status: 1,
				}

				setMessages([pushMessage])
				setConversations(prevConversations => [...prevConversations, response.conversation])

				setNewMessage('')

				return
			} catch {
				console.error(error)
			}
		}

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
				status: 1,
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

	const handleMarkMessageAsRead = async messageId => {
		try {
			// Oznaczanie wiadomości jako odczytanej na serwerze
			await markMessageAsRead(messageId)
		} catch (error) {
			console.error(error)
		}
	}

	const handleConversationClick = conversation => {
		setSelectedConversation(conversation)
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
								<div className='announcement-image'>
									<img
										src={
											conversation.announcement_first_image
												? conversation.announcement_first_image
												: noImages
										}
										alt='Zdjęcie ogłoszenia'
										draggable={false}
									/>
								</div>

								<div className='chat-menu-item-content'>
									<p className='title'>{conversation.announcement_title}</p>
									<p className='content'>{`${
										conversation?.latest_message?.user_id === user?.id ? 'Ty' : 'Sprzedający'
									}: ${
										conversation.latest_message?.content.slice(0, 10) +
										(conversation.latest_message?.content.length > 10 ? '...' : '')
									}`}</p>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>

			{newConversation && (
				<div className='chat-content'>
					<div className='chat-content-top'>
						<div className='chat-content-top-content'>
							<div>
								<p className='title'>{newConversation.announcement.title}</p>
								<div className='user-active'>
									<span className='user-active-dot'> </span>
									<p>Ostatnio aktywny: 10 minut temu</p>
								</div>
							</div>
							<p className='price'>3000 zł</p>
						</div>
					</div>
					<div className='chat-content-messages' ref={messagesContainerRef}></div>
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
							const nextMessage = messages[index + 1]
							const showSenderInfo = !previousMessage || previousMessage.user_id !== message.user_id
							const showStatusInfo = !nextMessage || nextMessage.user_id !== message.user_id
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
										{showStatusInfo && isMessageSentByUser(message) && (
											<i className={`message-status status-${message.status}`}>
												{message.status === 1 && (
													<>
														<FontAwesomeIcon icon='fa-regular fa-paper-plane' />
														<span>Wysłana</span>
													</>
												)}
												{message.status === 2 && (
													<>
														<FontAwesomeIcon icon='fa-solid fa-check' />
														<span>Dostarczona</span>
													</>
												)}
												{message.status === 3 && (
													<>
														<FontAwesomeIcon icon='fa-solid fa-check-double' />
														<span>Wyświetlona</span>
													</>
												)}
											</i>
										)}

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
