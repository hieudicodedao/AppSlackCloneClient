import React from 'react'

const Index = (props) => {
	const { numberPost, channelName, openAddTopicForm } = props
	return (
		<div class='up'>
			<div class='name-group'>
				<span>#{channelName}</span>
			</div>
			<div class='group-status'>
				<span class='number-post'>Number post : {numberPost}</span>
				<a href onClick={() => openAddTopicForm()}>
					{' '}
					Add a topic{' '}
				</a>
			</div>
		</div>
	)
}

export default Index
