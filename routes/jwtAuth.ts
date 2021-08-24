import express from "express";
import { getRepository } from "typeorm";
import { Student } from "../entities/student.entity";
import bcrypt, { compare } from "bcrypt";
const router = express.Router();
import jwtGenerator from "../utils/jwtGenerator";
import {checkJwt} from '../middleware/authorisation';
import {validateForm} from '../middleware/formValidation';

//Register Route
router.post("/register", validateForm, async (req, res) => {
    try {
        //Destructure req.body
        const {firstName, lastName, email, password} = req.body;
        //Check if user exists
        const studentRepository = await getRepository(Student);
        const user = await studentRepository.find({where : {email: email}});
        if(user.length !== 0 ){
            return res.status(401).send("User already exists");
        }
        //bcrypt users password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);
        //Enter new user inside student repository
        const newStudent = {firstName, lastName, email, password:bcryptPassword};
        const student = await studentRepository.create(newStudent);
        const results = await studentRepository.save(student);
        //Generate jwt token
        const token = jwtGenerator(JSON.stringify(results.studentid));
        res.json({token});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

//Login Route

router.post("/login", validateForm, async (req, res) => {
    try {
        //Destructure req.body
        const {email, password} = req.body;
        //Check if user doesn't exist, if not throw error
        const studentRepository = await getRepository(Student);
        const user = await studentRepository.find({where : {email: email}});
        if(user.length === 0){
            res.status(401).json("Email is incorrect");
        }
        //Check if incoming password is the same as the db password
        const isValid = await compare(password, user.map(data=>data.password).toString());
        if(!isValid){
            res.status(401).json("Password is incorrect");
        }
        //Give user jwt token
        const token = jwtGenerator(JSON.stringify(user.map((data) => data.studentid)));
        res.json({token});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");    }
})


module.exports = router;