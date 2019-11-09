const Home = server => {
	server.route({
		method: 'GET',
		path: '/',
		handler: () => {
			return { hello: 'world' }
		}
		// options: {
		// 	description: 'Rate Index',
		// 	notes: '',
		// 	tags: ['index', 'api']
		// }
	})
}

module.exports = Home
