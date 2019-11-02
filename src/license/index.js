const Joi = require('@hapi/joi')

const { Create, GetAll } = require('./license')

const License = server => {
	server.route({
		method: 'POST',
		path: '/license',
		handler: (req, res) => {
			return Create(req.payload, res)
		},
		options: {
			description: 'Creates a license',
			notes: ['201', '500'],
			tags: ['api'],
			validate: {
				payload: {
					software: Joi.string()
						.required()
						.description('the software for the license item'),
					type: Joi.string()
						.required()
						.description('the type for the license item'),
					serialNumber: Joi.string()
						.required()
						.description('the serial number for the license item'),
					price: Joi.string()
						.required()
						.description('the price for the license item')
				}
			}
		}
	})

	server.route({
		method: 'GET',
		path: '/license',
		handler: (req, res) => GetAll(res),
		options: {
			description: 'Gets the all licenses',
			notes: 'Returns a task item by the id',
			tags: ['api']
		}
	})
}

module.exports = License
