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

const getFriends = (request, response) => {
  const id = request.params.id;

  pool.query(
    `
      SELECT uf.addressee_id AS friend_id, u.* FROM user_friends uf
        JOIN users u ON u.id = uf.addressee_id
       WHERE uf.requester_id = $1;
    `,
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }

      response.status(200).json(results.rows);
    },
  );
};

const sendFriendRequest = (request, response) => {
  console.log(request.body);
  const requester_id = request.body.requesterId;
  const addressee_id = request.body.addresseeId;

  pool.query(
    `
      INSERT INTO user_friends(requester_id, addressee_id, created_date_time)
      VALUES($1, $2, now());
    `,
    [requester_id, addressee_id],
    (error, results) => {
      if (error) {
        throw error;
      }

      response
        .status(201)
        .send(`Your request to user with id ${addressee_id} was sent.`);
    },
  );
};

const getOutgoingRequests = (request, response) => {
  const userId = request.body.userId;

  pool.query(
    `
      SELECT addressee_id FROM user_friends 
       WHERE requester_id = $1 
         AND accepted = false
    `,
    [userId],
    (error, results) => {
      if (error) {
        throw error;
      }

      response.status(200).json(results.rows);
    },
  );
};

const getIncomingRequests = (request, response) => {
  const userId = request.body.userId;

  pool.query(
    `
      SELECT requester_id FROM user_friends 
       WHERE addressee_id = $1 
         AND accepted = false
    `,
    [userId],
    (error, results) => {
      if (error) {
        throw error;
      }

      response.status(200).json(results.rows);
    },
  );
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getFriends,
  sendFriendRequest,
  getOutgoingRequests,
  getIncomingRequests,
};
