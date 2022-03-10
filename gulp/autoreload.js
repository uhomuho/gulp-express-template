const gulp = require("gulp"),
			argv = require("yargs").argv,
			spawn = require("cross-spawn-with-kill")

let p
let reload = async cb => {
	// Убираем процесс, если он есть
	if(p) {
		await p.kill()
		console.clear()
	}

	// Добавляем дочерний процесс
	p = await spawn('gulp', [ argv.task ], { stdio: 'inherit', env: { ...process.env, RESTART: !!p } });

	if (cb) cb()
}
// Присваиваем процессу имя
reload.displayName = "Restarting watch"

module.exports = () => {
	// При добавлении или удалении файла, перезапускаем наблюдение за изменениями в проекте
	const folders = [
		"src/js/*.js",
		"src/img/*",
		"src/scss/*.scss"
	]
	gulp.watch(folders, { events: ['add', 'unlink'] }, gulp.series( reload ))
	gulp.watch("gulp/**/**/**/*", gulp.series( reload ))
	
	reload()
}