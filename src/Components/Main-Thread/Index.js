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
		isOpenThread,
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
		<div
			className={
				isOpenThread === false ? 'down-right' : 'down-right display'
			}
		>
			<div className='infor-thread'>
				<div className='thread'>
					<span className='header'>#Thread</span>

					<span onClick={closeThread} className='equal-to-i'>
						Close
					</span>
				</div>
			</div>
			<div className='down-right-post'>
				{listreply.map((reply) => {
					return <SubThread reply={reply} />
				})}
				<div ref={messagesEndRef} />
			</div>
			<div className='your-comment'>
				<img src={URL_SERVER + '/image/' + img} alt='' />
				<input
					type='text'
					placeholder='#Comment'
					value={reply_content}
					name='reply'
					onChange={(e) => setReply_content(e.target.value)}
				/>
				<button className='btn-send' onClick={handleAddReply}>
					<i className='fas fa-plus'></i>
				</button>
			</div>
		</div>
	)
}

export default Index
