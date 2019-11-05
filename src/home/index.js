const Home = server => {
	server.route({
		method: 'GET',
		path: '/',
		handler: (req, res) => res.response({ hello: 'world' }).code(200),
		options: {
			description: 'Rate Index',
			notes: '',
			tags: ['api']
		}
	})
}

module.exports = Home
