import jwt from "jsonwebtoken";
import dotenv from "dotenv";
const config = dotenv.config.toString();

function jwtGenerator(id: string){
    const payload = {
        student: id
    }
    return jwt.sign(payload, config, {expiresIn: "1hr"});

}

export default jwtGenerator;