const express = require("express")
const genres = require('./router/genres')
const customers = require('./router/customers')
const movies = require('./router/movies')
const rentals = require('./router/rentals') 
const users = require('./router/users')
const auth = require('./router/auth')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err))

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)

const port = process.env.PORT || 2000
app.listen(port, () => {
  console.log(`server listening at port http://localhost:${port}`)
})