require('module-alias/register')
require("dotenv").config()

// Очищаем коноль при (пере)запуске
console.clear()

const express = require("express"),
			cookieParser = require("cookie-parser")

const app = express()

app.use( express.json() )
app.use( express.urlencoded({ extended: true }) )
app.use( cookieParser() )

app.set("views", "views")
app.set("view engine", "pug")

app.use( express.static("public") )

app.get("/", (req, res) => res.send("Express.js + GULP web app"))

const port = process.env.PORT || 3000
app.listen(port, () => console.log("App successfully running on:", port))