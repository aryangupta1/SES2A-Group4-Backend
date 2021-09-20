import express, { request, response } from "express";
//import pool from "./db";
import cors from "cors";
import { createConnection, Index } from "typeorm";
import { Student } from "./entities/student.entity";
import { Group } from "./entities/group.entity";
import { Assignment } from "./entities/assignment.entity";
import { EPreferredRole, ESkills } from "./dataTypes/types";
import { group } from "console";
import { admin } from "./entities/admin.entity";
import { PRIORITY_LOW } from "constants";

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

  app.post("/groups", async function (request, response) {
    const group = await groupRepository.create(request.body);
    const results = await groupRepository.save(group);
    console.log(request.body);
    return response.json(results);
  });

  // app.post("/assignments", async function (request, response) {
  //   // Creates an assignment and any groups that must be created within it
  //   let groupsInAssignmentInstance: string[] = [];

  //   for (let index = 0; index < request.body.numberOfGroups; index++) {
  //     const newGroup: Group = {
  //       groupName: request.body.assignmentName + "-Group-" + (index + 1),
  //       studentIdsInGroup: [],
  //       assignmentName: request.body.assignmentName,
  //       maxSizeOfGroup: request.body.maxSizeOfGroup,
  //       rolesRequired: request.body.rolesRequired,
  //       skillsRequired: request.body.skillsRequired,
  //     };
  //     const group = await groupRepository.create(newGroup);
  //     const groupResult = await groupRepository.save(group);
  //     // response.write(groupResult);
  //     groupsInAssignmentInstance.push(newGroup.groupName);
  //   }
  //   request.body.groupsInThisAssignment = groupsInAssignmentInstance;

  //   const assignment = await assignmentRepository.create(request.body);
  //   const assignmentResult = await assignmentRepository.save(assignment);
  //   return response.send(assignmentResult);
  // });
  // retrieve all assignments owned by an admin
  app.get("/assignments", async function (request, response) {
    const admin: admin = (await adminRepository.findOne({ where: { email: request.body.email } }))!;
    const assignments: Assignment[] = await assignmentRepository.find({ where: { admin: admin } });
    response.send(assignments);
  });

  //This creates the assignmnet + groups
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
        studentIdsInGroup: [],
        assignmentName: request.body.assignmentName,
        maxSizeOfGroup: request.body.maxSizeOfGroup,
        rolesRequired: request.body.rolesRequired,
        skillsRequired: request.body.skillsRequired,
        assignment: assignment,
      };
      assignment.groups?.push(newGroup);
      const createdGroup = (await groupRepository.save(newGroup))!;
    }
    admin.assignments?.push(assignment);
    const savedAssignment = await assignmentRepository.save(assignment);
    response.send(admin.assignments);
  });
});
