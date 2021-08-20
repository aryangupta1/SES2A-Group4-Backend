import express from "express";
//import pool from "./db";
import cors from "cors";
import { createConnection } from "typeorm";
import { Student } from "./entities/student.entity";
import { studentDto } from "./dtos/studentDto";
import { Group } from "./entities/group.entity";

createConnection().then((connection) => {
  const studentRepository = connection.getRepository(Student);
  const groupRepository = connection.getRepository(Group);

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

  app.post("/students", async function (request, response) {
    const student = await studentRepository.create(request.body);
    const results = await studentRepository.save(student);
    console.log(request.body);
    return response.json(results);
  });

  app.post("/groups", async function (request, response) {
    const group = await groupRepository.create(request.body);
    const results = await groupRepository.save(group);
    console.log(request.body);
    return response.json(results);
  });

  app.put("/groups/:studentId/:groupId", async function (request, response) {
    const student: Student = (await studentRepository.findOne(request.params.studentId))!; // The '!' is a non-null assertion operator
    const group = await groupRepository.findOne(request.params.groupId);
    student.group = group?.groupId!;
    const studentUpdate = await studentRepository.save(student);
    return response.send(studentUpdate);
    
    // console.log(req.body);
    // return res.json(results);
  });
});
