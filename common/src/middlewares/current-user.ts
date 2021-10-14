import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface userPayload {
  email: string;
  id: string;
}

//For modifying an existing interface, find the interface in it's namespace and modify it.
//Since we need to add currentuser to request object, modify it to have a currentUser field.
declare global {
  namespace Express {
    interface Request {
      currentUser: userPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session || !req.session.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as userPayload;
    req.currentUser = payload;
  } catch (err) {}
  next();
};
