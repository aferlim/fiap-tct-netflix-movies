const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
	movieId: Number,
	name: {
		type: String,
		required: true
	},
	description: String,
	sinopse: String,
	genre: {
		type: String,
		trim: true,
		index: true
	},
	watches: {
		type: Number,
		default: 0
	},
	tags: {
		type: [String],
		lowercase: true
	},
	releaseYear: {
		type: Number,
		required: true
	},
	date: { type: Date },
	rate: {
		one: { type: Number, default: 0 },
		two: { type: Number, default: 0 },
		three: { type: Number, default: 0 },
		four: { type: Number, default: 0 },
		five: { type: Number, default: 0 }
	}
})

var CounterSchema = mongoose.Schema({
	_id: { type: String, required: true },
	seq: { type: Number, default: 0 }
})

var counter = mongoose.model('counter', CounterSchema, 'movie_counter')

movieSchema.pre('save', function(next) {
	var doc = this
	counter.findByIdAndUpdate({ _id: 'entityId' }, { $inc: { seq: 1 } }, function(
		error,
		counter
	) {
		if (error) return next(error)
		doc.movieId = counter.seq
		next()
	})
})

movieSchema.index({ movieId: 1 }, { unique: true })
movieSchema.index({ releaseYear: -1, tags: 1 })
movieSchema.index({ releaseYear: -1, genre: 1, watches: -1 })

module.exports = mongoose.model('movie', movieSchema)
