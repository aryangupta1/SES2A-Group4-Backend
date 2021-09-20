import express from "express";
const router = express.Router();
import { getRepository } from "typeorm";
import { Assignment } from "../entities/assignment.entity";
import { Group } from "../entities/group.entity";

router.get("/:owner/admin-page", async function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const assignmentRepository = await getRepository(Assignment);
    const assignmentsOwnedByAdmin: Assignment[] = await assignmentRepository.find({
      where: { owner: request.params.owner },
    });
    const ownersAssignments: string[] = assignmentsOwnedByAdmin.map((x) => x.assignmentName);
    return response.send(ownersAssignments);
  });

  router.put("/:assignmentName/sorting", async function (request, response) {
    //Request is the assignment
    const assignmentRepository = await getRepository(Assignment);
    const groupRepository = await getRepository(Group);
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

module.exports = router;