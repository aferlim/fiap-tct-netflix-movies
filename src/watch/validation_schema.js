const Joi = require('@hapi/joi')

const { Response } = require('../movies/validation_schema')

const ResponseWatch = Joi.object()
	.keys({
		movieId: Joi.number().required(),
		user: Joi.string().required(),
		watches: Joi.number(),
		movie: Response
	})
	.label('WatchedResponse')

const Request = Joi.object()
	.keys({
		movieId: Joi.number()
			.required()
			.description('the movie id'),
		user: Joi.string()
			.required()
			.description('the user name')
	})
	.label('WatchedRequest')

module.exports = { Request, Response: ResponseWatch }
