import express from "express";
const router = express.Router();
import { getRepository } from "typeorm";
import { EPreferredRole, ESkills } from "../dataTypes/types";
import { Student } from "../entities/student.entity";

router.put("/:email/roles", async function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const email = request.params.email;
    const roles = request.body;
    const studentRepository = await getRepository(Student);
    const updateStudent = await studentRepository
        .createQueryBuilder("student")
        .update<Student>(Student, { rolesRequired: roles })
        .where("email = :email", { email: email })
        .execute();
    return response.json(updateStudent);
});

router.put("/:email/skills", async function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const email = request.params.email;
    const skills = request.body;
    const studentRepository = await getRepository(Student);
    const updateStudent = await studentRepository
        .createQueryBuilder("student")
        .update<Student>(Student, { skillsRequired: skills })
        .where("email = :email", { email: email })
        .execute();
    return response.json(updateStudent);
});

router.post("/", async function (request, response) {
    const studentRepository = await getRepository(Student);
    const student = await studentRepository.create(request.body);
    const results = await studentRepository.save(student);
    console.log(request.body);
    return response.json(results);
  });

//Sends preferences to frontend to render on UI 
//Need to change routes on frontend too
router.get("/preferences", async function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return response.send(EPreferredRole);
});
//Sends skills to frontend to render on UI
router.get("/skills", async function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return response.send(ESkills);
});

module.exports = router;