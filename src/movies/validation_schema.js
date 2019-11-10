const Joi = require('@hapi/joi')

module.exports = Joi.object().keys({
	movieId: Joi.number().required(),
	name: Joi.string().required(),
	description: Joi.string().required(),
	genre: Joi.string().required(),
	watches: Joi.number(),
	tags: Joi.array().items(Joi.string()),
	date: Joi.date(),
	sinopse: Joi.string().required(),
	releaseYear: Joi.number().required()
})
