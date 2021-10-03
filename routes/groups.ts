import express from "express";
const router = express.Router();
import { getConnection, getRepository } from "typeorm";
import { Group } from "../entities/group.entity";
import { Student } from "../entities/student.entity";

const connection = getConnection();

router.put("/groups/:studentId/:groupId", async function (request, response) {
  const studentRepository = await connection.getRepository(Student);
  const groupRepository = await connection.getRepository(Group);
  const student: Student = (await studentRepository.findOne(request.params.studentId))!; // The '!' is a non-null assertion operator
  const group = await groupRepository.findOne(request.params.groupId);
  //student.group = group?.groupId!;
  const studentUpdate = await studentRepository.save(student);
  return response.send(studentUpdate);
  // console.log(req.body);
  // return res.json(results);
});

module.exports = router;
