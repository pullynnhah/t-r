import express, { json } from "express";
import cors from "cors";

const PORT = 5000;
const users_db = [];
const tweets_db = [];

const app = express();
app.use(json());
app.use(cors());

app.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;
  if (!(username && avatar)) return res.status(400).send("Todos os campos são obrigatórios!");
  if (Object.keys(req.body).length !== 2) return res.sendStatus(400);
  if (users_db.find(user => user.username === username)) return res.sendStatus(400);
  users_db.push({ username, avatar });
  res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
  const { user: username } = req.headers;
  if (!username) return res.sendStatus(400);
  if (!users_db.find(user => user.username === username))
    return res.status(401).send("UNAUTHORIZED");

  const { tweet } = req.body;

  if (!tweet) return res.status(400).send("Todos os campos são obrigatórios!");
  if (Object.keys(req.body).length !== 1) return res.sendStatus(400);

  tweets_db.push({ username, tweet });
  res.status(201).send("OK");
});

app.get("/tweets", (req, res) => {
  let { page } = req.query;

  const avatars = users_db.reduce((ac, user) => ({ ...ac, [user.username]: user.avatar }), {});
  if (!page) {
    const tweets = tweets_db.slice(-10).map(tweet => ({
      ...tweet,
      avatar: avatars[tweet.username]
    }));
    return res.send(tweets);
  }
  page = Number(page);

  if (isNaN(page) || page < 1 || page > Math.floor(tweets_db.length / 10) + 1) {
    return res.status(400).send("Informe uma página válida!");
  }
  const start = -(page * 10);
  const end = tweets_db.length + start + 10;
  res.send(
    tweets_db.slice(start, end).map(tweet => ({
      ...tweet,
      avatar: avatars[tweet.username]
    }))
  );
});

app.get("/tweets/:username", (req, res) => {
  const { username } = req.params;
  if (!username) return res.sendStatus(400);
  const user = users_db.find(user => user.username === username);
  if (!user) return res.sendStatus(400);
  res.send(
    tweets_db
      .filter(tweet => tweet.username === username)
      .map(tweet => ({
        ...tweet,
        avatar: user.avatar
      }))
  );
});

app.listen(PORT, () => console.log(`Running @ PORT: ${PORT}`));
