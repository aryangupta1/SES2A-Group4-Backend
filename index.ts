import express, { response } from "express";
//import pool from "./db";
import cors from "cors";
import { createConnection } from "typeorm";
import { Student } from "./entities/student.entity";
import { Group } from "./entities/group.entity";
import { Assignment } from "./entities/assignment.entity";
import { admin } from "./entities/admin.entity";
import { off, send } from "process";
import { FORMERR } from "dns";

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

  app.get("/adminDetailsName", async function (request, response) {
    const admin = await adminRepository.findOneOrFail({ where: { email: request.query.email } });
    const adminName: string = admin.firstName + " " + admin.lastName;
    const sendAdmin = [];
    sendAdmin.push(adminName);
    response.send(sendAdmin);
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
  app.get("/assignmentsAdmin", async function (request, response) {
    const admin: admin = (await adminRepository.findOneOrFail({ where: { email: request.query.email } }))!;
    const assignments: string[] = [];
    admin.assignments.forEach((assignment) => {
      assignments.push(assignment.assignmentName);
    });
    response.send(assignments);
  });

  // Body contains assignment name
  app.put("/addStudentToAssignment", async function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
    response.json(assignment);
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

  // algorithm helper functions

  const groupRequirementsMet = async (group: Group): Promise<Boolean> => {
    let requiredRoles = group.rolesRequired; // Make an array of the groups required role
    let requiredSkills = group.skillsRequired; // Make an array of the groups required skills
    const students = group.students; // Make an array of the groups current students
    for (let student of students) {
      // For every student
      for (let roles of student.rolesRequired) {
        // for every role that student has
        if (requiredRoles.includes(roles)) {
          // if that role is required by the group
          requiredRoles = requiredRoles.filter((role) => role != roles); // remove that role from the array
        }
        for (let skills of student.skillsRequired) {
          // for every skill the student has
          if (requiredSkills.includes(skills)) {
            // for every skill required by the group
            requiredSkills = requiredSkills.filter((skill) => skill != skills); // remove that skill from the array
          }
        }
      }
    }
    if (requiredRoles.length === 0 && requiredSkills.length === 0) {
      // if both the roles and skills array are empty (meaning all roles and skills have been met by students in the group)
      return true;
    }
    return false;
  };

  const checkIfStudentInGroup = async (student: Student, assignment: Assignment) => {
    for (const group of assignment.groups) {
      if (group.students.includes(student)) {
        return true;
      }
    }
    return false;
  };

  const fillGroup = async (group: Group) => {
    let requiredRoles = group.rolesRequired; // Make an array of the groups required role
    let requiredSkills = group.skillsRequired; // Make an array of the groups required skills
    let assignment = (await assignmentRepository.findOne({ where: { assignmentName: group.assignmentName } }))!;
    let students = assignment.students;
    for (const student of students) {
      if (!checkIfStudentInGroup(student, assignment) && requiredRoles.length > 0) {
        for (const studentRole of student.rolesRequired) {
          if (requiredRoles.includes(studentRole)) {
            group.students.push(student);
            requiredRoles.filter((role) => role != studentRole);
            continue;
          }
        }
      }
      if (!checkIfStudentInGroup(student, assignment) && requiredSkills.length > 0) {
        for (const studentSkill of student.skillsRequired) {
          if (requiredSkills.includes(studentSkill)) {
            group.students.push(student);
            requiredSkills.filter((skill) => skill != studentSkill);
            continue;
          }
        }
      }
    }
  };

  const isThereEligibleStudents = async (assignment: Assignment): Promise<Boolean> => {
    let availableStudents = [];
    for (const student of assignment.students) {
      if (!(await checkIfStudentInGroup(student, assignment))) {
        availableStudents.push(student);
      }
    }
    return availableStudents.length > 0;
  };
  // Request should just receive assignment name?
  app.put("/sortAssignment", async function (request, response) {
    const assignment: Assignment = await assignmentRepository.findOneOrFail({
      where: { assignmentName: request.body.assignmentName },
    });

    const students: Student[] = assignment.students;
    const groups: Group[] = assignment.groups;
    response.send(students);

    groups.forEach((group) => {
      while (isThereEligibleStudents(assignment)) {
        if (!groupRequirementsMet(group)) {
          fillGroup(group); // Fill the group with students
        }
      }
    });
  });

  app.put("/sortAssignments", async function (request, response) {
    const assignment = await assignmentRepository.findOneOrFail({
      // find assignment
      where: { assignmentName: request.body.assignmentName },
    });
    let iterator = 0;
    assignment.groups.forEach(async (group) => {
      // for each group in assignment
      while (group.students.length <= group.maxSizeOfGroup && iterator <= assignment.students.length - 1) {
        // add students iteratively until the group is full
        group.students.push(assignment.students[iterator]);

        iterator++;
      }
    });
    const sortedAssignment = await assignmentRepository.save(assignment);
    response.send(sortedAssignment.groups);
  });

  app.put("/addAllStudentsToAssignment", async function (request, response) {
    const assignment = await assignmentRepository.findOneOrFail({
      where: { assignmentName: request.body.assignmentName },
    });
    const students = await studentRepository.find({});
    students.forEach(async (student) => {
      assignment.students.push(student);
    });
    const studentsAddedToAssignment = await assignmentRepository.save(assignment);
    response.send(studentsAddedToAssignment);
  });
});

// Sorting Algorithm Steps
//
// Find assignment using the body + assignmentName DONE
// Put students into an array DONE
// Put groups into an array DONE
//
// while group hasnt had requirements met DONE
// loop through each student, if that student meets a requirement, and isnt in a group in this assignment
// add them to the group
// loop through each group at the end and add residual students
