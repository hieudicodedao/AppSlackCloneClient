import React, { useRef, useEffect } from 'react'
import TopicPost from '../TopicPost/Index'
const Index = (props) => {
	const { listtopic, handleClickTopic } = props
	const messagesEndRef = useRef(null)
	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(scrollToBottom, [listtopic])
	return (
		<>
			<div class='down-left'>
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
		</>
	)
}

export default Index
