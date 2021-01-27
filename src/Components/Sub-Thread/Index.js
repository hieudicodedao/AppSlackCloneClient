import React, { useEffect, useState } from 'react'
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
		<div className='post post-right'>
			<div className='image-tab'>
				<img src={img} alt='' />
			</div>
			<div className='content-tab'>
				<div className='status-content'>
					<p className='user-name'>{reply.user}</p>
					<span className='time-sent'>{showDate(reply.date)}</span>
				</div>
				<div className='user-content'>
					<span className='text'>{reply.content}</span>
				</div>
			</div>
		</div>
	)
}

export default Index
