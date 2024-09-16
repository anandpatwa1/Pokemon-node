const express = require('express');
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require('./db/db');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/images', express.static('images'));

const PORT = process.env.PORT || 7000

connectDB()

app.use('/buyer', require('./Routes/index') )

app.use('/api', require('./Routes/index') )


app.get('/', (req, res) => {
    res.send('Welcome to the server')
})

app.listen(PORT, () =>{
    console.log(`app is running on ${PORT}`);
})