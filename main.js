const database = require('./database')
database.connect()

const bodyParser = require("body-parser")
const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors())

require('dotenv').config()

const register = require('./routes/register')
app.use("/register", register)

const login = require('./routes/login')
app.use("/login", login)

const stratRoute = require('./routes/strat')
app.use("/strat", stratRoute)

app.use(express.static('public'));

//on / serve index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(port, () => {

    console.log(`Example app listening on port ${port}`)
})