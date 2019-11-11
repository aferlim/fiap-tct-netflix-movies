module.exports = {
	PORT: process.env.PORT || 3001,

	MONGO_CONNECTION_STRING:
		process.env.MONGO_CONNECTION_STRING ||
		'mongodb://movie:asdf123@ds263307.mlab.com:63307/movie_netflix_tcd'
}
