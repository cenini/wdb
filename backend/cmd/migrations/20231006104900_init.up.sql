CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4 (),
  email VARCHAR(254) NOT NULL,
  handle VARCHAR(32),
  UNIQUE (id),
  UNIQUE (email),
  PRIMARY KEY (id)
);

CREATE TABLE items (
  id uuid DEFAULT uuid_generate_v4 (),
  owner_id uuid REFERENCES users,
  tags JSONB,
  PRIMARY KEY (id)
);

CREATE TABLE photos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id UUID REFERENCES items(id),
    url VARCHAR(256) NOT NULL,
    -- Add other fields as needed (e.g., file_path, description, etc.)
);

CREATE TABLE item_photos (
    item_id UUID REFERENCES items(id),
    photo_id UUID REFERENCES photographs(id),
    PRIMARY KEY (item_id, photo_id)
);

CREATE TYPE tag_type AS ENUM ('name', 'key_value');

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  type tag_type NOT NULL,
  name VARCHAR(50), -- For 'name' type tags
  key VARCHAR(50), -- For 'key_value' type tags
  value VARCHAR(50) -- For 'key_value' type tags
);

CREATE TABLE item_tags (
  item_id UUID REFERENCES items(id),
  tag_id INT REFERENCES tags(id),
  PRIMARY KEY (item_id, tag_id)
);

CREATE INDEX ON users (email);
CREATE INDEX ON items (owner_id);
