import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Order } from "../../models/Order";
import { Ticket } from "../../models/Ticket";
import { OrderStatus } from "@ticketingng/common";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket doesn't exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = new Ticket({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = new Order({
    ticket,
    userId: "ladafadsgsfsa",
    status: OrderStatus.Complete,
    expiresAt: new Date(),
  });
  await order.save();

  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = new Ticket({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits an order created  event", async () => {
  const ticket = new Ticket({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
