const fs = require("fs/promises"),
			through = require("through2"),
			path = require("path")

module.exports = class SourceMapController {
	#source_ext
	#chunk_ext
	#source
	#chunk
	#sourceMap
	chunkDest

	constructor(source_ext, chunk_ext) {
		this.#source_ext = source_ext
		this.#chunk_ext = chunk_ext || source_ext

		this.chunkDest = `./public/${this.#chunk_ext}`
	}

	#getFileName(File, ext = this.#source_ext) {
		const filePath = File.path
		const pathArray = filePath.split("\\")
		return pathArray[pathArray.length - 1].replace(`.${ext}`, "")
	}

	#updateSourceMap() {
		try {
			this.#sourceMap = require("../../sourcemap.json")
		} catch {
			this.#sourceMap = {}
		}
	}

	init() {
		return through.obj((file, enc, cb) => {
			this.#source = this.#getFileName(file)
			
			cb(null, file)
		})
	}

	write() {
		return through.obj(async (file, enc, cb) => {
			this.#chunk = this.#getFileName(file, this.#chunk_ext)
			
			this.#updateSourceMap()
	
			if (!this.#sourceMap[this.#chunk_ext])
				this.#sourceMap[this.#chunk_ext] = {}

			if (this.#sourceMap[this.#chunk_ext][this.#source])
				await fs.unlink(path.join(__dirname, "..", "..", "public", this.#chunk_ext, `${this.#sourceMap[this.#chunk_ext][this.#source]}.${this.#chunk_ext}`))
					.catch(console.error)
	
			this.#sourceMap[this.#chunk_ext][this.#source] = this.#chunk
			
			await fs.writeFile(path.join(__dirname, "..", "..", "sourcemap.json"), JSON.stringify(this.#sourceMap))
				.catch(console.error)
	
			cb(null, file)
		})
	}
}