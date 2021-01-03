import React, { useEffect, useState, useCallback } from 'react'
import Avatar from '@material-ui/core/Avatar'
import AvatarGroup from '@material-ui/lab/AvatarGroup'
import { URL_SERVER } from '../../Config/Index'
import { FETCH_POST } from '../../API/index'
import { GET_IMAGE, GET_REPLY_INFO } from '../../Config/Index'
import { showDate } from '../../Config/refractorDate'
const Index = (props) => {
	const { topic, handleClickTopic } = props
	const [img, setImg] = useState('')
	const [listReplyImg, setListReplyImg] = useState([])

	const loadImage = useCallback(async () => {
		await FETCH_POST(GET_IMAGE, { username: topic.user })
			.then((res) => res.json())
			.then((rs) => {
				if (rs.img) {
					setImg(rs.img)
				}
				if (rs.err) {
					console.log('err')
				}
			})
	}, [topic])
	const loadImgDate = async () => {
		await FETCH_POST(GET_REPLY_INFO, {
			topic_id: topic._id,
		})
			.then((res) => res.json())
			.then((rs) => {
				// rs.refactorlistImgDate array
				setListReplyImg(rs.refactorlistImgDate)
			})
			.catch((err) => {
				console.log(err)
			})
	}
	useEffect(() => {
		loadImage()
	}, [])

	useEffect(() => {
		loadImgDate()
	}, [])

	return (
		<div class='post post-left' onClick={() => handleClickTopic(topic._id)}>
			<div class='image-tab'>
				<img src={URL_SERVER + '/image/' + img} alt='' />
			</div>
			<div class='content-tab'>
				<div class='status-content'>
					<p class='user-name'>{topic.user}</p>
					<span class='time-sent'>{showDate(topic.date)}</span>
				</div>
				<div class='user-content'>
					<span class='text'>{topic.content}</span>
				</div>
				{topic.reply.length > 0 ? (
					<div class='response'>
						<AvatarGroup max={4}>
							{listReplyImg.map((ele) => {
								return (
									<Avatar
										alt='Remy Sharp'
										src={URL_SERVER + '/image/' + ele.img}
									/>
								)
							})}
						</AvatarGroup>
						<a href className='number-reply'>
							{' '}
							{topic.reply.length} replies
						</a>
						<div class='last-reply'>
							{listReplyImg.length === 0 ? (
								<span>No reply recored </span>
							) : (
								<span>
									Last reply :{' '}
									{showDate(listReplyImg[0].date)}
								</span>
							)}
						</div>
					</div>
				) : (
					<></>
				)}
			</div>
		</div>
	)
}

export default Index
