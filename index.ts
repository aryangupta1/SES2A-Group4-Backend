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

  app.put("/students/:email/roles", async function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const email = request.params.email;
    const roles = request.body;
    const updateStudent = await studentRepository
      .createQueryBuilder("student")
      .update<Student>(Student, { rolesRequired: roles })
      .where("email = :email", { email: email })
      .execute();
    return response.json(updateStudent);
  });

  app.put("/students/:email/skills", async function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const email = request.params.email;
    const skills = request.body;
    const updateStudent = await studentRepository
      .createQueryBuilder("student")
      .update<Student>(Student, { skillsRequired: skills })
      .where("email = :email", { email: email })
      .execute();
    return response.json(updateStudent);
  });

  app.post("/students", async function (request, response) {
    const student = await studentRepository.create(request.body);
    const results = await studentRepository.save(student);
    console.log(request.body);
    return response.json(results);
  });
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

  //NOT THIS
  app.put("/assignments", async function (request, response) {
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
    }

    admin.assignments?.push(assignment);
    const savedAssignment = await assignmentRepository.save(assignment);
    const newAssignment = await adminRepository.save(admin).catch();
    response.send(savedAssignment);
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
  //Sends preferences to frontend to render on UI
  app.get("/preferences", async function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return response.send(EPreferredRole);
  });
  //Sends skills to frontend to render on UI
  app.get("/skills", async function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return response.send(ESkills);
  });

  app.get("/:owner/admin-page", async function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const assignmentsOwnedByAdmin: Assignment[] = await assignmentRepository.find({
      where: { owner: request.params.owner },
    });
    const ownersAssignments: string[] = assignmentsOwnedByAdmin.map((x) => x.assignmentName);
    return response.send(ownersAssignments);
  });
  //Register Route
  app.use("/auth", require("./routes/jwtAuth"));

  app.put("/:assignmentName/sorting", async function (request, response) {
    //Request is the assignment
    const assignment: Assignment = (await assignmentRepository.findOne(request.params.assignmentName))!;
    const groupNames: string[] = assignment.groupsInThisAssignment;
    const groups: Group[] = [];
    for (let index in groupNames) {
      const individualGroup = (await groupRepository.findOne(index))!;
      groups.push(individualGroup);
    } // Gives us our list of groups for an assignment

    // Roles first - Loop through each group, and if they dont have their roles met, add a student who meets the criteria
    // groups.forEach(element => {
    //   if(element.rolesRequired.length===0){
    //     const eligibleStudent = (await studentRepository.findOne(element.rolesRequired))
    //   }
    // });
  });
});
