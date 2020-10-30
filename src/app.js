const express = require("express");
const cors = require("cors");

const { uuid } = require('uuidv4');
const { query } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;
  const repository = { 
    id: uuid(), 
    url, 
    title, 
    techs, 
    likes: 0,
  };
  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;
  const repoIdFind = repositories.findIndex(repository => repository.id === id);

  if(repoIdFind === -1) {
    return res.status(400).json({ error: "ID do Projeto não encontrado!" });
  }

  const repository = { 
    id: uuid(), 
    url, 
    title, 
    techs,
    likes: repositories[repoIdFind].likes,
  };

  repositories[repoIdFind] = repository;

  return res.json(repository);
  
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if(repoIndex < 0) {
    return res.status(400).json({ error: "Projeto não encontrado" });
  }

  repositories.splice(repoIndex, 1);

  return res.status(204).send();

});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;
  const { url,title, techs } = req.body;
  const repoId = repositories.findIndex(repository => repository.id === id);

  if(repoId === -1) {
    return res.status(400).json({ error: "Id de projeto não encontrado, não tem como dar like." });
  }

  repositories[repoId].likes +=1;

  return res.json(repositories[repoId]);

});

module.exports = app;
