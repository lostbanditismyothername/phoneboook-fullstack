require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

// Custom morgan token
// eslint-disable-next-line no-unused-vars
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

// Error handler
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// Middlewares
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
app.use(cors());
app.use(express.static("build"));
app.use(errorHandler);

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

// PERSONS
app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).json({ error: "No such person with the ID" });
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons/", (req, res, next) => {
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

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((returnedPerson) => {
      if (!returnedPerson) {
        res.status(404).json({ error: "no such person found with the ID" });
      } else {
        res.status(204).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const id = req.params.id;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((returnedPerson) => {
      res.json(returnedPerson);
    })
    .catch((error) => next(error));
});

// INFO
app.get("/api/info", (req, res) => {
  Person.count({}, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send(`<p>Phonebook has info about ${result} people</p>
  <p>${new Date()}</p>`);
    }
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
