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

  app.post("/students", async function (req, res) {
    const student = await studentRepository.create(req.body);
    const results = await studentRepository.save(student);
    console.log(req.body);
    return res.json(results);
  });

  app.post("/groups", async function (req, res) {
    const group = await groupRepository.create(req.body);
    const results = await groupRepository.save(group);
    console.log(req.body);
    return res.json(results);
  });
  app.put("/groups:studentId/:groupName", async function (req, res) {
    const student = studentRepository
      .createQueryBuilder(req.params.studentId)
      .where("student.studentId like :studentId");
    const group = groupRepository.createQueryBuilder(req.params.groupName).where("group.groupName like :groupName");
    const studentUpdate = await studentRepository.save({ group: group.groupName });
  });
});
