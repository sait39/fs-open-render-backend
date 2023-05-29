require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

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
    person.save().then((savedPerson) => {
      response.json(savedPerson);
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
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>`
  );
});

// persons route returns current state of persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
    // result.forEach((person) => {
    //   response.json(result);
    // });
    mongoose.connection.close();
  });
});

// get single person from database
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });

  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }
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
