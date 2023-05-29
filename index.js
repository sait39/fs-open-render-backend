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

// allow for person creation
app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing',
    });
  } else {
    for (let personIndex = 0; personIndex < persons.length; personIndex++) {
      const person = persons[personIndex];
      
      if (person.name === body.name) {
        return response.status(400).json({
          error: 'name must be unique'
        })
      }
    }
  }

  const person = {
    id: generateId(),
    ...request.body,
  };

  persons = persons.concat(person);

  response.json(person);
});

// root page returns Hello world
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

// info page returns info
app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>`
  );
});

// persons route returns current state of persons
app.get('/api/persons', (request, response) => {
  response.json(persons);
});

// get single person
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// delete a single person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
