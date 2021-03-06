require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Note = require('./models/note');

app.use(express.json());
app.use(cors());
app.use(express.static('build'))

// let notes = [
//     {
//       id: 1,
//       content: "HTML is easy",
//       date: "2022-05-30T17:30:31.098Z",
//       important: true
//     },
//     {
//       id: 2,
//       content: "Browser can execute only Javascript",
//       date: "2022-05-30T18:39:34.091Z",
//       important: false
//     },
//     {
//       id: 3,
//       content: "GET and POST are the most important methods of HTTP protocol",
//       date: "2022-05-30T19:20:14.298Z",
//       important: true
//     }
// ];

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes);
    });
});

app.get('/api/notes/:id', (req, res, next) => {
    // const id = Number(req.params.id);
    // const note = notes.find(note => note.id === id);
    // if(note) {
    //     res.json(note);
    // } else {
    //     res.status(404).end();
    // }
    Note.findById(req.params.id).then(note => {
        if (note) {
            res.json(note);
        } else {
            res.status(404).end();
        }
    }).catch(error => {
        next(error);
    }); 
    // {
    //     console.log(error);
    //     res.status(400).send({error: 'malformatted id'});
    // });
});

app.delete('/api/notes/:id', (req, res, next) => {
    // const id = Number(req.params.id);
    // notes = notes.filter(note => note.id !== id);
    
    // Note.deleteOne({id: req.params.id}).then(result => {
    //     res.status(204).end();
    // });

    Note.findByIdAndDelete(req.params.id).then(result => {
        result.status(204).end();
    }).catch(error => next(error));
});

// const generateId = () => {
//     const maxId = notes.length > 0
//         ? Math.max(...notes.map(n => n.id)) 
//         : 0;
//     return maxId + 1;
// }

app.post('/api/notes', (req, res, next) => {
    const body = req.body; 

    if(body.content === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const note  = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    });

    // notes = notes.concat(note);

    note.save().then(savedNote => {
        res.json(savedNote);
    }).catch(error => next(error));
});

app.put('/api/notes/:id', (req, res, next) => {
    const { content, important } = req.body;

    Note.findByIdAndUpdate(req.params.id, { content, important }, {new: true, runValidators: true, context: 'query'}).then(updatedNote => {
        res.json(updatedNote);
    }).catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message});
    }
    
    next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 