const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
// const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lmoae.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(fileUpload());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const apartmentCollection = client.db("apartmentHunt").collection("apartments");

    app.post('/addApartment', (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const price = req.body.price;

        const newImg = file.data;
        const encImg = newImg.toString('base64');

        const picture = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        apartmentCollection.insertOne({title, price, picture})
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/apartments', (req, res) => {
        apartmentCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

});


app.listen(process.env.PORT || 4000)