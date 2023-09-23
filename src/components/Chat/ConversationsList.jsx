import React from 'react'
import { NavLink } from 'react-router-dom'

import userIcon from '/images/user.png'
import noImages from '/images/no-image.png'
import Skeleton from 'react-loading-skeleton'

import Button from '../Layout/Button'
import ConversationElement from './ConversationElement'

const ConversationsList = ({
	sortedConversations,
	selectedConversation,
	isAuthoring,
	user,
	loadingConversations,
	setIsAuthoring,
}) => {
	return (
		<div className='col-xl-5'>
			<div className='main-content-box p-0 pb-2 sticky-column' style={{ minHeight: '300px' }}>
				<div className='main-content-header pb-3'>
					<h5 className='m-0'>Twoje konwersacje</h5>
				</div>
				<div className='px-3 py-2 mt-2 mb-2 d-flex align-items-center'>
					<Button
						text={'Sprzedaje'}
						color={true}
						size={'xs'}
						rounded={true}
						transparent={isAuthoring ? false : true}
						className={`px-4`}
						onClick={() => setIsAuthoring(true)}
					/>
					<Button
						text={'Kupuje'}
						color={true}
						size={'xs'}
						rounded={true}
						transparent={isAuthoring ? true : false}
						className={`px-4 ms-2`}
						onClick={() => setIsAuthoring(false)}
					/>
				</div>

				<ul className='chat-menu-list m-0 p-0'>
					{loadingConversations ? (
						<Skeleton count={5} height={80} />
					) : (
						sortedConversations.map(conversation => {
							const isUserAuthor = conversation.author

							if ((isAuthoring && isUserAuthor) || (!isAuthoring && !isUserAuthor)) {
								return (
									<li
										key={conversation.id}
										className={`px-2 ${
											selectedConversation?.id === conversation.id ? 'selected-list-element' : ''
										}`}>
										<NavLink to={`/account/chat/${conversation.id}`} style={{ all: 'unset' }}>
											<ConversationElement
												id={conversation.id}
												image={conversation.announcement_first_image}
												title={conversation.announcement_title}
												price={conversation.announcement_price}
												latest_message={conversation.latest_message}
												user={user}
												selected={selectedConversation?.id === conversation.id ? true : false}
												newMessage={
													conversation?.latest_message?.user_id !== user?.id &&
													conversation?.latest_message?.status &&
													conversation?.latest_message?.status !== 3
														? true
														: false
												}
											/>
										</NavLink>
									</li>
								)
							}

							return null
						})
					)}
				</ul>
			</div>
		</div>
	)
}

export default ConversationsList
