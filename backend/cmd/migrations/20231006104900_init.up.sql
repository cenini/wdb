CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--bun:split

CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4 (),
  email VARCHAR(254) NOT NULL,
  name TEXT,
  UNIQUE (id),
  UNIQUE (email),
  KEY (email),
  PRIMARY KEY (id)
);

--bun:split

CREATE TABLE item (
  id uuid DEFAULT uuid_generate_v4 (),
  owner uuid REFERENCES users,
  KEY (owner),
  PRIMARY KEY (id)
);
