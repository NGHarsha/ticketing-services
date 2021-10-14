import express from "express";
import "express-async-errors"; //For throwing errors inside async functions.
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@ticketingng/common";

import { createTicketRouter } from "./routes/new";
import { shoewTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

import nats, { Stan, Message } from "node-nats-streaming";

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

app.use(currentUser);
app.use(createTicketRouter);
app.use(shoewTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
