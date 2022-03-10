const webpack = require("webpack-stream"),
			{ wrapper } = require("../common")

const config = require("./config")

module.exports = (file = null, mode = process.env.NODE_ENV) => {
	return wrapper("src/js", ["js"], (smc, stream) => {
		return stream()
			.pipe( smc.init() )
			.pipe( webpack( config({ mode }) ) )
			.pipe( smc.write() )
	}, file)
}