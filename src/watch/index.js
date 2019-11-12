const Joi = require('@hapi/joi')

const { Update, GetAll, GetByUser } = require('./watch')

const { Request, Response } = require('./validation_schema')

const Watch = server => {
	server.route({
		method: 'PUT',
		path: '/watch',
		handler: async (req, res) => {
			return await Update(req.payload, res)
		},
		options: {
			description: 'Watch a Movie',
			notes: ['201', '500'],
			tags: ['api', 'watch'],
			validate: {
				payload: Request
			},
			response: {
				status: {
					204: {},
					400: Joi.string().label('Bad Request'),
					502: Joi.string().label('Bad Gateway')
				}
			}
		}
	})

	server.route({
		method: 'GET',
		path: '/watch',
		handler: (req, res) => GetAll(res),
		options: {
			description: 'Gets all watches',
			notes: 'Gets all the watches',
			tags: ['api', 'movie', 'all watches'],
			response: {
				schema: Joi.array()
					.items(Response)
					.label('Watches'),
				failAction: 'ignore',
				status: {
					404: Joi.string().label('Not Found'),
					502: Joi.string().label('Bad Gateway')
				}
			}
		}
	})

	server.route({
		method: 'GET',
		path: '/watch/{user}',
		handler: (req, res) => GetByUser(res, req.params.user),
		options: {
			description: 'Gets watches by user',
			notes: 'Returns watches by user',
			tags: ['api', 'movie', 'watches', 'user'],
			validate: {
				params: {
					user: Joi.string()
						.required()
						.description('the user name')
				}
			},
			response: {
				schema: Joi.array()
					.items(Response)
					.label('Watches'),
				failAction: 'ignore',
				status: {
					404: Joi.string().label('Not Found'),
					502: Joi.string().label('Bad Gateway')
				}
			}
		}
	})
}

module.exports = Watch
