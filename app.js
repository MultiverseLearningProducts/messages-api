"use strict";

const http = require("http");
const express = require("express");
const { cors, auth } = require("./middleware");
const { sequelize, Message, ValidationError } = require("./db");

let app = express();

app.set("json spaces", 2);
app.use(cors, auth, express.json());

app.post("/messages", async (req, res, next) => {
  try {
    let message = await Message.create({ message: req.body.message });
    res.status(201).send(message);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).send({ error: http.STATUS_CODES[400] });
    } else {
      res.status(500).send({ error: http.STATUS_CODES[500] });
    }

    next(err);
  }
});

app.get("/messages", async (_req, res, next) => {
  try {
    let messages = await Message.findAll();
    res.send(messages);
  } catch (err) {
    res.status(500).send({ error: http.STATUS_CODES[500] });
    next(err);
  }
});

app.get("/messages/:id", async (req, res, next) => {
  try {
    let message = await Message.findByPk(req.params.id);

    if (message) {
      res.send(message);
      return;
    }

    res.status(404).send({ error: http.STATUS_CODES[404] });
  } catch (err) {
    res.status(500).send({ error: http.STATUS_CODES[500] });
    next(err);
  }
});

app.put("/messages/:id", async (req, res, next) => {
  try {
    let message = await Message.findByPk(req.params.id);

    if (message) {
      message = await message.update({ message: req.body.message });
      res.send(message);
      return;
    }

    message = await Message.create({ message: req.body.message });
    res.status(201).send(message);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).send({ error: http.STATUS_CODES[400] });
    } else {
      res.status(500).send({ error: http.STATUS_CODES[500] });
    }

    next(err);
  }
});

app.delete("/messages/:id", async (req, res, next) => {
  try {
    let message = await Message.findByPk(req.params.id);

    if (message) {
      message = await message.destroy();
      res.send({});
      return;
    }

    res.status(404).send({ error: http.STATUS_CODES[404] });
  } catch (err) {
    res.status(500).send({ error: http.STATUS_CODES[500] });
    next(err);
  }
});

let port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log(`Listening on port ${port}`);
  } catch (err) {
    console.error("Failed to start server:", err);
  }
});
