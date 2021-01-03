import React, { useEffect, useState } from 'react'
import { URL_SERVER } from '../../Config/Index'
import { FETCH_POST } from '../../API/index'
import { GET_IMAGE } from '../../Config/Index'
import { showDate } from '../../Config/refractorDate'
const Index = (props) => {
	const { reply } = props
	const [img, setImg] = useState('')
	const loadImage = async () => {
		await FETCH_POST(GET_IMAGE, { username: reply.user })
			.then((res) => res.json())
			.then((rs) => {
				if (rs.img) {
					setImg(rs.img)
				}
				if (rs.err) {
					console.log('err')
				}
			})
	}
	useEffect(() => {
		loadImage()
	}, [])
	return (
		<div class='post post-right'>
			<div class='image-tab'>
				<img src={URL_SERVER + '/image/' + img} alt='' />
			</div>
			<div class='content-tab'>
				<div class='status-content'>
					<p class='user-name'>{reply.user}</p>
					<span class='time-sent'>{showDate(reply.date)}</span>
				</div>
				<div class='user-content'>
					<span class='text'>{reply.content}</span>
				</div>
			</div>
		</div>
	)
}

export default Index
