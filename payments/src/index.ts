import mongoose from "mongoose";

import { app } from "./app";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  console.log("Inside start");

  //All the following if checks are to satisfy typescript while accessing env variables.
  //Typescript will not be sure if the env variables are defined, so it throws error.
  // To satisfy typescript we write if checks before accessing them and typescript will not throw error.
  if (!process.env.JWT_KEY) {
    throw new Error("JWT Key is not defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI Key is not defined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS Client id  Key is not defined");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS URL Key is not defined");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS cluster id Key is not defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
    natsWrapper.client.on("close", () => {
      console.log("NATS terminated gracefully");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connection success");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Payments service listening on port 3000");
  });
};

start();
