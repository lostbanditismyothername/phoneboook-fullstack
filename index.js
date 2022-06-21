require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

// Custom morgan token
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

// Middlewares
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
app.use(cors());
app.use(express.static("build"));

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    console.log(persons);
    res.json(persons);
  });
});

// PERSONS
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  Person.findById(id).then((person) => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  });
});

app.post("/api/persons/", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number is missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  entries = entries.filter((entry) => entry.id !== id);
  res.status(204).end();
});

// INFO
app.get("/api/info", (req, res) => {
  res.send(`<p>Phonebook has info about ${entries.length} people</p>
  <p>${new Date()}</p>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
