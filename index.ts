import express from "express";
//import pool from "./db";
import cors from "cors";
import { createConnection } from "typeorm";
import { Student } from "./entities/student.entity";
import { studentDto } from "./dtos/studentDto";

createConnection().then((connection) => {
  const studentRepository = connection.getRepository(Student);

  const app = express();
  const PORT = 8000;

  app.get("/", (req, res) => res.send("HELLO THERE"));
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  //Middleware
  app.use(cors());
  //Allows us to access request.body to access JSON data
  app.use(express.json());

  app.post("/students", async function (req, res) {
    //const { firstName, lastName, preferredRole, skills } = req.body;
    const student = await studentRepository.create(req.body);
    const results = await studentRepository.save(student);
    console.log(req.body);
    return res.json(results);
  });
});
