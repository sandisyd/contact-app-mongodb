const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('./utils/db'); //require database
const Contact = require('./model/contact'); //require schema

const app = express();
const port = 3000;



//setup ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


//konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}

));

app.use(flash());
//Halaman Home
app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama: 'Dwi Sandi',
            email: 'sandi@mail.com'
        },
        {
            nama: 'Achmad',
            email: 'achmad@mail.com'
        },
        {
            nama: 'Bambang P',
            email: 'bamp@mail.com'
        },
    ]
    res.render('index', { nama: 'Sandi YS', layout: 'layouts/main', title: 'Page Home', mahasiswa })
});

//Halaman about
app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main',
        title: 'Halaman About'
    })

});

//Halaman contact
app.get('/contact', async (req, res) => {
    const contacts = await Contact.find()
    console.log(contacts)
    res.render('contact', {
        layout: 'layouts/main',
        title: 'Halaman contact',
        contacts,
        msg: req.flash('msg')
    })
});

//detail contact
app.get('/contact/:nama', async (req, res) => {
    // const contact = findContact(req.params.nama)
    const contact = await Contact.findOne({nama: req.params.nama})
    // console.log(detail)
    res.render('detail', {
        layout: 'layouts/main',
        title: 'Halaman Detail Contact',
        contact
    })
})



app.listen(port, ()=>{
    console.log(`Mongo Contact App | listening at http://localhost:${port}`)


});