const Joi = require('@hapi/joi')
const { Request, Response } = require('./validation_schema')

const {
	Create,
	GetAll,
	GetByGenre,
	GetByTag,
	GetMostWatchedByGenre,
	UpdateRate
} = require('./movie')

const Movie = server => {
	server.route({
		method: 'POST',
		path: '/movie',
		handler: async (req, res) => {
			return await Create(req.payload, res)
		},
		options: {
			description: 'Creating a Movie',
			notes: ['201', '500', '400'],
			tags: ['api', 'movie'],
			response: {
				status: {
					201: {},
					400: Joi.string().label('Bad Request'),
					502: Joi.string().label('Bad Gateway')
				}
			},
			validate: {
				payload: Request
			}
		}
	})

	server.route({
		method: 'GET',
		path: '/movie',
		handler: (req, res) => GetAll(res),
		options: {
			description: 'Gets all movies',
			notes: 'Gets all the movies',
			tags: ['api', 'movie', 'all movies'],
			response: {
				schema: Joi.array()
					.items(Response)
					.label('Movies'),
				failAction: 'ignore',
				status: {
					400: Joi.string().label('Bad Request'),
					502: Joi.string().label('Bad Gateway')
				}
			}
		}
	})

	server.route({
		method: 'GET',
		path: '/movie/getByTag/{tag}',
		handler: (req, res) => GetByTag(res, req.params.tag),
		options: {
			description: 'Gets movies by tag',
			notes: 'Returns movies by tag',
			tags: ['api', 'movie', 'tags', 'tag'],
			validate: {
				params: {
					tag: Joi.string()
						.required()
						.description('the tag name')
				}
			},
			response: {
				schema: Joi.array()
					.items(Response)
					.label('Movies'),
				failAction: 'ignore',
				status: {
					200: Joi.array()
						.items(Response)
						.label('Movies'),
					404: Joi.string().label('Not Found'),
					502: Joi.string().label('Bad Gateway')
				}
			}
		}
	})

	server.route({
		method: 'GET',
		path: '/movie/byGenre/{genre}',
		handler: (req, res) => GetByGenre(res, req.params.genre),
		options: {
			description: 'Gets movies by genre',
			notes: 'Returns movies by genre',
			tags: ['api', 'movie', 'genres', 'genre'],
			validate: {
				params: {
					genre: Joi.string()
						.required()
						.description('the tag name')
				}
			},
			response: {
				schema: Joi.array()
					.items(Response)
					.label('Movies'),
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
		path: '/movie/mostByGenre/{genre}',
		handler: (req, res) => GetMostWatchedByGenre(res, req.params.genre),
		options: {
			description: 'Gets most watched movies by genre',
			notes: 'Returns most watched movies by genre',
			tags: ['api', 'movie', 'genres', 'genre'],
			validate: {
				params: {
					genre: Joi.string()
						.required()
						.description('the genre name')
				}
			},
			response: {
				schema: Joi.array()
					.items(Response)
					.label('Movies'),
				failAction: 'ignore',
				status: {
					404: Joi.string().label('Not Found'),
					502: Joi.string().label('Bad Gateway')
				}
			}
		}
	})

	server.route({
		method: 'PUT',
		path: '/movie/rate',
		handler: async (req, res) => {
			return await UpdateRate(req.payload, res)
		},
		options: {
			description: 'Rate the Movie',
			notes: ['204', '502', '404'],
			tags: ['api', 'movie', 'rate'],
			validate: {
				payload: {
					movieId: Joi.number()
						.required()
						.description('the movie id'),
					user: Joi.string()
						.required()
						.description('the user name'),
					rate: Joi.number()
						.min(1)
						.max(5)
						.required()
						.description('the rate number 1 to 5')
				}
			},
			response: {
				status: {
					204: Joi.string().label('Success'),
					404: Joi.string().label('Not Found'),
					502: Joi.string().label('Bad Gateway')
				}
			}
		}
	})
}

module.exports = Movie
