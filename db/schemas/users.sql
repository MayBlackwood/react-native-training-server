CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username text NOT NULL,
  firstname text NOT NULL,
  lastname text NOT NULL,
  email text NOT NULL,
  password text NOT NULL,
  description text,
  role text NOT NULL,
  date_of_birth date NOT NULL,
  CONSTRAINT user_profile_username UNIQUE (username)
);
