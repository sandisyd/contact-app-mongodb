const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/uda');



// //menambah satu data

// const contact1 = new Contact({
//     nama: "Dwi Sandi Y",
//     noHp: "0813627453829",
//     email: "dsandi@mail.com"
// });

// //Simpan ke collection

// contact1.save().then((result) => { console.log(result) })