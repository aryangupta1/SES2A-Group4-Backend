import express from "express";
import { Connection, ConnectionNotFoundError, getConnection, getRepository } from "typeorm";
import { Student } from "../entities/student.entity";
import bcrypt, { compare } from "bcrypt";
const router = express.Router();
import jwtGenerator from "../utils/jwtGenerator";
import { checkJwt } from "../middleware/authorisation";
import { validateForm } from "../middleware/formValidation";
import { admin } from "../entities/admin.entity";
//Student routes
//Register Route

const connection = getConnection();

router.post("/register", validateForm, async (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //Destructure req.body
    const { firstName, lastName, email, password } = req.body;
    //Check if user exists
    const studentRepository = await connection.getRepository(Student);
    const user = await studentRepository.find({ where: { email: email } });
    if (user.length !== 0) {
      return res.status(401).send("User already exists");
    }
    //bcrypt users password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);
    //Enter new user inside student repository
    const newStudent = { firstName, lastName, email, password: bcryptPassword };
    const student = await studentRepository.create(newStudent);
    const results = await studentRepository.save(student);
    //Generate jwt token
    const token = jwtGenerator(JSON.stringify(results.studentid));
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//Login Route

router.post("/login", validateForm, async (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //Destructure req.body
    const { email, password } = req.body;
    //Check if user doesn't exist, if not throw error
    const studentRepository = await connection.getRepository(Student);
    const user = await studentRepository.find({ where: { email: email } });
    if (user.length === 0) {
      res.status(401).json("Email is incorrect");
    }
    //Check if incoming password is the same as the db password
    const isValid = await compare(password, user.map((data) => data.password).toString());
    if (!isValid) {
      res.status(401).json("Password is incorrect");
    }
    //Give user jwt token
    const token = jwtGenerator(JSON.stringify(user.map((data) => data.studentid)));
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
//Admins can only signup/login using their provided @link.com.au email address, this will be what distinguishes them from students
//I tried to include admin and student users in the same function using union types ie var user = (student||admin) but it wasnt working so I went with the seperate function approach
//admin routes
router.post("/register/admin", validateForm, async (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const { firstName, lastName, email, password } = req.body;
    const adminRepository = await connection.getRepository(admin);
    //Check if admin exists
    const user = await adminRepository.find({ where: { email: email } });
    if (user.length !== 0) {
      return res.status(401).send("Admin already exists");
    }
    //Encrypt password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);
    //Enter admin inside repo
    const newAdmin = { firstName, lastName, email, password: bcryptPassword };
    const adminUser = await adminRepository.create(newAdmin);
    const results = await adminRepository.save(adminUser);
    //Generate jwt
    const token = jwtGenerator(JSON.stringify(results.adminId));
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
router.post("/login/admin", validateForm, async (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //Destructure req.body
    const { email, password } = req.body;
    //Check if user doesn't exist, if not throw error
    const adminRepository = await connection.getRepository(admin);
    const user = await adminRepository.find({ where: { email: email } });
    if (user.length === 0) {
      res.status(401).json("Email is incorrect");
    }
    //Check if incoming password is the same as the db password
    const isValid = await compare(password, user.map((data) => data.password).toString());
    if (!isValid) {
      res.status(401).json("Password is incorrect");
    }
    //Give user jwt token
    const token = jwtGenerator(JSON.stringify(user.map((data) => data.adminId)));
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
