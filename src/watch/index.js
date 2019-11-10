const Joi = require('@hapi/joi')

const { Update, GetAll, GetByUser } = require('./watch')

const MovieSchema = require('../movies/validation_schema')
const WatchedSchema = require('./validation_schema')

const Watch = (server, kafka) => {
	server.route({
		method: 'PUT',
		path: '/watch',
		handler: async (req, res) => {
			return await Update(kafka)(req.payload, res)
		},
		options: {
			description: 'Watch a Movie',
			notes: ['201', '500'],
			tags: ['movie', 'watch'],
			validate: {
				payload: {
					movieId: Joi.number()
						.required()
						.description('the movie id'),
					user: Joi.string()
						.required()
						.description('the user name')
				}
			},
			response: {
				status: {
					201: {
						description: 'Create successful'
					},
					400: {
						description: 'Something wrong happened in validation',
						schema: Joi.string().label('message')
					},
					502: {
						description: 'bad gateway'
					}
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
			tags: ['movie', 'all watches'],
			response: {
				status: {
					200: {
						description: 'Success',
						schema: Joi.array()
							.items({
								...WatchedSchema,
								movie: MovieSchema
							})
							.label('Movies Watched')
					},
					404: {
						description: 'Not Found'
					},
					502: {
						description: 'bad gateway'
					}
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
			tags: ['movie', 'watches', 'user'],
			validate: {
				params: {
					user: Joi.string()
						.required()
						.description('the user name')
				}
			},
			response: {
				status: {
					200: {
						description: 'Success',
						schema: Joi.array()
							.items({
								...WatchedSchema,
								movie: MovieSchema
							})
							.label('Movies Watched')
					},
					404: {
						description: 'Not Found'
					},
					502: {
						description: 'bad gateway'
					}
				}
			}
		}
	})
}

module.exports = Watch
