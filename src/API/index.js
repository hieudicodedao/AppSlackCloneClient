export const FETCH_POST = (URL, body) => {
	return fetch(URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})
}

export const FETCH_GET = (URL) => {
	return fetch(URL, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
}
