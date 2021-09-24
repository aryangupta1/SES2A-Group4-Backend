import express from "express";
//import pool from "./db";
import cors from "cors";
import { createConnection, Index } from "typeorm";
import { Student } from "./entities/student.entity";
import { Group } from "./entities/group.entity";
import { Assignment } from "./entities/assignment.entity";
import { admin } from "./entities/admin.entity";

createConnection().then((connection) => {
  const studentRepository = connection.getRepository(Student);
  const groupRepository = connection.getRepository(Group);
  const assignmentRepository = connection.getRepository(Assignment);
  const adminRepository = connection.getRepository(admin);
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
  //Student routes
  app.use("/students", require("./routes/students"));
  //Assignment routes
  app.use("/assignments", require("./routes/assignments"));
  //Register Route
  app.use("/auth", require("./routes/jwtAuth"));
  //Group Route
  app.use("/groups", require("./routes/groups"));

  // NOT THESE 2
  app.post("/admin", async function (request, response) {
    const admin = await adminRepository.create(request.body);
    const results = await adminRepository.save(admin);
    console.log(request.body);
    return response.json(results);
  });

  //Body = student details only
  app.post("/studentCreation", async function (request, response) {
    const group: Group = (await groupRepository.findOne({ where: { groupName: request.body.groupName } }))!;
    const student: Student = new Student();

    student.firstName = request.body.firstName;
    student.lastName = request.body.lastName;
    student.email = request.body.email;
    student.rolesRequired = request.body.rolesRequired;
    student.skillsRequired = request.body.skillsRequired;

    const createdStudent = await studentRepository.create(student);
    const results = await studentRepository.save(createdStudent);

    console.log(request.body);
    return response.json(results);
  });

  // retrieve all assignments owned by an admin
  app.get("/assignments", async function (request, response) {
    const admin: admin = (await adminRepository.findOne({ where: { email: request.body.email } }))!;
    const assignments: Assignment[] = await assignmentRepository.find({ where: { admin: admin } });
    response.send(assignments);
  });

  // Body contains assignment name
  app.put("/addStudentToAssignment/:studentEmail", async function (request, response) {
    const studentEmail = request.params.studentEmail;
    const student: Student = (await studentRepository.findOne({ where: { email: studentEmail } }))!;
    const assignment: Assignment = (await assignmentRepository.findOne({
      where: { assignmentName: request.body.assignmentName },
    }))!;
    assignment.students.push(student);
    const savedAssignment = await assignmentRepository.save(assignment);
    response.send(savedAssignment);

  // Still working on this
    const assignmentio = (await assignmentRepository.findOne(1, { relations: ["students"] }))!;
    assignmentio?.students.push(student);
    await assignmentRepository.save(assignmentio);

    await connection.createQueryBuilder().relation(Assignment, "s")
  });

  //This creates the assignment + groups
  app.post("/assignments", async function (request, response) {
    const admin: admin = (await adminRepository.findOne({ where: { email: request.body.email } }))!;
    const assignment: Assignment = new Assignment();
    assignment.admin = admin;
    assignment.assignmentName = request.body.assignmentName;
    assignment.maxSizeOfGroup = request.body.maxSizeOfGroup;
    assignment.numberOfGroups = request.body.numberOfGroups;
    assignment.rolesRequired = request.body.rolesRequired;
    assignment.skillsRequired = request.body.skillsRequired;

    for (let index = 0; index < request.body.numberOfGroups; index++) {
      const newGroup: Group = {
        groupName: request.body.assignmentName + "-Group-" + (index + 1),
        assignmentName: request.body.assignmentName,
        maxSizeOfGroup: request.body.maxSizeOfGroup,
        rolesRequired: request.body.rolesRequired,
        skillsRequired: request.body.skillsRequired,
        assignment: assignment,
        students: [],
      };
      assignment.groups?.push(newGroup);
      const createdGroup = (await groupRepository.save(newGroup))!;
    }

    const savedAssignment = await assignmentRepository.save(assignment)!;
    response.send(savedAssignment);
  });

  // Request should just receive assignment name?

  app.put("/:assignmentId/Sorting", async function (request, response) {});
});
