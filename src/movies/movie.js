const errorFactory = require('error-factory')

const Joi = require('@hapi/joi')
const ValidationSchema = require('./validation_schema')

const MomentBrazil = require('moment-timezone')

const Movie = require('./schema')

const {
	created,
	ok,
	badRequestWithMessage,
	noContent,
	badGatewayWithMessage,
	notFound
} = require('../response')

const MovieCreateError = errorFactory('InvalidMovie', [
	('message', 'details', 'annotate', '_object')
])

const ValidateMovie = movie => {
	const { error, value } = Joi.validate(movie, ValidationSchema)

	if (error) {
		const { message, details, annotate } = error
		throw MovieCreateError(message, details, annotate)
	}

	if (movie == null) throw MovieCreateError('invalid request', '', '')

	return value
}

const Create = async (movie, res) => {
	try {
		let valid = ValidateMovie(movie)

		let movieSave = new Movie({
			...movie,
			date: MomentBrazil.tz('America/Sao_Paulo').format()
		})

		var result = await movieSave.save()

		console.log(valid)
		console.log(result)

		return created(res)
	} catch (error) {
		console.log(error)

		if (error instanceof MovieCreateError) {
			return badRequestWithMessage(res, 'Invalid create')
		} else {
			return badGatewayWithMessage(res, 'badGateway')
		}
	}
}

const GetAll = res => {
	return Movie.findAll({})
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

const GetByGenre = (res, genre) => {
	return Movie.find({ genre: genre })
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

const GetByTag = (res, tag) => {
	return Movie.find({ tags: { $all: [tag] } })
		.sort({ releaseYear: -1, watches: -1 })
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

const GetMostWatchedByGenre = (res, genre) => {
	return Movie.find({ genre: { $all: [genre] } })
		.sort({ watches: -1, releaseYear: -1 })
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

const UpdateRate = async (rate, res) => {
	try {
		let query = { movieId: rate.movieId, user: rate.user }

		let rate = {}

		switch (rate.rate) {
		case 1:
			rate = { one: { $inc: 1 } }
			break
		case 2:
			rate = { two: { $inc: 1 } }
			break
		case 3:
			rate = { three: { $inc: 1 } }
			break
		case 4:
			rate = { four: { $inc: 1 } }
			break
		default:
			rate = { five: { $inc: 1 } }
			break
		}

		let up = { rate }

		let result = await Movie.findOneAndUpdate(query, up, { upsert: false })

		console.log(result)

		return noContent(res)
	} catch (error) {
		console.log(error)

		return badGatewayWithMessage(res, 'badGateway')
	}
}

module.exports = {
	Create,
	GetAll,
	GetByGenre,
	GetByTag,
	GetMostWatchedByGenre,
	UpdateRate
}
