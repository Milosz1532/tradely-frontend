import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { removeUnreadConversation } from '../../redux/actions/authActions'
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

import MessagesList from '../../components/Chat/MessagesList'
import ConversationsList from '../../components/Chat/ConversationsList'

export default function ChatPage() {
	const { announcement_id, conversation_number } = useParams()
	const navigate = useNavigate()

	const [conversations, setConversations] = useState([])
	const [newConversation, setNewConversation] = useState(false)
	const [sortedConversations, setSortedConversations] = useState([])
	const [selectedConversation, setSelectedConversation] = useState(null)
	const [messages, setMessages] = useState([])
	const [newMessage, setNewMessage] = useState('')
	const [loadingConversations, setLoadingConversations] = useState(true)
	const [loadingMessages, setLoadingMessages] = useState(true)
	const user = useSelector(state => state.auth.user)
	const messagesContainerRef = useRef(null)
	const selectedConversationRef = useRef(null)
	const conversationIdRef = useRef(null)
	const [isAuthoring, setIsAuthoring] = useState(true)
	const isTabletOrMobile = useSelector(state => state.device.isTabletOrMobile)

	const dispatch = useDispatch()

	useEffect(() => {
		const fetchAnnouncement = async () => {
			if (announcement_id && announcement_id > 0) {
				try {
					const response = await getNewConversationData(announcement_id)
					console.log(response)
					setNewConversation(response.data)

					if (response.status === 202) {
						handleConversationClick(response.data)
						setNewConversation(null)
						navigate('/account/chat')
					}

					if (response.error) {
						setNewConversation(null)
						navigate('/account/chat')
					}
				} catch (error) {
					console.error(error)
					setNewConversation(null)
					navigate('/account/chat')
				}
			}
		}

		fetchAnnouncement()
	}, [announcement_id, navigate])

	useEffect(() => {
		if (conversation_number) {
			const conversation = conversations.find(convo => convo.id == conversation_number)

			if (conversation) {
				handleConversationClick(conversation)
				console.log(`Zmieniam`)
			}
		}
	}, [conversation_number, conversations])

	useEffect(() => {
		selectedConversationRef.current = selectedConversation
	}, [selectedConversation])

	useEffect(() => {
		fetchConversations()

		const echo = new Echo({
			broadcaster: 'pusher',
			cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
			key: import.meta.env.VITE_PUSHER_APP_KEY,
			// wsHost: window.location.hostname,
			wsHost: import.meta.env.VITE_PUSHER_APP_HOST,
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
					conversationIdRef.current = e.data.conversation_id

					updateConversationLatestMessage(e.data.conversation_id, {
						id: e.data.id,
						content: e.data.content,
						created_at: e.data.created_at,
						user_id: e.data.user_id,
						status: 1,
					})
					handleSetMessageAsDelivered(e.data.id)
				}
			})

			echo.private(`messanger_user.${user.id}`).listen('MessageDelivered', e => {
				const messageId = e.messageId

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

		return () => {
			echo.disconnect()
		}
	}, [])

	useEffect(() => {
		if (conversations.length > 0 && conversationIdRef.current) {
			const hasConversationInState = conversations.find(c => c.id === conversationIdRef.current)
			if (!hasConversationInState) {
				// fetchConversations()
				conversationIdRef.current.remove()
			}
		}

		if (conversations.length > 0) {
			const sortedConversations = conversations.sort((a, b) => {
				const aLatestMessage = a.latest_message
				const bLatestMessage = b.latest_message

				if (!aLatestMessage) return -1
				if (!bLatestMessage) return 1

				const aDate = new Date(aLatestMessage.created_at)
				const bDate = new Date(bLatestMessage.created_at)

				return bDate - aDate
			})
			setSortedConversations(sortedConversations)
		}
	}, [conversations])

	const fetchConversations = async () => {
		try {
			setLoadingConversations(true)
			const response = await getConversations()

			setConversations(response.conversations)

			setLoadingConversations(false)
		} catch (error) {
			console.error(error)
			setLoadingConversations(false)
		}
	}

	const fetchMessages = async conversationId => {
		try {
			setLoadingMessages(true)
			const response = await getMessages(conversationId)
			setMessages(response.messages)
			setConversations(prevConversations =>
				prevConversations.map(conversation => {
					if (conversation.id === conversationId) {
						const latestMessage = conversation.latest_message
						if (latestMessage) {
							return {
								...conversation,
								latest_message: {
									...latestMessage,
									status: 3,
								},
							}
						}
					}
					return conversation
				})
			)
			setSelectedConversation(prevState => ({
				...prevState,
				user_last_activity: response.user_last_activity,
			}))

			dispatch(removeUnreadConversation(conversationId))
		} catch (error) {
			console.error(error)
		} finally {
			setLoadingMessages(false)
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
				setLoadingMessages(false)
				setNewMessage('')
			} catch (error) {
				console.error(error)
			}
		} else {
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
		if (newConversation) {
			setNewConversation(false)
			navigate('/account/chat')
		}
		if (selectedConversation) {
			if (selectedConversation.id === conversation.id) return
		}
		setSelectedConversation(conversation)
		fetchMessages(conversation.id)
	}

	useEffect(() => {
		const lastChildElement = messagesContainerRef.current?.lastElementChild
		lastChildElement?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const handleGoBack = () => {
		setSelectedConversation(null)
		navigate('/account/chat')
	}

	return (
		<div className='container ' style={{ minHeight: '80vh' }}>
			<div className='row mt-3'>
				{isTabletOrMobile && (
					<>
						{!newConversation && !selectedConversation && (
							<ConversationsList
								sortedConversations={sortedConversations}
								selectedConversation={selectedConversation}
								isAuthoring={isAuthoring}
								user={user}
								loadingConversations={loadingConversations}
								setIsAuthoring={setIsAuthoring}
							/>
						)}
						{(newConversation || selectedConversation) && (
							<MessagesList
								newConversation={newConversation}
								selectedConversation={selectedConversation}
								loadingMessages={loadingMessages}
								messages={messages}
								newMessage={newMessage}
								setNewMessage={setNewMessage}
								messagesContainerRef={messagesContainerRef}
								handleSendMessage={handleSendMessage}
								user={user}
								handleGoBack={handleGoBack}
							/>
						)}
					</>
				)}

				{!isTabletOrMobile && (
					<>
						<ConversationsList
							sortedConversations={sortedConversations}
							selectedConversation={selectedConversation}
							isAuthoring={isAuthoring}
							user={user}
							loadingConversations={loadingConversations}
							setIsAuthoring={setIsAuthoring}
						/>

						<MessagesList
							newConversation={newConversation}
							selectedConversation={selectedConversation}
							loadingMessages={loadingMessages}
							messages={messages}
							newMessage={newMessage}
							setNewMessage={setNewMessage}
							messagesContainerRef={messagesContainerRef}
							handleSendMessage={handleSendMessage}
							user={user}
						/>
					</>
				)}
			</div>
		</div>
	)
}
