const express = require('express')
const app = express()
const peopleRouter = require('./routes/peopleroutes')

app.use(express.json())

app.use('/api/persone', peopleRouter)


app.listen(3000)