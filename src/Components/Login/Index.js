import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

//material ui
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
//
import { FETCH_POST } from '../../API/index'
import { CHECK_USER } from '../../Config/Index'
//
import '../../css/main.css'
import '../../css/util.css'
const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}))
const Login = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [usernameError, setUsernameError] = useState(['', false])
	const [passwordError, setPasswordError] = useState(['', false])
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
		const { name, value } = e.target
		if (name === 'username') {
			setUsernameError(['', false])
			setUsername(value)
		}
		if (name === 'password') {
			setPasswordError(['', false])
			setPassword(value)
		}
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		if (username.length < 6) {
			setUsernameError(['At least 6 characters', true])
			return
		}
		if (password.length < 6) {
			setPasswordError(['At least 6 characters', true])
			return
		}
		handleToggle()
		await FETCH_POST(CHECK_USER, { username, password })
			.then((res) => {
				handleClose()
				return res.json()
			})
			.then(
				(rs) => {
					if (rs.success) {
						localStorage.setItem('token', rs.token)
						history.replace('/main')
						return
					}
					if (rs.err) {
						setUsernameError([
							'User name or password was incorect!',
							true,
						])
						return
					}
				},
				(err) => {
					console.log(err)
				},
			)
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<>
			<div className='limiter'>
				<div className='container-login100'>
					<div className='wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54'>
						<form className='login100-form validate-form'>
							<span className='login100-form-title p-b-49'>
								{' '}
								Login{' '}
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

							<div className='container-login100-form-btn'>
								<div className='wrap-login100-form-btn'>
									<div className='login100-form-bgbtn'></div>
									<button
										className='login100-form-btn'
										onClick={(e) => handleSubmit(e)}
									>
										Login
									</button>
								</div>
							</div>

							<div className='flex-col-c p-t-155'>
								<span className='txt1 p-b-17'>
									{' '}
									Or Sign Up Using{' '}
								</span>

								<Link to='/register'>REGISTER</Link>
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

export default Login
