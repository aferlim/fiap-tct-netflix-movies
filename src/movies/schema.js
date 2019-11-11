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

var Counter = mongoose.model('counter', CounterSchema, 'counter')

movieSchema.pre('save', function(next) {
	var doc = this
	Counter.findByIdAndUpdate(
		{ _id: 'movieId' },
		{ $inc: { seq: 1 } },
		{ upsert: true },
		function(error, counter) {
			if (error) return next(error)

			if (!counter) {
				Counter.create({ _id: 'movieId', seq: 1 }, function(err) {
					if (err) return next(err)
					// saved!
					doc.movieId = 1
				})
			} else {
				doc.movieId = counter.seq
			}
			next()
		}
	)
})

movieSchema.index({ movieId: 1 }, { unique: true })
movieSchema.index({ releaseYear: -1, tags: 1 })
movieSchema.index({ releaseYear: -1, genre: 1, watches: -1 })

module.exports = mongoose.model('movie', movieSchema)
