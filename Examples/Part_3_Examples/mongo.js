const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const url =
    `mongodb+srv://Omar:${password}@testcluster1.tgoev.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
});

const Note = mongoose.model('Note', noteSchema);

// const note = new Note({
//     content: 'HTML is easy',
//     date: new Date(),
//     important: true,
// });

// note.save().then(res => {
//     console.log('note saved!');
//     mongoose.connection.close();
// });

Note.find({}).then(res => {
    res.forEach(note => {
        console.log(note);
    });
    mongoose.connection.close();
});
