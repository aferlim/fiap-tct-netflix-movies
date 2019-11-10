const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
	movieId: {
		type: Number,
		required: true,
		ref: 'movie'
	},
	user: {
		type: String,
		required: true
	},
	watches: {
		type: Number,
		required: true,
		default: 0
	}
})

movieSchema.index({ movieId: 1, user: 1 }, { unique: true })

module.exports = mongoose.model('watch', movieSchema)
