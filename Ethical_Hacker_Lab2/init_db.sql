DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;


CREATE TABLE users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE,
password TEXT -- intentionally weak: plaintext or simple hash for lab purposes
);


CREATE TABLE products (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
description TEXT,
price REAL
);


INSERT INTO users (username,password) VALUES ('alice','password123');
INSERT INTO users (username,password) VALUES ('bob','letmein');
INSERT INTO users (username,password) VALUES ('admin','admin');


INSERT INTO products (name,description,price) VALUES ('Red Shirt', 'Comfortable cotton shirt', 19.99);
INSERT INTO products (name,description,price) VALUES ('Blue Mug', 'Ceramic mug', 9.50);
INSERT INTO products (name,description,price) VALUES ('Green Hat', 'Wool hat', 14.00);