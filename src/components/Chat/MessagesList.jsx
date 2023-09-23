// MessagesList.js
import React from 'react'
import { NavLink } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import userIcon from '/images/user.png'
import noImages from '/images/no-image.png'
import Skeleton from 'react-loading-skeleton'

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

const MessagesList = ({
	newConversation,
	selectedConversation,
	loadingMessages,
	messages,
	newMessage,
	setNewMessage,
	messagesContainerRef,
	handleSendMessage,
	user,
	handleGoBack,
}) => {
	const isMessageSentByUser = message => {
		return message.user_id === user.id
	}
	return (
		<>
			{newConversation && (
				<div className='col-xl-7'>
					<div className='main-content-box p-0'>
						<div className='main-content-header'>
							<div className='d-flex align-items-center'>
								<div>
									<img
										src={userIcon}
										alt='Zdjęcie użytkownika'
										width={50}
										height={50}
										draggable={false}
									/>
								</div>
								<div className='ms-2'>
									<p className='m-0 '>Rafał</p>
									<p className='m-0 text-xs color-gray'>Ostatnio widziany: 2 dni temu</p>
								</div>
							</div>
						</div>
						<NavLink to={`/announcement/${newConversation.id}`} style={{ all: 'unset' }}>
							<div className='el-border-bottom p-2 d-flex align-items-center cursor-pointer '>
								<div className='chat-content-announcement-info'>
									<img
										src={newConversation?.announcement?.image || noImages}
										alt='Zdjęcie ogłoszenia'
									/>
								</div>
								<div className='ms-3 w-100'>
									<p className='m-0'>{newConversation?.announcement?.title}</p>
									<div className='d-flex justify-content-between'>
										<p className='m-0 color-main'>{newConversation?.announcement?.price}</p>
										<p className='m-0 color-gray text-xs me-2'>
											ID: {newConversation?.announcement?.id}
										</p>
									</div>
								</div>
							</div>
						</NavLink>
						<div className='chat-content-messages' ref={messagesContainerRef}></div>
						{/* <div className='chat-content-bottom'>
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
                </div> */}
						<div className='chat-content-bottom el-border-top'>
							<form onSubmit={handleSendMessage}>
								<div className='d-flex align-items-center'>
									<div className='me-2'>
										<i className='icon-lg me-3'>
											<FontAwesomeIcon icon='fa-regular fa-images' />
										</i>
										<i className='icon-lg'>
											<FontAwesomeIcon icon='fa-regular fa-file' />
										</i>
									</div>
									<input
										placeholder='Twoja wiadomość...'
										type='text'
										value={newMessage}
										onChange={e => setNewMessage(e.target.value)}
									/>
									{newMessage.length > 0 && (
										<button>
											<i>
												<FontAwesomeIcon icon='fa-regular fa-paper-plane' />
											</i>
										</button>
									)}
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{selectedConversation && !newConversation && (
				<div className='col-xl-7'>
					<div className='main-content-box p-0'>
						<div className='main-content-header'>
							<div className='d-flex align-items-center'>
								<div className='d-flex align-items-center'>
									<div onClick={handleGoBack}>
										<i className='icon-xl me-2 color-gray'>
											<FontAwesomeIcon icon='fa-solid fa-angle-left' />
										</i>
									</div>

									<img
										src={userIcon}
										alt='Zdjęcie użytkownika'
										width={50}
										height={50}
										draggable={false}
									/>
								</div>
								<div className='ms-2'>
									<p className='m-0 '>Rafał</p>
									<p className='m-0 text-xs color-gray'>Ostatnio widziany: 2 dni temu</p>
								</div>
							</div>
						</div>
						<NavLink
							to={`/announcement/${selectedConversation.announcement_id}`}
							style={{ all: 'unset' }}>
							<div className='el-border-bottom p-2 d-flex align-items-center cursor-pointer '>
								<div className='chat-content-announcement-info'>
									<img
										src={selectedConversation.announcement_first_image}
										alt='Zdjęcie ogłoszenia'
									/>
								</div>
								<div className='ms-3 w-100'>
									<p className='m-0'>{selectedConversation.announcement_title}</p>
									<div className='d-flex justify-content-between'>
										<p className='m-0 color-main'>{selectedConversation.announcement_price}</p>
										<p className='m-0 color-gray text-xs me-2'>
											ID: {selectedConversation.announcement_id}
										</p>
									</div>
								</div>
							</div>
						</NavLink>

						<div className='chat-content-messages' ref={messagesContainerRef}>
							{loadingMessages ? (
								<>
									{[...Array(3)].map((_, index) => (
										<React.Fragment key={`loading-message-${index}`}>
											<div className='skeleton-right'>
												<Skeleton count={1} height={40} width={150} borderRadius={10} />
											</div>
											<div className='skeleton-right'>
												<Skeleton count={1} height={40} width={250} borderRadius={10} />
											</div>
											<div className='skeleton-left'>
												<Skeleton count={1} height={40} width={300} borderRadius={10} />
											</div>
											<div className='skeleton-left'>
												<Skeleton count={1} height={40} width={140} borderRadius={10} />
											</div>
										</React.Fragment>
									))}
								</>
							) : (
								messages.map((message, index) => {
									const previousMessage = messages[index - 1]
									const nextMessage = messages[index + 1]
									const showSenderInfo =
										!previousMessage || previousMessage.user_id !== message.user_id
									const showStatusInfo = !nextMessage || nextMessage.user_id !== message.user_id
									const showDate =
										previousMessage &&
										isHourApart(new Date(previousMessage.created_at), new Date(message.created_at))

									return (
										<div className='d-block message' key={`messanger-chat-${message.id}`}>
											{showDate > 0 && (
												<div className='message-date'>
													{formatDate(new Date(message.created_at))}
												</div>
											)}

											<div
												className={`message-area ${
													isMessageSentByUser(message) ? 'sent' : 'received'
												}`}>
												<div className='message-content'>
													<p>{message.content}</p>
												</div>

												<div
													className={`d-flex mt-1 ${
														isMessageSentByUser(message) ? 'justify-content-end' : ''
													}`}>
													<div className='message-small-date'>
														<span>{formatDate(new Date(message.created_at), true)}</span>
													</div>
													{isMessageSentByUser(message) && (
														<i className={`message-status status-${message.status} ms-2`}>
															{message.status === 1 && (
																<>
																	<FontAwesomeIcon icon='fa-regular fa-circle' />
																	{/* <span>Wysłana</span> */}
																</>
															)}
															{message.status === 2 && (
																<>
																	<FontAwesomeIcon icon='fa-solid fa-circle-check' />
																	{/* <span>Dostarczona</span> */}
																</>
															)}
															{message.status === 3 && (
																<>
																	<FontAwesomeIcon icon='fa-solid fa-circle-check' />
																	{/* <span>Wyświetlona</span> */}
																</>
															)}
														</i>
													)}
												</div>
											</div>
										</div>
									)
								})
							)}
						</div>

						<div className='chat-content-bottom el-border-top'>
							<form onSubmit={handleSendMessage}>
								<div className='d-flex align-items-center'>
									<div className='me-2'>
										<i className='icon-lg me-3'>
											<FontAwesomeIcon icon='fa-regular fa-images' />
										</i>
										<i className='icon-lg'>
											<FontAwesomeIcon icon='fa-regular fa-file' />
										</i>
									</div>
									<input
										placeholder='Twoja wiadomość...'
										type='text'
										value={newMessage}
										onChange={e => setNewMessage(e.target.value)}
									/>
									{newMessage.length > 0 && (
										<button>
											<i>
												<FontAwesomeIcon icon='fa-regular fa-paper-plane' />
											</i>
										</button>
									)}
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default MessagesList
