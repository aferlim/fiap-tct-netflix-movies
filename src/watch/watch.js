const errorFactory = require('error-factory')

const Joi = require('@hapi/joi')
const { Request } = require('./validation_schema')

const Watch = require('./schema')

//Deveria ser por domain notification, mas estamos sem tempo
const Movie = require('../movies/schema')

const {
	noContent,
	ok,
	badRequestWithMessage,
	badGatewayWithMessage,
	notFound
} = require('../response')

const WatchError = errorFactory('InvalidWatch', [
	('message', 'details', 'annotate', '_object')
])

const ValidateWatch = watch => {
	const { error, value } = Joi.validate(watch, Request)

	if (error) {
		const { message, details, annotate } = error
		throw WatchError(message, details, annotate)
	}

	if (watch == null) throw WatchError('invalid request', '', '')

	return value
}

const Update = async (watch, res) => {
	try {
		let valid = ValidateWatch(watch)

		let query = { movieId: watch.movieId, user: watch.user }
		let up = { $inc: { watches: 1 } }
		let options = { upsert: true }

		let result = await Watch.findOneAndUpdate(query, up, options)
		console.log(result)

		result = await Movie.findOneAndUpdate({ movieId: watch.movieId }, up)
		console.log(result)

		console.log(valid)

		return noContent(res)
	} catch (error) {
		console.log(error)

		if (error instanceof WatchError) {
			return badRequestWithMessage(res, `${error.message} - ${error._object}`)
		} else {
			return badGatewayWithMessage(res, 'badGateway')
		}
	}
}

const GetAll = res => {
	return Watch.find({})
		.then(data => {
			if (data.length <= 0) {
				return notFound(res)
			}

			return ok(res, data)
		})
		.catch(err => {
			console.log(err)
			return badGatewayWithMessage(res, 'badGateway')
		})
}

const GetByUser = (res, user) => {
	return Watch.find({ user: user })
		.populate('movie')
		.then(data => ok(res, data))
		.catch(err => {
			console.log(err)
			return badGatewayWithMessage(res, 'badGateway')
		})
}

module.exports = { Update, GetAll, GetByUser }
