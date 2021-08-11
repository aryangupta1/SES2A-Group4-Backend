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
