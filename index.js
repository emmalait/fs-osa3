const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan")
const cors = require('cors')

morgan.token('postdata', (req) => {
    return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'))
app.use(cors())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "045-1236543"
  },
  {
    id: 2,
    name: "Arto Järvinen",
    number: "041-214323123"
  },
  {
    id: 3,
    name: "Lea Kutvonen",
    number: "040-4323234"
  },
  {
    id: 4,
    name: "Martti Tienari",
    number: "09-784232"
  }
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  res.send(
    "<p>Puhelinluettelossa on " +
      persons.length +
      " henkilön tiedot.</p> <p>" +
      new Date() +
      "</p>"
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
    const body = req.body;

    if (body.name === undefined) {
        return res.status(400).json({
            error: 'Name missing'
        })
    }

    if (body.number === undefined) {
        return res.status(400).json({
            error: 'Number is missing'
        })
    }

    const same = persons.filter(person => person.name === body.name);

    if (same.length > 0) {
        return res.status(400).json({
            error: 'Name already exists'
        })
    }

    const person = {
        id: generateID(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
  
    res.json(person);
  });

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const generateID = () => {
    const id = Math.floor(Math.random() * (500 - persons.length) + persons.length);
    return id;
}
