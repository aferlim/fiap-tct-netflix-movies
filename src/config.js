module.exports = {
	PORT: process.env.PORT || 3000,
	MONGO_CONNECTION_STRING:
		process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/rating'
}
