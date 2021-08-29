import { NextFunction, Request, Response } from "express";

export const validateForm = async(req: Request, res: Response, next: NextFunction) => {
    const {email, firstName, lastName, password} = req.body;
    
    function validForm(userEmail: string){
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
    if (req.path === "/register") {
      console.log(!email.length);
      if (![email, password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (!validForm(email)) {
        return res.json("Invalid Email");
      }
    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (!validForm(email)) {
        return res.json("Invalid Email");
      }
    }
    next();
};
