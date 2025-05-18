const express = require('express')
const app = express()
const port = 8000
const cors = require('cors')
const bodyParser = require('body-parser')
const db=require('./utils/db')
const dotenv = require('dotenv')
const phonebookRouter = require('./routes/PhonebookRouter')
dotenv.config()
db()
const corsOptions = {
  origin:"*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/phonebook', phonebookRouter)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})