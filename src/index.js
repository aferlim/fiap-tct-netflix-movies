const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')

const chalk = require('./chalk')
const connect = require('./mongoClient')
const config = require('./config')
const license = require('./license/index')

const server = Hapi.server({
	port: config.PORT,
	host: process.env.HOST || '0.0.0.0'
})

const start = async srv => {
	const swaggerOptions = {
		info: {
			title: 'Rate Movies API Documentation',
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

	await srv.start()
	chalk.info(`Server running on ${srv.info.uri}`)
}

process.on('unhandledRejection', err => {
	chalk.error(err)
	process.exit(1)
})

const startupError = err => {
	chalk.error('🚨 Error bootstrapping app!', err)
}

connect(
	config.MONGO_CONNECTION_STRING,
	chalk
)
	.then(() => {
		start(server)
		license(server)
	})
	.catch(startupError)
