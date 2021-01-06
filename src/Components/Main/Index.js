import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
//
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
//
import Channel from '../Main-Channel/Index'
import Status from '../Main-Status/Index'
import Topic from '../Main-Topic/Index'
import Thread from '../Main-Thread/Index'
import {
	URL_SERVER,
	CREATE_CHANNEL,
	GET_LIST_CHANNEL,
	CREATE_TOPIC,
	GET_LIST_TOPIC,
	GET_LIST_REPLY,
	ADD_REPLY,
	PUSH_REPLY_TO_TOPIC,
	UPLOAD_TO_CLOUD,
} from '../../Config/Index'
import { FETCH_POST, FETCH_GET } from '../../API/index'
//
import './index.css'
// import { lightGreen } from '@material-ui/core/colors'
//
let socket
//
function Alert(props) {
	return <MuiAlert elevation={6} variant='filled' {...props} />
}

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2),
		},
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}))

//
const Index = (props) => {
	const { username } = props
	const classes = useStyles()
	//

	//
	const [openBackDrop, setOpenBackDrop] = React.useState(false)
	const [openDialog, setOpenDialog] = React.useState(false)
	const [openDialogTopic, setOpenDialogTopic] = React.useState(false)
	const [openSnack, setOpenSnack] = React.useState(false)
	//
	const [topic_content_2, setTopic_content_2] = useState('')
	const [isOpenThread, setIsOpenThread] = useState(false)
	const [idtopic, setIdtopic] = useState('')
	const [listreply, setListreply] = useState([])
	const [topic_content, setTopic_content] = useState('')
	const [reply_content, setReply_content] = useState('')
	const [listtopic, setListtopic] = useState([])
	const [listchannel, setListchannel] = useState([])
	const [current_channel, setCurrent_channel] = useState('')
	const [current_topic, setCurrent_topic] = useState('')
	const [channel_name, setChanel_name] = useState('')
	const [isAddSuccess, setIsAddSuccess] = useState(false)
	const [url, setUrl] = useState(URL_SERVER)
	//
	//
	const loadChannelFromDB = async () => {
		await FETCH_GET(GET_LIST_CHANNEL)
			.then((res) => res.json())
			.then(
				(rs) => {
					const newList = []
					const listchannelDB = rs.listchannel
					listchannelDB.map((channel) =>
						newList.push({ name: channel.name, isJoin: false }),
					)
					setListchannel(newList)
				},
				(err) => {},
			)
			.catch((error) => console.log(error))
	}
	// socket add channel

	useEffect(() => {
		socket = io(url)
	}, [url])
	useEffect(() => {
		loadChannelFromDB()
	}, [])
	useEffect(() => {
		socket.on('some-one-add-channel', (newChannel) => {
			setListchannel([...listchannel, newChannel])
		})
	}, [listchannel])
	useEffect(() => {
		socket.on('some-one-add-topic', (send_topic) => {
			setListtopic([...listtopic, send_topic])
		})
	}, [listtopic])
	useEffect(() => {
		socket.on('some-one-add-reply', (newReply) => {
			setListreply([...listreply, newReply])
		})
	}, [listreply])
	useEffect(() => {
		socket.on('some-one-update-reply-array', ({ newReply, _id_topic }) => {
			let newlisttopic = []
			listtopic.map((topic) => {
				if (topic._id === _id_topic) {
					topic.reply = newReply
				}
				return newlisttopic.push(topic)
			})
			setListtopic(newlisttopic)
		})
	}, [listtopic, idtopic])
	//

	const handleAddChanel = async () => {
		setOpenDialog(false)
		setOpenBackDrop(true)
		await FETCH_POST(CREATE_CHANNEL, { name: channel_name })
			.then((res) => {
				setOpenBackDrop(false)
				return res.json()
			})
			.then(
				(rs) => {
					if (rs.success) {
						let newChannel = {
							name: channel_name,
							isJoin: false,
						}
						socket.emit('add-channel', newChannel)
						setIsAddSuccess(true)
					}
					if (rs.err) {
						setIsAddSuccess(false)
					}
					setOpenSnack(true)
				},
				(err) => {
					setIsAddSuccess(false)
					setOpenSnack(true)
				},
			)
			.catch((error) => {
				console.log(error)
				setIsAddSuccess(false)
				setOpenSnack(true)
			})
		setChanel_name('')
	}
	const handleAddPost = async (attachImageUrl) => {
		if (!current_channel) {
			setIsAddSuccess(false)
			setOpenSnack(true)
			return
		}
		setOpenBackDrop(true)
		let list_image = null
		await FETCH_POST(UPLOAD_TO_CLOUD, {
			image: attachImageUrl,
		})
			.then((res) => res.json())
			.then((rs) => {
				if (rs.list_image) {
					list_image = rs.list_image
					return
				}
				if (rs.err) {
					setOpenBackDrop(false)
					setIsAddSuccess(false)
					setOpenSnack(true)
					return
				}
			})
			.catch((err) => {
				console.log(err)
				setOpenBackDrop(false)
				setIsAddSuccess(false)
				setOpenSnack(true)
			})
		if (list_image === null) return
		await FETCH_POST(CREATE_TOPIC, {
			user: username,
			channel: current_channel,
			content: topic_content !== '' ? topic_content : topic_content_2,
			list_image,
		})
			.then((res) => {
				setOpenBackDrop(false)
				return res.json()
			})
			.then((rs) => {
				if (rs.newTopic) {
					console.log(rs.newTopic)
					const send_topic = rs.newTopic
					socket.emit('add-topic', send_topic)
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

		setOpenDialogTopic(false)
		setTopic_content('')
	}
	const handleJoinChannel = async (channelName) => {
		//if before join another topic
		setIsOpenThread(false)
		setListreply([])
		setListtopic([])
		if (current_channel !== '') {
			socket.emit('leave-channel', current_channel)
		}

		// reset list reply
		setListreply([])

		// animation channel bar
		const fakeListChannel = []
		for (let i = 0; i < listchannel.length; ++i) {
			if (listchannel[i].name === channelName) {
				fakeListChannel.push({
					name: channelName,
					isJoin: true,
				})
				setCurrent_channel(channelName)
			} else {
				fakeListChannel.push({
					name: listchannel[i].name,
					isJoin: false,
				})
			}
		}
		setListchannel(fakeListChannel)
		setOpenBackDrop(true)
		setListtopic([])
		//load data post
		await FETCH_POST(GET_LIST_TOPIC, { channelName })
			.then((res) => {
				setOpenBackDrop(false)
				return res.json()
			})
			.then((rs) => {
				socket.emit('join-channel', channelName)
				setListtopic(rs.listTopic)
			})
			.catch((error) => {
				console.log(error)
				setIsAddSuccess(false)
				setOpenSnack(true)
			})
	}
	const handleClickTopic = async (_id_topic) => {
		if (idtopic !== '') {
			socket.emit('leave-topic', idtopic)
		}
		setCurrent_topic(_id_topic)
		setOpenBackDrop(true)
		await FETCH_POST(GET_LIST_REPLY, { _id_topic })
			.then((res) => {
				setOpenBackDrop(false)
				return res.json()
			})
			.then((rs) => {
				socket.emit('join-topic', _id_topic)
				setIdtopic(_id_topic)
				setIsOpenThread(true)
				setListreply(rs.listreply)
			})
			.catch((error) => {
				console.log(error)
				setIsAddSuccess(false)
				setOpenSnack(true)
			})
	}
	const handleAddReply = async () => {
		setOpenBackDrop(true)
		// add reply
		let id_reply = null
		await FETCH_POST(ADD_REPLY, {
			username,
			_id_topic: idtopic,
			content: reply_content,
		})
			.then((res) => {
				setOpenBackDrop(false)
				return res.json()
			})
			.then((rs) => {
				if (rs.newReply) {
					id_reply = rs.newReply._id
					const { newReply } = rs
					socket.emit('add-reply', newReply)

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
		//add reply for topic
		if (id_reply !== null) {
			await FETCH_POST(PUSH_REPLY_TO_TOPIC, {
				id_reply,
				_id_topic: idtopic,
			})
				.then((res) => res.json())
				.then((rs) => {
					let newReply = rs.reply
					socket.emit('update-reply-array', {
						newReply,
						_id_topic: idtopic,
					})
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}
	//
	return (
		<div className={classes.root}>
			<div className='main'>
				<div className='nav-bar'></div>
				<div className='chanel-content'>
					<Channel
						handleClickOpen={() => setOpenDialog(true)}
						listchannel={listchannel}
						handleJoinChannel={handleJoinChannel}
					/>
					<div className='content'>
						<Status
							numberPost={listtopic.length}
							channelName={current_channel}
							openAddTopicForm={() => {
								if (current_channel !== '')
									setOpenDialogTopic(true)
								else {
									setIsAddSuccess(false)
									setOpenSnack(true)
								}
							}}
						/>
						<div className='down'>
							<Topic
								listtopic={listtopic}
								handleClickTopic={handleClickTopic}
								isOpenThread={isOpenThread}
								topic_content_2={topic_content_2}
								setTopic_content_2={setTopic_content_2}
								handleAddPost={handleAddPost}
								setOpenBackDrop={setOpenBackDrop}
								setOpenSnack={setOpenSnack}
								setIsAddSuccess={setIsAddSuccess}
							/>
							<Thread
								username={username}
								handleAddReply={() => {
									if (current_topic === '') {
										setIsAddSuccess(false)
										setOpenSnack(true)
									} else {
										handleAddReply()
									}
									setReply_content('')
								}}
								reply_content={reply_content}
								setReply_content={setReply_content}
								listreply={listreply}
								closeThread={() => {
									setIsOpenThread(false)
									setListreply([])
									setIdtopic('')
									socket.emit('leave-topic', idtopic)
								}}
								isOpenThread={isOpenThread}
							/>
						</div>
					</div>
				</div>
			</div>
			<Dialog
				open={openDialogTopic}
				onClose={() => setOpenDialogTopic(false)}
				aria-labelledby='form-dialog-title'
			>
				<DialogTitle id='form-dialog-title'>Add Post</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin='dense'
						id='topic'
						type='text'
						fullWidth
						value={topic_content}
						onChange={(e) => setTopic_content(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setOpenDialogTopic(false)
							setTopic_content('')
						}}
						color='primary'
					>
						Cancel
					</Button>
					<Button onClick={() => handleAddPost()} color='primary'>
						Add
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				aria-labelledby='form-dialog-title'
			>
				<DialogTitle id='form-dialog-title'>Add Channel</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin='dense'
						id='channel'
						type='text'
						fullWidth
						value={channel_name}
						onChange={(e) => setChanel_name(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setOpenDialog(false)
							setChanel_name('')
						}}
						color='primary'
					>
						Cancel
					</Button>
					<Button onClick={() => handleAddChanel()} color='primary'>
						Add
					</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				open={openSnack}
				autoHideDuration={6000}
				onClose={() => setOpenSnack(false)}
			>
				{isAddSuccess ? (
					<Alert
						onClose={() => setOpenSnack(false)}
						severity='success'
					>
						Add successful!
					</Alert>
				) : (
					<Alert severity='error'>Some error just happens!</Alert>
				)}
			</Snackbar>
			<Backdrop
				className={classes.backdrop}
				open={openBackDrop}
				onClick={() => setOpenBackDrop(false)}
			>
				<CircularProgress color='inherit' />
			</Backdrop>
		</div>
	)
}

export default Index
