import React from 'react'

const Index = (props) => {
	const { numberPost, channelName, openAddTopicForm } = props
	return (
		<div className='up'>
			<div className='name-group'>
				<span>#{channelName}</span>
			</div>
			<div className='group-status'>
				<span className='number-post'>Number post : {numberPost}</span>
				<a href onClick={() => openAddTopicForm()}>
					{' '}
					Add a topic{' '}
				</a>
			</div>
		</div>
	)
}

export default Index
