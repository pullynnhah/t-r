import express, { json } from "express";
import cors from "cors";

const PORT = 5000;
const USERS_DB = [];
const TWEETS_DB = [];

const app = express();
app.use(json());
app.use(cors());

app.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;
  if (!(username && avatar)) return res.status(400).send("Todos os campos são obrigatórios!");
  if (Object.keys(req.body).length !== 2) return res.sendStatus(400);
  if (USERS_DB.find(user => user.username === username)) return res.sendStatus(409); // FIXME: change to 400 as was requested
  USERS_DB.push({ username, avatar });
  res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
  const { user: username } = req.headers;
  if (!username) return req.sendStatus(400);
  if (!USERS_DB.find(user => user.username === username)) return req.sendStatus(401);

  const { tweet } = req.body;

  if (!tweet) return res.status(400).send("Todos os campos são obrigatórios!");
  if (Object.keys(req.body).length !== 1) return res.sendStatus(400);

  TWEETS_DB.push({ username, tweet });
  res.status(201).send("OK");
});

// FIXME: remove both routes bellow
app.get("/users", (req, res) => res.send(USERS_DB));
app.get("/all-tweets", (req, res) => res.send(TWEETS_DB));

app.listen(PORT, () => console.log(`Running @ PORT: ${PORT}`));
