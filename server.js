const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Food = require('./models/food')

const app = express()
app.use(express.urlencoded({extended: false}));
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`connected to mongoDB ${mongoose.connection.name}`)
})

//app.get('/test', (req, res) => {
//    res.send('The server is running')
// })

app.get('/', async (req, res) => {
    res.render('index.ejs')
})

app.get('/foods', async (req, res) => {
    res.render('new.ejs')
})

app.post('/foods', async (req, res) => {
    if (req.body.order === 'on') {
        req.body.order = true;
    } else {
        req.body.order = false;
    }
    Food.create(req.body);
    console.log(req.body);
    res.redirect('/foods')
})

app.listen(3000, () => {
    console.log('listening to port 3000')
});