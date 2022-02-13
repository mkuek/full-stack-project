DROP DATABASE IF EXISTS chat_app_database

CREATE DATABASE chat_app_database;
\c chat_app_database;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
  userID SERIAL NOT NULL,
  chatID INT,
  date_stamp TIMESTAMP,
  userName varchar(15) NOT NULL,
  chatText varchar(255),
  PRIMARY KEY(userID)
);

CREATE TABLE rooms (
  roomID SERIAL,
  userID INT NOT NULL,
  date_created TIMESTAMP,
  roomName varchar(255),
  PRIMARY KEY (roomID),
  CONSTRAINT fk_room
    FOREIGN KEY(userID)
      REFERENCES users(userID)
);

CREATE TABLE messages(
  ID SERIAL,
  text varchar(255),
  userID INT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (ID),
  CONSTRAINT fk_messages
    FOREIGN KEY(userID)
      REFERENCES users(userID)
);