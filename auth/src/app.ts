import express from "express";
import "express-async-errors"; //For throwing errors inside async functions.
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@ticketingng/common";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";

const app = express();
app.set("trust proxy", true); //Tell express that it is behind a nginx proxy and it's fine.
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    //When secure is true, jwt will be created and sent with cookie only when the req is made via https.
    //In test environment, supertest don't have ability to make https request. Hence JWT related tests can't be done, if secure is true.
    //Hence make it conditional, so that secure will be false on testing environment.
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
