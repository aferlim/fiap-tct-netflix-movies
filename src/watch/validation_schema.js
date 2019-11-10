const Joi = require('@hapi/joi')

module.exports = Joi.object().keys({
	movieId: Joi.number().required(),
	user: Joi.string().required(),
	watches: Joi.number()
})
