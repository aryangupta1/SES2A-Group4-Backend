import express from "express";
const router = express.Router();
import { getRepository } from "typeorm";
import { Group } from "../entities/group.entity";
import { Student } from "../entities/student.entity";

router.put("/groups/:studentId/:groupId", async function (request, response) {
    const studentRepository = await getRepository(Student);
    const groupRepository = await getRepository(Group);
    const student: Student = (await studentRepository.findOne(request.params.studentId))!; // The '!' is a non-null assertion operator
    const group = await groupRepository.findOne(request.params.groupId);
    //student.group = group?.groupId!;
    const studentUpdate = await studentRepository.save(student);
    return response.send(studentUpdate);
    // console.log(req.body);
    // return res.json(results);
  });

module.exports = router;