const Joi = require('@hapi/joi')

module.exports = Joi.object().keys({
	software: Joi.string().required(),
	type: Joi.string().required(),
	serialNumber: Joi.string().required(),
	price: Joi.number().required()
})
