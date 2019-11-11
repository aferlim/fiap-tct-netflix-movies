const Joi = require('@hapi/joi')

const Response = Joi.object()
	.keys({
		_id: Joi.string(),
		movieId: Joi.number(),
		name: Joi.string(),
		description: Joi.string(),
		genre: Joi.string(),
		watches: Joi.number(),
		tags: Joi.array().items(Joi.string()),
		date: Joi.date(),
		sinopse: Joi.string(),
		releaseYear: Joi.number(),
		rate: Joi.object().keys({
			one: Joi.number(),
			two: Joi.number(),
			three: Joi.number(),
			four: Joi.number(),
			five: Joi.number()
		}),
		__v: Joi.number()
	})
	.label('MovieResponse')

const Request = Joi.object()
	.keys({
		name: Joi.string()
			.required()
			.description('the movie name'),
		description: Joi.string()
			.required()
			.description('the movie description'),
		genre: Joi.string()
			.required()
			.description('the genre movie name'),
		tags: Joi.array()
			.items(Joi.string())
			.description('Movie tags list'),
		sinopse: Joi.string()
			.required()
			.description('the movie sinopse'),
		releaseYear: Joi.number()
			.required()
			.description('the movie release year')
	})
	.label('MovieRequest')

module.exports = { Request, Response }
