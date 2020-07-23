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
    console.log(results.rows);

    res.status(200).send(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
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
  const { firstName, lastName, email, password, description } = request.body;

  pool.query(
    `UPDATE users SET firstname = $1, lastname = $2, email = $3, password = $4, description = $5`,
    [firstName, lastName, email, password, description],
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
