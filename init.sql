  
CREATE TABLE public.users (
  ID SERIAL PRIMARY KEY,
  firstname text NOT NULL,
  lastname text NOT NULL,
  email text NOT NULL,
  password text NOT NULL,
  description text,
  role text NOT NULL
);

INSERT INTO users(firstname, lastname, email, password, description, role)
VALUES(
  'Ksenia',
  'Bobtsova',
  'ksenia.b@dashbouquet.com',
  'qwerty',
  'Default user',
  'admin'
);