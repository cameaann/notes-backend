const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"))

const repl = require("repl");
const replServer = repl.start();

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.statusMessage = "There is no note with such id";
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const generatedId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  if (!body.content) {
    return response.status(400).json({
      error: "note must be not empty string"
    })
  }

  const note = {
    id: generatedId(),
    content: body.content,
    important: Boolean(body.important) || false,
  }

  notes = notes.concat(note);
  response.json(note);
});

app.put("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;
  const updatedNote  = {
    id: id,
    content: body.content,
    important: body.important
  }

  notes = notes.map((note) => {
    if(note.id === id){
      note = updatedNote
    }
    return note;
});
  response.json(updatedNote)
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
