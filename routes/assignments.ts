import express from "express";
import { appendFile } from "fs";
const router = express.Router();
import { Admin, getConnection, getRepository } from "typeorm";
import { admin } from "../entities/admin.entity";
import { Assignment } from "../entities/assignment.entity";
import { Group } from "../entities/group.entity";
const connection = getConnection();

router.get("/:owner/admin-page", async function (request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const assignmentRepository = await connection.getRepository(Assignment);
  const assignmentsOwnedByAdmin: Assignment[] = await assignmentRepository.find({
    where: { owner: request.params.owner },
  });
  const ownersAssignments: string[] = assignmentsOwnedByAdmin.map((x) => x.assignmentName);
  return response.send(ownersAssignments);
});

//get all assignments, regardless of owner

router.get("", async function (request, response){
  try{
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const assignmentRepository = await connection.getRepository(Assignment);
    const allAssignments: Assignment[] = await assignmentRepository.find({order: {assignmentName:"ASC"}})
    return response.send(allAssignments)
  }
  catch{
    response.status(500).send("Server Error");
  }
});

//Get students in group
router.get("/:groupId/:assignmentName/students", async function(request, response){
  try {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const groupId = request.params.groupId;
    const assignmentName = request.params.assignmentName;
    console.log(groupId);
    //find group
    const groupRepository = await connection.getRepository(Group);
    const group = await groupRepository.find({where: {assignmentName: assignmentName, id:groupId}});
    //get students
    const students = await group.map((item)=> item.students.map((student)=>student.email));
    return response.send(students);
  } catch (error) {
    response.status(500).send(error);
  }
})

//get assignment through admin id and assignment name
router.get("/:email/:assignmentName", async function (request, response) {
  try{
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const adminRepository = await connection.getRepository(admin);
    const currentAdmin = await adminRepository.find({ where: { email: request.params.email } });
    const adminId = await currentAdmin.map((i) => i.adminId);
    const assignmentRepository = await connection.getRepository(Assignment);
    const assignment = await assignmentRepository.find({
      where: { admin: adminId.toString(), assignmentName: request.params.assignmentName },
    });
  
    return response.send(assignment)
  }
  catch (error) {
    response.status(500).send("Server Error");
  }
})

module.exports = router;
