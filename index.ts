import express from "express";
import pool from './db';
import cors from 'cors';

const app = express();
const PORT = 8000;

//Middleware
app.use(cors());
//Allows us to access request.body to access JSON data
app.use(express.json());

app.get("/", (req, res) => res.send("HELLO THERE"));
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

//Routes

/* Create new student - Very basic only using currentGroupStatus - which will be set to false by default. 
This route is ideal for when a student signs up */
app.post("/students", async(req, res) => {
  try {
    //Set to false by default
    const currentGroupStatus = false;
    const newStudent = await pool.query(
      "INSERT INTO students (currentGroupStatus) VALUES($1) RETURNING *",
      [currentGroupStatus]
    );
    res.json(newStudent.rows[0]);
  } catch (error) {
    console.error("An error occured: ", error.message);
  }
})
//Students will add their preferences and skills etc in other routes below (TBD)