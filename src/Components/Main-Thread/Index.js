import React, { useState, useEffect, useRef } from 'react'
import SubThread from '../Sub-Thread/Index'
import { URL_SERVER } from '../../Config/Index'
import { FETCH_POST } from '../../API/index'
import { GET_IMAGE } from '../../Config/Index'
const Index = (props) => {
	const {
		username,
		handleAddReply,
		reply_content,
		setReply_content,
		listreply,
		closeThread,
	} = props
	const [img, setImg] = useState('')
	const messagesEndRef = useRef(null)
	const loadImage = async () => {
		await FETCH_POST(GET_IMAGE, { username })
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
	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(scrollToBottom, [listreply])
	useEffect(() => {
		loadImage()
	}, [])
	return (
		<div class='down-right'>
			<div class='infor-thread'>
				<div class='thread'>
					<span class='header'>#Thread</span>
					{/* <i class='far fa-times-circle' onClick={closeThread}></i> */}
					<span onClick={closeThread} class = 'equal-to-i'>Close</span>
				</div>
			</div>
			<div class='down-right-post'>
				{listreply.map((reply) => {
					return <SubThread reply={reply} />
				})}
				<div ref={messagesEndRef} />
			</div>
			<div class='your-comment'>
				<img src={URL_SERVER + '/image/' + img} alt='' />
				<input
					type='text'
					placeholder='#Comment'
					value={reply_content}
					name='reply'
					onChange={(e) => setReply_content(e.target.value)}
				/>
				<button class='btn-send' onClick={handleAddReply}>
					<i class='fas fa-plus'></i>
				</button>
			</div>
		</div>
	)
}

export default Index
