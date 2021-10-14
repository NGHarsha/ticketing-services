import express, { Request, Response } from "express";
import { body } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@ticketingng/common";

import { User } from "../models/User";

var router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (err) {
      console.log("Error querying ", err);
      throw new Error();
    }
    if (!existingUser) {
      console.log("User not found");
      throw new BadRequestError("Invalid credentials.");
    }
    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      throw new BadRequestError("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY! //typescript assumes that JWT_KEY may be undefined. To suppress the error add !.
    );

    //Since the front end is NextJS(Server side rendered),
    //Passing token via Authorization header is not suited, since we provide Html after rendering,
    //instead of JS files, as in normal react.
    //So, Frontend passes the token in a cookie.
    //Hence store token in cookie.
    req.session = { jwt: token };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
