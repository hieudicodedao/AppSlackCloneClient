import React from 'react'
import SubChannel from '../Sub-Channel/Index'

const Index = (props) => {
	const { handleClickOpen, listchannel, handleJoinChannel } = props
	return (
		<div className='chanel'>
			<div className='chanel-add' onClick={() => handleClickOpen()}>
				<span>Channel</span>
				<i className='fas fa-plus-circle'></i>
			</div>
			<div className='chanel-name-list'>
				{listchannel.map((channel) => (
					<SubChannel
						channelName={channel.name}
						handleJoinChannel={handleJoinChannel}
						isJoin={channel.isJoin}
					/>
				))}
			</div>
		</div>
	)
}

export default Index
