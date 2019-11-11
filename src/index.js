const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')

const chalk = require('./chalk')
const connect = require('./mongoClient')
const { PORT, MONGO_CONNECTION_STRING } = require('./config')

const Home = require('./home')
const Movie = require('./movies')
const Watch = require('./watch')

const Start = async () => {
	const server = await new Hapi.server({
		port: PORT,
		host: process.env.HOST || '0.0.0.0'
	})

	const swaggerOptions = {
		info: {
			title: 'Movies API Documentation',
			version: '1'
		}
	}

	await server.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: swaggerOptions
		}
	])

	try {
		await server.start()
		chalk.info(`Server running on ${server.info.uri}`)
	} catch (error) {
		chalk.info(error)
	}

	return server
}

process.on('unhandledRejection', err => {
	chalk.error(err)
	process.exit(1)
})

const startupError = err => {
	chalk.error('🚨 Error bootstrapping app!', err)
}

connect(
	MONGO_CONNECTION_STRING,
	chalk
)
	.then(async () => {
		let srv = await Start()

		Home(srv)

		Movie(srv)

		Watch(srv)
	})
	.catch(startupError)
