const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const cors = require('cors')
const scraper = require('./Scraper');
const Info = require('./models/Info')
const axios = require('axios');
require('dotenv').config();

app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json())

const infoRoute = require('./routes/info')

app.use('/info', infoRoute)


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})


app.get('/', async (req, res) => {

    res.send("at Home")

})


app.post('/', async (req, res) => {
    console.log(req.body)
})

mongoose.connect(
    process.env.DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log('Connected to DB'))
    .catch(err => {
        console.log('DBConnectionError');
        console.log(err);
    })


app.listen(port, (error) => {
    if (error) {
        throw error;
    }

    console.log(`Amazon app listening on port ${port}!`)
    
    scraper.startTracking();

    /*
    axios.get("http://localhost:5000/info")
        .then(res => {
            //console.log(res.data);
            console.log("retrieved information for scraper file");

            for(var i = 0; i < res.data.length; i++){
                scraper.startTracking(res.data[i]);
            }
        })
        .catch(err => console.log(err));
        */
    

   // scraper.startTracking(process.env.emailLogin, process.env.emailPassword);
})
