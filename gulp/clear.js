const fs = require("fs/promises")

const fn = async cb => {
	await new Promise(( resolve, reject ) => {
		["sourcemap.json", "public"].forEach(target => {
			return fs.rm(`./${target}`, { recursive: true, force: true })
				.then(resolve)
				.catch(reject)
		})
	})
	cb()
}

fn.displayName = "Clear old build files"

module.exports = fn