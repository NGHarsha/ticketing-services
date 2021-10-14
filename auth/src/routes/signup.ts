import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@ticketingng/common";

import { User } from "../models/User";

var router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(email);
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (err) {
      console.log("Error querying ", err);
      throw new Error();
    }
    if (existingUser) {
      console.log("email in use");
      throw new BadRequestError("User exists already");
    }

    const user = new User({ email, password: password });
    await user.save();

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! //typescript assumes that JWT_KEY may be undefined. To suppress the error add !.
    );

    //Since the front end is NextJS(Server side rendered),
    //Passing token via Authorization header is not suited, since we provide Html after rendering,
    //instead of JS files, as in normal react.
    //So, Frontend passes the token in a cookie.
    //Hence store token in cookie.
    req.session = { jwt: token };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
