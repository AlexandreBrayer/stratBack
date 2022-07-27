require('dotenv').config()
const database = require('./database')
database.connect()

const bodyParser = require("body-parser")
const express = require('express')
const cors = require('cors');
const path = require('path')
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors())


const register = require('./routes/register')
app.use("/register", register)

const login = require('./routes/login')
app.use("/login", login)

const stratRoute = require('./routes/strat')
app.use("/strat", stratRoute)

const silverRoute = require('./routes/silver')
app.use("/silver", silverRoute)

app.use(express.static('public'));

app.route('/*')
    .get(function(req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    });

app.listen(port, () => {

    console.log(`Example app listening on port ${port}`)
})