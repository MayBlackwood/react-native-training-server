const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: '192.168.99.100',
  database: 'nativeapp',
  password: 'postgres',
  port: 5555,
});

const getUsers = (req, res) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }

    res.status(200).send(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows[0]);
  });
};

const createUser = (request, response) => {
  const { firstName, lastName, email, password, description } = request.body;

  pool.query(
    'INSERT INTO users(firstname, lastname, email, password, description) VALUES($1, $2, $3, $4, $5)',
    [firstName, lastName, email, password, description],
    (error, results) => {
      if (error) {
        throw error;
      }

      response.status(201).send(`User added with ID: ${result.insertId}`);
    },
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    firstname,
    lastname,
    email,
    password,
    description,
    username,
  } = request.body;

  pool.query(
    `UPDATE users SET firstname = $1, lastname = $2, email = $3, username = $4, description = $5
      WHERE id = $6 `,
    [firstname, lastname, email, username, description, id],
    (error, results) => {
      if (error) {
        throw error;
      }

      response.status(200).send(`User modified with ID: ${id}`);
    },
  );
};
const deleteUser = (request, response) => {
  const id = request.body.id;

  pool.query(`DELETE FROM users WHERE id = $1`, [id], (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
