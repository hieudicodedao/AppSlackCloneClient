import React from 'react'

const Index = (props) => {
	const { channelName, handleJoinChannel, isJoin } = props
	return (
		<a
			href
			className={isJoin === true ? 'chanel-item active' : 'chanel-item'}
			onClick={() => handleJoinChannel(channelName)}
		>
			<span># </span>
			<span className='chanel-name'>{channelName}</span>
		</a>
	)
}

export default Index
