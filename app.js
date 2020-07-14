const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = requireJWT.Strategy;
require("dotenv").config();
const port = process.env.PORT || 5000;
const db = require("./queries");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(port, () => console.log("Backend server live on " + port));

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)
