const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
dotenv.config();

const Food = require('./models/food')

const app = express()
app.use(express.urlencoded({extended: false}));
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`connected to mongoDB ${mongoose.connection.name}`)
})
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

//app.get('/test', (req, res) => {
//    res.send('The server is running')
// })

app.get('/', async (req, res) => {
    res.render('index.ejs')
})

app.get('/foods', async (req, res) => {
    const foods = await Food.find();
    res.render('index-foods.ejs', { foods });
});

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

app.post('/foods', async (req, res) => {
    req.body.order = req.body.order === 'on';
    await Food.create(req.body);
    res.redirect('/foods');
});

app.get('/foods/:id', async (req, res) => {
    const food = await Food.findById(req.params.id);
    res.render('show.ejs', { food });
});

app.get('/foods/:id/edit', async (req, res) => {
    const food = await Food.findById(req.params.id);
    res.render('edit.ejs', { food });
});

app.put('/foods/:id', async (req, res) => {
    req.body.order = req.body.order === 'on';
    await Food.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/foods/${req.params.id}`);
});

app.delete('/foods/:id', async (req, res) => {
    await Food.findByIdAndDelete(req.params.id);
    res.redirect('/foods');
});

app.listen(3000, () => {
    console.log('listening to port 3000')
});