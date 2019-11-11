const Home = server => {
	server.route({
		method: 'GET',
		path: '/',
		handler: () => {
			return { hello: 'world' }
		}
	})
}

module.exports = Home
