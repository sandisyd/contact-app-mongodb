const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db'); //require database
const Contact = require('./model/contact'); //require schema

const app = express();
const port = 3000;

//Setup method override
app.use(methodOverride('_method'));

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

//routes tambah data
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main'
    })
});

//proses tambah data contact
app.post('/contact', [
    body('nama').custom(async (value) => {
        const duplicate = await Contact.findOne({ nama: value })
        if (duplicate) {
            throw Error('Nama contact sudah ada')
        }
        return true
    }),
    check('email', 'Email salah').isEmail(), check('noHp', 'Nomor Handphone salah').isMobilePhone('id-ID')], (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            res.render('add-contact', {
                title: 'Form Tambah Data Contact',
                layout: 'layouts/main',
                errors: errors.array()
            })
        } else {
            // addContact(req.body)
            Contact.insertMany(req.body, (error, result) => {
                //kirimkan flash message
                req.flash('msg', 'Data contact berhasi ditambahkan!')
                res.redirect('/contact')
            })

        }

        // console.log(req.body)
        // res.send('Data berhasil dikirim')

    });

//Proses delete contact
// app.get('/contact/delete/:nama', async (req, res) => {
//     const contact = await Contact.findOne({nama: req.params.nama})

//     // Jika kontak tidak ada
//     if (!contact) {
//         res.status(404)
//         res.send('<h1>404</h1>')
//     } else {
//         // deleteContact(req.params.nama)
//         Contact.deleteOne({_id: contact._id}).then((result)=>{
//          req.flash('msg', 'Data contact berhasi dihapus.')
//         res.redirect('/contact')   
//         })

//     }
// });

app.delete('/contact', (req, res) => {
    // res.send(req.body);
    Contact.deleteOne({ nama: req.body.nama }).then((result) => {
        req.flash('msg', 'Data contact berhasi dihapus.')
        res.redirect('/contact')
    })
});


//halaman edit contact
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });
    res.render('edit-contact', {
        title: 'Form Ubah Data Contact',
        layout: 'layouts/main',
        contact
    })
});

//prosses ubah data
app.put('/contact', [
    body('nama').custom(async (value, { req }) => {
        const duplicate = await Contact.findOne({ nama: value });
        if (value !== req.body.oldNama && duplicate) {
            throw Error('Nama contact sudah ada')
        }
        return true
    }),
    check('email', 'Email salah').isEmail(), check('noHp', 'Nomor Handphone salah').isMobilePhone('id-ID')], (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            res.render('edit-contact', {
                title: 'Form Ubah Data Contact',
                layout: 'layouts/main',
                errors: errors.array(),
                contact: req.body
            })
        } else {

            Contact.updateOne({
                _id: req.body._id
            }, {
                $set: {
                    nama: req.body.nama,
                    email: req.body.email,
                    noHp: req.body.noHp
                }
            }).then((result) => {
                //kirimkan flash message
                req.flash('msg', 'Data contact berhasil diubah!')
                res.redirect('/contact')
            });

        }

        // console.log(req.body)
        // res.send('Data berhasil dikirim')

    });

//detail contact
app.get('/contact/:nama', async (req, res) => {
    // const contact = findContact(req.params.nama)
    const contact = await Contact.findOne({ nama: req.params.nama })
    // console.log(detail)
    res.render('detail', {
        layout: 'layouts/main',
        title: 'Halaman Detail Contact',
        contact
    })
})



app.listen(port, () => {
    console.log(`Mongo Contact App | listening at http://localhost:${port}`)


});