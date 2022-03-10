module.exports = (params = {}) => {
	const config = { stats: "errors-only", output: { filename: "[contenthash].js" } }

	Object.keys(params).forEach(prop => config[prop] = params[prop])

	return config
}