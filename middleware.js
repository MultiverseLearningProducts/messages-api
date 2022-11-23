"use strict";

const http = require("http");
const bcrypt = require("bcryptjs");
const { User } = require("./db");

exports.cors = function (_req, res, next) {
  res.set("Access-Control-Allow-Origin", "*");
  next();
};

// NOTE: The Basic authentication scheme sends the credentials encoded but not
// encrypted. This is completely insecure unless the exchange happens over a
// secure connection (HTTPS/TLS).
exports.auth = async function (req, res, next) {
  const AUTH_TYPE = "Basic";

  let header = req.get("Authorization");

  if (!header) {
    res.set("WWW-Authenticate", AUTH_TYPE);
    res.status(401).send({ error: http.STATUS_CODES[401] });
    return;
  }

  let [type, token] = header.split(" ");

  if (type != AUTH_TYPE || !token) {
    res.status(401).send({ error: http.STATUS_CODES[401] });
    return;
  }

  let buffer = Buffer.from(token, "base64");
  let decoded = buffer.toString("utf8");
  let [username, password] = decoded.split(":");

  if (!password) {
    res.status(401).send({ error: http.STATUS_CODES[401] });
    return;
  }

  try {
    let user = await User.findOne({ where: { username } });

    // We can't just return early if the user doesn't exist, otherwise we leave
    // the username open to a timing attack. We need to use the string value
    // "undefined" because bcrypt will throw an error if we use the literal
    // value undefined.
    let hash = user ? user.get("password") : "undefined";

    let success = await bcrypt.compare(password, hash);

    if (success) {
      next();
      return;
    }

    res.status(401).send({ error: http.STATUS_CODES[401] });
  } catch (err) {
    res.status(500).send({ error: http.STATUS_CODES[500] });
    next(err);
  }
};
