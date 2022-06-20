const express = require("express");
const morgan = require("morgan");

const app = express();

// Custom morgan token
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

// Middlewares
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
``;

let entries = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(entries);
});

// PERSONS
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const entry = entries.find((entry) => entry.id === id);
  if (entry) {
    res.json(entry);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons/", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number is missing",
    });
  }

  const isNameUnique = entries.every((entry) => entry.name !== body.name);

  if (!isNameUnique) {
    return res.status(400).json({
      error: "Name must be unique",
    });
  }

  const entry = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 100000),
  };

  entries = [...entries, entry];

  res.json(entry);
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
