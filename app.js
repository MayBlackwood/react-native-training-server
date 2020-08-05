const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5000;
const db = require('./queries');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const crypto = require('crypto');
const util = require('util');

const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: '192.168.99.100',
  database: 'nativeapp',
  password: 'postgres',
  port: 5555,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(port, () => console.log('Backend server live on ' + port));

app.get('/', function (req, res) {
  res.json({ message: 'Express is up!' });
});

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);
app.get('/friends/:id', db.getFriends);
app.post('/friends/add', db.sendFriendRequest);
app.post('/friends/accept', db.acceptFriendRequest);
app.get('/requests/outgoing:id', db.getOutgoingRequests);
app.get('/requests/incoming:id', db.getIncomingRequests);
app.delete('/friends/remove', db.declineOrRemoveFriend);

const jwtOptions = {
  secretOrKey: process.env.SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    const request = await pool.query(
      'SELECT id, username, role FROM users WHERE id = $1',
      [jwt_payload.id],
    );
    const result = request.rows[0];
    const isUserHasToken = result.id === jwt_payload.id;
    if (isUserHasToken) {
      done(null, { authUserId: jwt_payload.id, role: result.role });
    } else {
      done(null);
    }
  }),
);

app.post('/login', async ({ body: { username, password } }, res) => {
  const salt = process.env.SALT;
  const getKey = util.promisify(crypto.pbkdf2);
  const key = await getKey(password, salt, 5000, 8, 'sha512');
  if (key) {
    const result = await pool.query(
      'SELECT id, username, role, password FROM users WHERE username = $1',
      [username],
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(500).json({
        message:
          'Please make sure that you have entered your login and password correctly.',
      });
    }

    if (user.password === key.toString('hex')) {
      const payload = { id: user.id };
      const token = jwt.sign(payload, jwtOptions.secretOrKey);

      res.json({
        message: 'You are successfully logged in!',
        token: token,
        id: user.id,
        role: user.role,
      });
    } else {
      res.status(500).json({
        message:
          'Please make sure that you have entered your login and password correctly.',
      });
    }
  }
});

app.post(
  '/sign_up',
  async (
    { body: { username, firstName, lastName, email, password, description } },
    res,
  ) => {
    const salt = process.env.SALT;
    const getKey = util.promisify(crypto.pbkdf2);
    const key = await getKey(password, salt, 5000, 8, 'sha512');
    if (key) {
      const result = await pool.query(
        "INSERT INTO users(username, firstname, lastname, email, password, description, role) VALUES ($1, $2, $3, $4, $5, $6, 'user')",
        [
          username,
          firstName,
          lastName,
          email,
          key.toString('hex'),
          description,
        ],
      );

      const getToken = await pool.query(
        'SELECT id, role FROM users WHERE username = $1',
        [username],
      );

      const { id, role } = getToken.rows[0];
      const payload = { id: id };
      const token = jwt.sign(payload, jwtOptions.secretOrKey);

      res.status(200).send({
        id: id,
        token: token,
        role: role,
        username: username,
        message: 'You are successfully signed up.',
      });
    }
  },
);

app.get(
  '/secret',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json('Success! You can not see this without a token!');
  },
);

app.get(
  '/secretDebug',
  (req, res, next) => {
    console.log(req.get('Authorization'));
    next();
  },
  (req, res) => {
    res.json('debugging');
  },
);
