const { wrapper } = require("./common"),
			minify = require("gulp-imagemin"),
			webp = require("gulp-webp")

module.exports = (file = null) => {
	return wrapper("src/img", ["img"], (smc, stream) => {
		return stream()
			.pipe( minify() )
			.pipe( webp() )
	}, file)
}