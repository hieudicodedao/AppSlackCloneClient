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
	useEffect(() => {
		loadImage()
	}, [])

	useEffect(() => {
		loadImgDate()
	}, [])
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
	const display_sent_image = () => {
		return topic.image.map((ele) => {
			return (
				<div className='image-sent-item'>
					<img src={ele} alt='' />
				</div>
			)
		})
	}
	return (
		<div class='post post-left'>
			<div class='image-tab'>
				<img src={img} alt='' />
			</div>
			<div class='content-tab'>
				<div class='status-content'>
					<p class='user-name'>{topic.user}</p>
					<span class='time-sent'>{showDate(topic.date)}</span>
				</div>
				<div class='user-content'>
					<span class='text'>{topic.content}</span>
					<div className='image-sent'>{display_sent_image()}</div>
				</div>
				{topic.reply.length > 0 ? (
					<div class='response'>
						<AvatarGroup max={4}>
							{listReplyImg.map((ele) => {
								return <Avatar alt='Remy Sharp' src={ele.img} />
							})}
						</AvatarGroup>
						<a
							href
							className='number-reply'
							onClick={() => handleClickTopic(topic._id)}
						>
							{' '}
							{topic.reply.length} replies
						</a>
						<div class='last-reply'>
							{listReplyImg.length === 0 ? (
								<span>No reply recored </span>
							) : (
								<span>
									Last reply :{showDate(listReplyImg[0].date)}
								</span>
							)}
						</div>
					</div>
				) : (
					<div class='response'>
						<a
							href
							className='number-reply'
							onClick={() => handleClickTopic(topic._id)}
						>
							{' '}
							0 replies
						</a>
					</div>
				)}
			</div>
		</div>
	)
}

export default Index
