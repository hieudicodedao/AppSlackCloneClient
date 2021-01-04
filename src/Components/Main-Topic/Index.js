import React, { useRef, useEffect } from 'react'
import TopicPost from '../TopicPost/Index'
const Index = (props) => {
	const {
		listtopic,
		handleClickTopic,
		isOpenThread,
		topic_content_2,
		setTopic_content_2,
		handleAddPost,
	} = props
	const messagesEndRef = useRef(null)
	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(scrollToBottom, [listtopic])
	return (
		<>
			<div
				className={
					isOpenThread === false ? 'down-left' : 'down-left smaller'
				}
			>
				<div className='old-topic'>
					{listtopic.map((topic) => {
						return (
							<TopicPost
								topic={topic}
								handleClickTopic={handleClickTopic}
							/>
						)
					})}
					<div ref={messagesEndRef} />
				</div>

				<div className='topic-content-send'>
					<form
						action=''
						onSubmit={(e) => {
							e.preventDefault()
							handleAddPost()
							setTopic_content_2('')
						}}
					>
						<input
							type='text'
							className='topic-input'
							placeholder='Envoyer un message à aléatoire'
							name='topic-content-2'
							value={topic_content_2}
							onChange={(e) => setTopic_content_2(e.target.value)}
						/>
						<div
							className='staffthing'
							onClick={(e) => {
								e.preventDefault()
								handleAddPost()
								setTopic_content_2('')
							}}
						>
							<i className='fas fa-paper-plane'></i>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

export default Index
