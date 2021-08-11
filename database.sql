CREATE DATABASE students;

CREATE TABLE students(
    id SERIAL PRIMARY KEY,
    preferredRole VARCHAR(255),
    skills VARCHAR(500),
    currentGroupStatus boolean 
);