import React, { useRef, useEffect, useState } from 'react'
import { ATTACH_FILE, URL_SERVER } from '../../Config/Index'
import TopicPost from '../TopicPost/Index'
const Index = (props) => {
	const {
		listtopic,
		handleClickTopic,
		isOpenThread,
		topic_content_2,
		setTopic_content_2,
		handleAddPost,
		setOpenBackDrop,
		setOpenSnack,
		setIsAddSuccess,
	} = props
	const messagesEndRef = useRef(null)
	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
	}
	const [attachImageUrl, setAttachImageUrl] = useState([])
	useEffect(scrollToBottom, [listtopic])
	const handleChangeAttach = async (e) => {
		//get file
		const data = new FormData()
		let fileList = e.target.files
		for (let x = 0; x < fileList.length; ++x) {
			data.append('file', fileList[x])
		}

		//send to server to save local
		setOpenBackDrop(true)
		await fetch(ATTACH_FILE, {
			method: 'POST',
			body: data,
		})
			.then((res) => {
				setOpenBackDrop(false)
				return res.json()
			})
			.then((rs) => {
				if (rs.fileNames) {
					const newAttachImageUrl = attachImageUrl
					rs.fileNames.map((name) => {
						return newAttachImageUrl.push(name)
					})
					setAttachImageUrl(newAttachImageUrl)
					setIsAddSuccess(true)
					setOpenSnack(true)
				}
				if (rs.err) {
					setIsAddSuccess(false)
					setOpenSnack(true)
				}
			})
			.catch((err) => {
				console.log(err)
				setIsAddSuccess(false)
				setOpenSnack(true)
			})
	}
	const onRemoveAttach = (fileName) => {
		const newAttach = []
		attachImageUrl.map((ele) => {
			if (ele !== fileName) return newAttach.push(ele)
			return 0
		})
		setAttachImageUrl(newAttach)
	}

	const showListAttach = () => {
		return attachImageUrl.map((ele) => {
			return (
				<span className='img-holder-item' key={ele}>
					<img src={`${URL_SERVER}/attach_ready/${ele}`} alt='' />{' '}
					<button
						className='image-close-btn'
						onClick={(e) => {
							e.preventDefault()
							onRemoveAttach(ele)
						}}
					>
						<i className='far fa-times-circle'></i>
					</button>
				</span>
			)
		})
	}
	return (
		<>
			<div
				className={
					isOpenThread === false ? 'down-left' : 'down-left smaller'
				}
			>
				<div className='old-topic'>
					{listtopic.map((topic, index) => {
						return (
							<TopicPost
								key={index}
								topic={topic}
								handleClickTopic={handleClickTopic}
							/>
						)
					})}
					<div ref={messagesEndRef} />
				</div>

				<div className='topic-content-send'>
					<form
						action=''
						onSubmit={(e) => {
							e.preventDefault()
							handleAddPost(attachImageUrl)
							setTopic_content_2('')
							setAttachImageUrl([])
						}}
					>
						<div className='input-pro'>
							<input
								type='text'
								className='topic-input'
								placeholder='Envoyer un message à aléatoire'
								name='topic-content-2'
								value={topic_content_2}
								onChange={(e) =>
									setTopic_content_2(e.target.value)
								}
							/>
							<div className='img-holder'>{showListAttach()}</div>
						</div>

						<div className='staffthing'>
							<i
								className='fas fa-paper-plane'
								onClick={(e) => {
									e.preventDefault()
									handleAddPost(attachImageUrl)
									setTopic_content_2('')
									setAttachImageUrl([])
								}}
							></i>
							<label htmlFor='attach-file'>
								<i className='fas fa-paperclip' type='file'></i>
							</label>
							<input
								type='file'
								name='attach-file'
								id='attach-file'
								multiple
								className='select-file-input'
								accept='image/*'
								onChange={(e) => handleChangeAttach(e)}
							/>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

export default Index
