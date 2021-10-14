import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  console.log("Inside start");

  //All the following if checks are to satisfy typescript while accessing env variables.
  //Typescript will not be sure if the env variables are defined, so it throws error.
  // To satisfy typescript we write if checks before accessing them and typescript will not throw error.

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

    natsWrapper.client.on("close", () => {
      console.log("NATS terminated gracefully");
      process.exit();
    });

    new OrderCreatedListener(natsWrapper.client).listen();

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (err) {
    console.error(err);
  }
};

start();
