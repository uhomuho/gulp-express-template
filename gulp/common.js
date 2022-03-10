const gulp = require("gulp"),
			plumber = require("gulp-plumber"),
			browserSync = require("browser-sync"),
			fs = require("fs"),
			SourceMapController = require("./SourceMapController")

const { watch } = gulp

exports.getFiles = path => {
	const entries = fs.readdirSync(path, { withFileTypes: true })
	
	return entries.filter(item => item.isFile()).map(file => file.name)
}

exports.getDirs = path => {
	const entries = fs.readdirSync(path, { withFileTypes: true })

	return entries.filter(item => item.isDirectory()).map(folder => folder.name)
}

exports.generateWatch = (ext, fn) => {
	Promise.resolve( exports.getFiles(`src/${ext}`) )
		.then(files => {
			const dirs = exports.getDirs(`src/${ext}`)

			files.forEach(file => {
				watch(`src/${ext}/${file}`, fn(file))
				const dir = dirs.find(dir => dir == file.replace(`.${ext}`))

				if (dir)
					watch(`src/${ext}/${dir}/**/**/**/*`, fn(file))
			})
		})
}

exports.wrapper = (path, ext, handler, file) => {
	const fn = async cb => {
		const files = file ? [file] : exports.getFiles(path)
	
		const map = files.map(file => {
			const smc = new SourceMapController(...ext)
			return new Promise(resolve => {
				handler(
					smc,
					() => gulp.src(`./${path}/${file}`).pipe( plumber() ),
					file
				)
				.pipe( gulp.dest( smc.chunkDest ) )
				.on("finish", resolve)
			})
		})

		await Promise.all(map)

		cb()
	}

	fn.displayName = `Compile ${file || ext[0]}`
	return gulp.series(fn)
}