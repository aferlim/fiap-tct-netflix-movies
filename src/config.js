module.exports = {
	PORT: process.env.PORT || 3000,
	MONGO_CONNECTION_STRING:
		process.env.MONGO_CONNECTION_STRING ||
		'mongodb://rating:asdf123@ds141188.mlab.com:41188/rating_netflix_tcd'
}
