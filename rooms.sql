-- CREATE DATABASE chat_app_database;
-- \c chat_app_database;

CREATE TABLE rooms (
  UID SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);

