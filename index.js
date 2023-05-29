require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const PhonebookEntry = require('./models/phonebookEntry');

const app = express();

morgan.token('data', function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
);
app.use(cors());
app.use(express.static('build'));

// handle json properly
app.use(express.json());

// allow for phonebookEntry creation
app.post('/api/phonebookEntries', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing',
    });
  } else {
    phonebookEntry.save().then((savedPhonebookEntry) => {
      response.json(savedPhonebookEntry);
    });
  }
});

// root page returns Hello world
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

// info page returns info
app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${phonebookEntries.length} people</p>
    <p>${new Date().toString()}</p>`
  );
});

// phonebookEntries route returns current state of phonebookEntries
app.get('/api/phonebookEntries', (request, response) => {
  response.json(phonebookEntries);
});

// get single phonebookEntry from database
app.get('/api/phonebookEntries/:id', (request, response) => {
  PhonebookEntry.findById(request.params.id).then((phonebookEntry) => {
    response.json(phonebookEntry);
  });

  // if (phonebookEntry) {
  //   response.json(phonebookEntry);
  // } else {
  //   response.status(404).end();
  // }
});

// delete a single phonebookEntry
app.delete('/api/phonebookEntries/:id', (request, response) => {
  const id = Number(request.params.id);
  phonebookEntries = phonebookEntries.filter(
    (phonebookEntry) => phonebookEntry.id !== id
  );

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
