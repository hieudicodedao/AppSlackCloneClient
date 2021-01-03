import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { IS_LOGIN } from '../../Config/Index'
import Main from '../Main/Index'
const Index = () => {
	const history = useHistory()
	const [username, setusername] = useState('')
	const checkToken = async () => {
		await fetch(IS_LOGIN, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bear ${localStorage.getItem('token')}`,
			},
		})
			.then((res) => res.json())
			.then((rs) => {
				if (rs.success) {
					setusername(rs.username)
					return
				}
				if (rs.err) {
					localStorage.removeItem('token')
					history.push('/login')
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}
	useEffect(() => {
		if (!localStorage.getItem('token')) history.replace('/login')
		else {
			checkToken()
		}
	})

	return (
		<>
			{username !== '' ? (
				<Main username={username} />
			) : (
				<div>
					<h1>Wating...</h1>
				</div>
			)}
		</>
	)
}

export default Index
