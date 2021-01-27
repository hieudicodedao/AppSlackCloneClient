import React, { useState } from 'react'
//material ui
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
//
import { CREATE_USER, UPLOAD_IMAGE, IS_EXIST_USER } from '../../Config/Index'
import { FETCH_POST } from '../../API/index'
//
import { Link, useHistory } from 'react-router-dom'
import '../../public/css/main.css'
import '../../public/css/util.css'

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}))

const LoginRegister = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [repassword, setRepassword] = useState('')
	const [file, setFile] = useState(null)

	const [usernameError, setUsernameError] = useState(['', false])
	const [passwordError, setPasswordError] = useState(['', false])
	const [repasswordError, setRepasswordError] = useState(['', false])
	const [fileError, setFileError] = useState(['', false])
	const history = useHistory()

	const classes = useStyles()
	const [open, setOpen] = React.useState(false)
	const handleClose = () => {
		setOpen(false)
	}
	const handleToggle = () => {
		setOpen(!open)
	}

	const handleChange = (e) => {
		const { name } = e.target
		const { value } = e.target
		if (name === 'username') {
			setUsername(value)
			setUsernameError(['', false])
		}
		if (name === 'password') {
			setPassword(value)
			setPasswordError(['', false])
		}
		if (name === 'repassword') {
			setRepassword(value)
			setRepasswordError(['', false])
		}
	}
	const handleChangeAvatar = (e) => {
		setFileError(['', false])
		setFile(e.target.files[0])
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (username.length < 6) {
			setUsernameError(['At least 6 characters ', true])
			return
		}
		if (password.length < 6) {
			setPasswordError(['At least 6 characters ', true])
			return
		}
		if (!(password === repassword)) {
			setRepasswordError(['Password must match ', true])
			return
		}
		if (file === null) {
			setFileError(['Must upload image ', true])
			return
		}
		let regex = /image/
		if (!regex.test(file.type)) {
			setFileError(['Image format only', true])
			return
		}
		const data = new FormData()
		data.append('file', file)
		handleToggle()
		let isExist = false
		await FETCH_POST(IS_EXIST_USER, { username, password })
			.then((res) => res.json())
			.then(
				(rs) => {
					if (rs.err) {
						setUsernameError(['User existed', true])
						handleClose()
						isExist = true
					}
				},
				(err) => {
					setUsernameError(['Some thing corrupted', true])
					handleClose()
				},
			)
			.catch((err) => {
				isExist = true
				console.log(err)
				handleClose()
			})
		let img = null
		if (isExist === true) return
		await fetch(UPLOAD_IMAGE, {
			method: 'POST',
			body: data,
		})
			.then((res) => {
				handleClose()
				return res.json()
			})
			.then(
				(rs) => {
					if (rs.err) {
						setFileError(['upload photo error', true])
						handleClose()
					}
					if (rs.success) {
						img = rs.success
					}
				},
				(err) => {
					setFileError(['upload photo error', true])
					handleClose()
					return
				},
			)
			.catch((error) => {
				console.log(error)
				handleClose()
			})
		await FETCH_POST(CREATE_USER, { username, password, img })
			.then((res) => {
				return res.json()
			})
			.then((rs) => {
				if (rs.success) {
					console.log('created')
					history.replace('/login')
				}
				if (rs.err) {
					console.log('some error')
				}
			})
			.catch((error) => {
				console.log(error)
			})
		handleClose()
	}

	return (
		<>
			<div className='limiter'>
				<div className='container-login100'>
					<div className='wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54'>
						<form className='login100-form validate-form'>
							<span className='login100-form-title p-b-49'>
								{' '}
								Register{' '}
							</span>

							<div
								className={
									usernameError[0] !== ''
										? 'wrap-input100 validate-input m-b-23 alert-validate'
										: 'wrap-input100 validate-input m-b-23'
								}
								data-validate={usernameError[0]}
							>
								<span className='label-input100'>Username</span>
								<input
									className={
										username !== ''
											? usernameError[1] === true
												? 'alert-validate input100 has-val'
												: 'input100 has-val'
											: usernameError[1] === true
											? 'alert-validate input100 '
											: 'input100'
									}
									type='text'
									name='username'
									placeholder='Type your username'
									value={username}
									onChange={(e) => handleChange(e)}
								/>
								<span
									className='focus-input100'
									data-symbol='&#xf206;'
								></span>
							</div>

							<div
								className={
									passwordError[0] !== ''
										? 'wrap-input100 validate-input alert-validate'
										: 'wrap-input100 validate-input'
								}
								data-validate={passwordError[0]}
							>
								<span className='label-input100'>Password</span>
								<input
									className={
										password !== ''
											? passwordError[1] === true
												? 'alert-validate input100 has-val'
												: 'input100 has-val'
											: passwordError[1] === true
											? 'alert-validate input100 '
											: 'input100'
									}
									type='password'
									name='password'
									placeholder='Type your password'
									value={password}
									onChange={(e) => handleChange(e)}
								/>
								<span
									className='focus-input100'
									data-symbol='&#xf190;'
								></span>
							</div>

							<div
								className={
									repasswordError[0] !== ''
										? 'wrap-input100 validate-input alert-validate'
										: 'wrap-input100 validate-input'
								}
								data-validate={repasswordError[0]}
							>
								<span className='label-input100'>
									Re-Password
								</span>
								<input
									className={
										repassword !== ''
											? repasswordError[1] === true
												? 'alert-validate input100 has-val'
												: 'input100 has-val'
											: repasswordError[1] === true
											? 'alert-validate input100 '
											: 'input100'
									}
									type='password'
									name='repassword'
									placeholder='Re enter password'
									value={repassword}
									onChange={(e) => handleChange(e)}
								/>
								<span
									className='focus-input100'
									data-symbol='&#xf190;'
								></span>
							</div>

							<div
								className={
									fileError[0] !== ''
										? 'wrap-input100 validate-input alert-validate'
										: 'wrap-input100 validate-input'
								}
								data-validate={fileError[0]}
							>
								<span className='label-input100'>
									Choose your avatar
								</span>
								<input
									className={
										file !== null
											? fileError[1] === true
												? 'alert-validate input100 has-val'
												: 'input100 has-val'
											: fileError[1] === true
											? 'alert-validate input100 '
											: 'input100'
									}
									type='file'
									name='avatar'
									onChange={(e) => handleChangeAvatar(e)}
								/>
							</div>

							<div className='container-login100-form-btn'>
								<div className='wrap-login100-form-btn'>
									<div className='login100-form-bgbtn'></div>
									<button
										className='login100-form-btn'
										onClick={(e) => handleSubmit(e)}
									>
										Sign Up
									</button>
								</div>
							</div>

							<div className='flex-col-c p-t-155'>
								<Link to='/login' className='txt2'>
									Back to Login
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>

			<div id='dropDownSelect1'></div>

			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color='inherit' />
			</Backdrop>
		</>
	)
}

export default LoginRegister
