import express from "express";
//import pool from "./db";
import cors from "cors";
import { createConnection } from "typeorm";
import { Student } from "./entities/student.entity";
import { Group } from "./entities/group.entity";
import { Assignment } from "./entities/assignment.entity";

createConnection().then((connection) => {
  const studentRepository = connection.getRepository(Student);
  const groupRepository = connection.getRepository(Group);
  const assignmentRepository = connection.getRepository(Assignment);

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

  app.post("/assignments", async function (request, response) {
    const assignment = await assignmentRepository.create(request.body);
    const results = await assignmentRepository.save(assignment);
    console.log(request.body);

    for (let index = 0; index < request.body.numberOfGroups; index++) {
      const newGroup: Group = {
        groupId: "",
        groupNumber: index + 1,
        studentIdsInGroup: [],
        assignmentName: request.body.assignmentName,
        collectionId: "",
        maxSizeOfGroup: request.body.maxSizeOfGroup,
        rolesRequired: request.body.rolesRequired,
        skillsRequired: request.body.skillsRequired,
      };
      app.post("/groups", async function (newGroup, response) {
        const group = await groupRepository.create(newGroup.body);
        const results2 = await groupRepository.save(group);
        console.log(request.body, results2);
      });
    }
    return response.json(results);
  });

  app.put("/groups/:studentId/:groupId", async function (request, response) {
    const student: Student = (await studentRepository.findOne(request.params.studentId))!; // The '!' is a non-null assertion operator
    const group = await groupRepository.findOne(request.params.groupId);
    //student.group = group?.groupId!;
    const studentUpdate = await studentRepository.save(student);
    return response.send(studentUpdate);

    // console.log(req.body);
    // return res.json(results);
  });

  //Register Route
  app.use("/auth", require("./routes/jwtAuth"));
});
