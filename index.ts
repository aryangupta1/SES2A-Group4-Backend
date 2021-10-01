import express from "express";
//import pool from "./db";
import cors from "cors";
import { createConnection } from "typeorm";
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

  //get students information

  app.get("/receiveStudentDetails", async function (request, response) {
    const student = await studentRepository.findOneOrFail({ where: { email: request.query.email } });
    response.send(student.assignments);
  });

  //Body = student details only
  app.post("/studentCreation", async function (request, response) {
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
  app.put("/addStudentToAssignment", async function (request, response) {
    const studentEmail = request.body.studentEmail;
    const student: Student = (await studentRepository.findOne({ where: { email: studentEmail } }))!;
    const assignment: Assignment = await assignmentRepository.findOneOrFail({
      where: { assignmentName: request.body.assignmentName },
    });
    if (!assignment.students.includes(student)) {
      (await assignment.students).push(student);
    } else {
      console.log("Student is already in this assignment!");
    }
    await assignmentRepository.save(assignment);
    response.send(assignment);
  });

  app.get("/getStudentsInAssignment", async function (request, response) {
    const assigmentName = request.query.assignmentName;
    const assignment = (await assignmentRepository.findOne({ where: { assignmentName: assigmentName } }))!;
    response.send(assignment.students);
  });

  //This creates the assignment + groups
  app.post("/assignments", async function (request, response) {
    const admin: admin = (await adminRepository.findOne({ where: { email: request.body.email } }))!;
    const assignment: Assignment = {
      admin: admin,
      assignmentName: request.body.assignmentName,
      maxSizeOfGroup: request.body.maxSizeOfGroup,
      numberOfGroups: request.body.numberOfGroups,
      rolesRequired: request.body.rolesRequired,
      skillsRequired: request.body.skillsRequired,
      groups: [],
      students: [],
    };

    for (let index = 0; index < request.body.numberOfGroups; index++) {
      const newGroup: Group = {
        groupName: request.body.assignmentName + "-Group-" + (index + 1),
        assignmentName: request.body.assignmentName,
        maxSizeOfGroup: request.body.maxSizeOfGroup,
        rolesRequired: request.body.rolesRequired,
        skillsRequired: request.body.skillsRequired,
        students: [],
      };
      (await assignment.groups).push(newGroup);
    }
    const savedAssignment = await assignmentRepository.save(assignment)!;

    response.send(savedAssignment);
  });

  app.put("/groupAddition", async function (request, response) {
    const student: Student = await studentRepository.findOneOrFail({ where: { email: request.body.email } });
    const group: Group = (await groupRepository.findOne({ where: { id: request.body.id } }))!;
    await group.students.push(student);
    const savedGroup = await groupRepository.save(group);
    response.send(group);
  });




  // Request should just receive assignment name?
  app.put("/:assignmentId/Sorting", async function (request, response) {});
});
