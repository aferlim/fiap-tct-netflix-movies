const Joi = require('@hapi/joi')
const MovieSchema = require('./validation_schema')

const {
	Create,
	GetAll,
	GetByGenre,
	GetByTag,
	GetMostWatchedByGenre,
	UpdateRate
} = require('./movie')

const Movie = (server, kafka) => {
	server.route({
		method: 'POST',
		path: '/movie',
		handler: async (req, res) => {
			return await Create(kafka)(req.payload, res)
		},
		options: {
			description: 'Creating a Movie',
			notes: ['201', '500', '400'],
			tags: ['movie'],
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
			},
			validate: {
				payload: {
					movieId: Joi.number()
						.required()
						.description('the movie id'),
					name: Joi.string()
						.required()
						.description('the movie name'),
					description: Joi.string()
						.required()
						.description('the movie description'),
					sinopse: Joi.string()
						.required()
						.description('the movie description'),
					releaseYear: Joi.number()
						.required()
						.description('the movie release year'),
					genre: Joi.string()
						.required()
						.description('the genre movie name'),
					tags: Joi.array()
						.items(Joi.string())
						.description('Movie tags list')
				}
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
			tags: ['movie', 'all movies'],
			response: {
				status: {
					200: {
						description: 'Success',
						schema: Joi.array()
							.items(MovieSchema)
							.label('Movies')
					},
					400: {
						description: 'Something wrong happened in validation',
						schema: Joi.string().label('error description')
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
		path: '/movie/getByTag/{tag}',
		handler: (req, res) => GetByTag(res, req.params.g),
		options: {
			description: 'Gets movies by tag',
			notes: 'Returns movies by tag',
			tags: ['movie', 'tags', 'tag'],
			validate: {
				params: {
					tag: Joi.string()
						.required()
						.description('the tag name')
				}
			},
			response: {
				status: {
					200: {
						description: 'Success',
						schema: Joi.array()
							.items(MovieSchema)
							.label('Movies')
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
		path: '/movie/byGenre/{genre}',
		handler: (req, res) => GetByGenre(res, req.params.genre),
		options: {
			description: 'Gets movies by genre',
			notes: 'Returns movies by genre',
			tags: ['movie', 'genres', 'genre'],
			validate: {
				params: {
					genre: Joi.string()
						.required()
						.description('the tag name')
				}
			},
			response: {
				status: {
					200: {
						description: 'Success',
						schema: Joi.array()
							.items(MovieSchema)
							.label('Movies')
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
		path: '/movie/mostByGenre/{genre}',
		handler: (req, res) => GetMostWatchedByGenre(res, req.params.genre),
		options: {
			description: 'Gets most watched movies by genre',
			notes: 'Returns most watched movies by genre',
			tags: ['movie', 'genres', 'genre'],
			validate: {
				params: {
					genre: Joi.string()
						.required()
						.description('the genre name')
				}
			},
			response: {
				status: {
					200: {
						description: 'Success',
						schema: Joi.array()
							.items(MovieSchema)
							.label('Movies')
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
		method: 'PUT',
		path: '/movie/rate',
		handler: async (req, res) => {
			return await UpdateRate(req.payload, res)
		},
		options: {
			description: 'Rate the Movie',
			notes: ['204', '502', '404'],
			tags: ['movie', 'rate'],
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
					204: {
						description: 'Success'
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

module.exports = Movie
