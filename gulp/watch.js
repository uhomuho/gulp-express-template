const { watch } = require("gulp"),
			browserSync = require("browser-sync")

const webpack = require("./webpack"),
			scss = require("./scss"),
			img = require("./img"),
			{ generateWatch } = require("./common")

module.exports = () => {
	
	// Делаем прокси для автоматической перезагрузки страниц
	browserSync.init({
		port: process.env.PORT ? parseInt(process.env.PORT) + 1 : 3001,
		proxy: `http://localhost:${process.env.PORT || 3000}`,
		open: process.env.RESTART == "false"
	})

	watch("public/**/**/**/**/**/*").on("change", browserSync.reload)

	// При изменении шаблонов страниц, перезагружаем окно браузера
	watch("views/**/**/**/**/*.pug").on("change", browserSync.reload)

	// При изменении файлов js запускаем сборку js
	generateWatch("js", webpack)

	// При изменении файлов scss запускаем сборку css
	generateWatch("scss", scss)

	// При изменении картиночек, минифицируем и конвертируем их в webp
	watch("src/img/*", img())
}