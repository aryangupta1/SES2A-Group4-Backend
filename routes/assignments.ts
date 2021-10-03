import express from "express";
import { appendFile } from "fs";
const router = express.Router();
import { getConnection, getRepository } from "typeorm";
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

module.exports = router;
