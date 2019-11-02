const errorFactory = require('error-factory')

const Joi = require('@hapi/joi')
const Schema = require('./schema')

const { created, ok, badRequestWithMessage } = require('../response')

const LicenseError = errorFactory('InvalidMessage', [
	('message', 'details', 'annotate', '_object')
])

const _validateLicense = license => {
	const { error, value } = Joi.validate(license, Schema)

	if (error) {
		const { message, details, annotate } = error
		throw LicenseError(message, details, annotate)
	}

	if (license == null) throw LicenseError('invalid request', '', '')

	return value
}

const Create = (license, res) => {
	try {
		let valid = _validateLicense(license)

		DataTemp.push(valid)

		console.log(valid)

		return created(res)
	} catch (error) {
		badRequestWithMessage(res, error)
	}
}

const GetAll = res => {
	return ok(res, DataTemp)
}

module.exports = { Create, GetAll }

const DataTemp = []
