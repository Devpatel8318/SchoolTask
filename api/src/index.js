const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { connectToDb, getDb } = require('./connection/db')
const student = require('./routers/student')
const subject = require('./routers/subject')
const result = require('./routers/result')

dotenv.config()
const app = express()
const port = process.env.PORT || 8000

//middleware
app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    })
)
app.use(express.json())

//connection
let db
connectToDb((err) => {
    if (err) return console.log(err)

    app.listen(port, () => console.log('Server is up on port ' + port))

    db = getDb()
    app.use(student(db))
    app.use(subject(db))
    app.use(result(db))
})
